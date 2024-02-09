import { cookies } from "next/headers";
import { CheckoutCreate } from "@/payment-poc/CheckoutCreate";
import { executeGraphQL } from "@/lib/graphql";
import { CheckoutFindDocument } from "@/gql/graphql";
import { StripeComponent } from "@/payment-poc/StripeComponent";
import { TransactionInitialize } from "@/payment-poc/TransactionInitialize";
import { ClearCookiesButton } from "@/payment-poc/ClearCookiesButton";
import { InitializePaymentBtn } from "./components/initialize-payment-btn";
import { Payment } from "./payment";
import { gatewayAppId } from "@/checkout/lib/utils/common";
import { redirect } from 'next/navigation';

export default async function Loading({
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

	return (
		<p>Loading... checkoutId:{checkoutId}</p>
		// <Payment checkout={checkout} />
	);
}
