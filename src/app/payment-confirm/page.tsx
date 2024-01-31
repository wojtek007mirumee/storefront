import { redirect } from "next/navigation";
import { getCheckoutFromCookiesOrRedirect } from "@/payment-poc/appRouterHelpers";
import { CheckoutCompleteDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { gatewayAppId } from "@/checkout/lib/utils/common";
import { channelSlug } from "@/payment-poc/helpers";
import { paymentGatewayService } from "@/payment/service";

// po stronie server masz w urlu payment_intent_id i payment_intent_client_secret
// cel: ciagnicij ze stripe status platnosci i jezeli correct to tworzysz object orderu z checkout w saleor

// scree nfor confirmation of payment (after redirect from stripe)
export default async function CartPaymentPage({
	searchParams,
}: {
	// these params are provided by Stripe https://stripe.com/docs/payments/accept-a-payment?platform=web&ui=elements#web-submit-payment
	searchParams: { payment_intent?: string; payment_intent_client_secret?: string };
}) {
	// moze instead use some checkConfirmationParams service function
	if (!searchParams.payment_intent || !searchParams.payment_intent_client_secret) {
		// channel slug also should be passed in params
		redirect(`/${channelSlug}/stripe`);
	}


	// this is needed to get checkoutId from cookies, mozna to z intent wyciagnac 
	// moze wezmiemy z search params bo wszedzenie to jest tak przekazywane
	// use one method cookies or params
	const checkout = await getCheckoutFromCookiesOrRedirect();

	// initialize factory
	const paymentGateway = paymentGatewayService({ gatewayAppId });

	// sahred betwen pages, needed to initialize factory 
	const { errors, publicKey } = await paymentGateway.initializeSaleorPaymentGateway({ id: checkout.id });

	if (errors.length) {
		return (
			<div className="text-red-500">
				<p>Failed to initialize Stripe transaction</p>
				<pre>{JSON.stringify(paymentGateway, null, 2)}</pre>
			</div>
		);
	}

	// everything below put into this service function
	// const {error,redirectUrl}=processPaymentResult(paymentIntent)

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
