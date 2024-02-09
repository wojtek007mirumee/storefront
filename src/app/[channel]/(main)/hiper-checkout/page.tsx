import { cookies } from "next/headers";
import { CheckoutCreate } from "@/payment-poc/CheckoutCreate";
import { redirect } from 'next/navigation';

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
	console.log('searchParams', searchParams)
	console.log('params', params)
	console.log('checkoutId', checkoutId)
	if (checkoutId) {
		redirect(`/${params.channel}/hiper-checkout/payment`)
	}

	return (
		<CheckoutCreate />
	);
}
