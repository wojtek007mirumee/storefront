import { redirect } from "next/navigation";
import { getCheckoutFromCookiesOrRedirect } from "@/payment-poc/appRouterHelpers";
import { CheckoutCompleteDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { gatewayAppId } from "@/checkout/lib/utils/common";
import { channelSlug } from "@/payment-poc/helpers";
import { paymentGatewayService } from "@/payment/service";

export default async function CartPaymentPage({
	searchParams,
}: {
	// these params are provided by Stripe https://stripe.com/docs/payments/accept-a-payment?platform=web&ui=elements#web-submit-payment
	searchParams: { payment_intent?: string; payment_intent_client_secret?: string };
}) {
	if (!searchParams.payment_intent || !searchParams.payment_intent_client_secret) {
		redirect(`/${channelSlug}/stripe`);
	}

	const checkout = await getCheckoutFromCookiesOrRedirect();

	const paymentGateway = paymentGatewayService({ gatewayAppId });
	const { errors, publicKey } = await paymentGateway.initializeSaleorPaymentGateway({ id: checkout.id });

	if (errors.length) {
		return (
			<div className="text-red-500">
				<p>Failed to initialize Stripe transaction</p>
				<pre>{JSON.stringify(paymentGateway, null, 2)}</pre>
			</div>
		);
	}

	paymentGateway.initializeApiSDK(publicKey);
	const paymentIntent = await paymentGateway.paymentGet(
		searchParams.payment_intent,
		searchParams.payment_intent_client_secret,
	);

	if (paymentIntent.status === "processing") {
		// @todo refresh
		return <p>Payment processing. We&apos;ll update you when payment is received.</p>;
	}
	if (paymentIntent.status === "requires_payment_method") {
		redirect(`/${channelSlug}/stripe/`);
	}

	if (["requires_capture", "succeeded"].includes(paymentIntent.status)) {
		const order = await executeGraphQL(CheckoutCompleteDocument, {
			variables: {
				checkoutId: checkout.id,
			},
		});

		if (
			order.checkoutComplete?.errors.length ||
			order.checkoutComplete?.order?.errors.length ||
			!order.checkoutComplete?.order
		) {
			return (
				<div className="text-red-500">
					<p>Failed to finalize order</p>
					<pre>{JSON.stringify(order, null, 2)}</pre>
				</div>
			);
		}
		redirect(`/checkout/?order=${order.checkoutComplete.order.id}`);
	}
}
