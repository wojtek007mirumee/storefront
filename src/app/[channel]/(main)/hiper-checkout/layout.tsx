import { cookies } from "next/headers";
import { CheckoutCreate } from "@/payment-poc/CheckoutCreate";
import { executeGraphQL } from "@/lib/graphql";
import { CheckoutFindDocument } from "@/gql/graphql";
import { StripeComponent } from "@/payment-poc/StripeComponent";
import { TransactionInitialize } from "@/payment-poc/TransactionInitialize";
import { ClearCookiesButton } from "@/payment-poc/ClearCookiesButton";
import { InitializePaymentBtn } from "./tmp/initialize-payment-btn";
import { gatewayAppId } from "@/checkout/lib/utils/common";
import { currentMethod } from "./payment/payment-service";

export default async function Layout({
	children
}) {


	return (
		<section className="mx-auto max-w-7xl p-8 pb-16">
			<h1 className="pb-8 text-xl font-semibold">
				<pre>{currentMethod}</pre>
			</h1>
			{children}
			<br />
			<ClearCookiesButton />
		</section>
	);
}
