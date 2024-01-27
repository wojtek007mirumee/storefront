import { cookies } from "next/headers";
import { CheckoutCreate } from "@/payment-poc/CheckoutCreate";
import { executeGraphQL } from "@/lib/graphql";
import { CheckoutFindDocument } from "@/gql/graphql";
import { StripeComponent } from "@/payment-poc/StripeComponent";
import { TransactionInitialize } from "@/payment-poc/TransactionInitialize";
import { ClearCookiesButton } from "@/payment-poc/ClearCookiesButton";

export default async function Page({
	searchParams,
	params,
}: {
	searchParams: Record<
		"query" | "cursor" | "checkoutId" | "secretKey" | "publicKey",
		string | string[] | undefined
	>;
	params: { channel: string };
}) {
	const checkoutId = cookies().get("checkoutId")?.value;
	const secretKey = cookies().get("secretKey")?.value;
	const publicKey = cookies().get("publicKey")?.value;

	let checkout = null;

	if (checkoutId) {
		checkout = (
			await executeGraphQL(CheckoutFindDocument, {
				variables: { id: checkoutId },
				revalidate: 60,
			})
		).checkout;
	}

	return (
		<section className="mx-auto max-w-7xl p-8 pb-16">
			<h1 className="pb-8 text-xl font-semibold">STRIPE</h1>
			{!checkoutId && <CheckoutCreate />}
			{checkout &&
				(secretKey && publicKey ? (
					<StripeComponent secretKey={secretKey} publicKey={publicKey} checkout={checkout} />
				) : (
					<TransactionInitialize checkout={checkout} />
				))}
			<br />
			<ClearCookiesButton />
		</section>
	);
}
