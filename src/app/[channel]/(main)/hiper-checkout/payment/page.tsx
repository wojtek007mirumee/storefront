import { cookies } from "next/headers";
import { CheckoutCreate } from "@/payment-poc/CheckoutCreate";
import { executeGraphQL } from "@/lib/graphql";
import { CheckoutFindDocument } from "@/gql/graphql";
import { StripeComponent } from "@/payment-poc/StripeComponent";
import { TransactionInitialize } from "@/payment-poc/TransactionInitialize";
import { ClearCookiesButton } from "@/payment-poc/ClearCookiesButton";
import { InitializePaymentBtn } from "./components/initialize-payment-btn";
import Payment from "./payment";
import { gatewayAppId } from "@/checkout/lib/utils/common";
import { redirect } from 'next/navigation';
import paymentService from "./payment-service"

export default async function Page({
	searchParams,
	params,
}: {
	searchParams: Record<
		"query" | "cursor" | "checkoutId",
		string | string[] | undefined
	>;
	params: { channel: string };
}) {
	const checkoutId = searchParams?.checkoutId ?? cookies().get("checkoutId")?.value;
	if (!checkoutId) {
		redirect(`/${params.channel}/hiper-checkout`)
	}
	// HIDE IT IN SERVICE 
	const { checkout } = await executeGraphQL(CheckoutFindDocument, {
		variables: { id: checkoutId as string },
		revalidate: 60,
	})

	console.log('checkout', checkout)
	if (!checkout) {
		redirect(`/${params.channel}/hiper-checkout`)
	}
	const { errors, payment } = await paymentService.initializePayment({
		checkoutId: checkout.id,
		amount: checkout.totalPrice.gross.amount
		// or pass just checkout object and use methods on it to get values
	});
	console.log('errors, payment', errors, payment)
	if (!payment) {
		return (
			<p>Failed to initialize payment</p>
		)
	}

	return (
		<>
			<p>Payment</p>
			<Payment payment={payment} checkoutId={checkoutId} />
		</>
	);
}
