import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { executeGraphQL } from "@/lib/graphql";
import { GetCheckoutByIdDocument } from "@/gql/graphql";
import { channelSlug } from "@/payment-poc/helpers";

export async function getCheckoutFromCookiesOrRedirect() {
	const checkoutId = cookies().get("checkoutId")?.value;

	if (!checkoutId) {
		redirect(`${channelSlug}/stripe`);
	}

	const checkout = await executeGraphQL(GetCheckoutByIdDocument, {
		variables: {
			id: checkoutId,
		},
		cache: "no-store",
	});

	if (!checkout.checkout) {
		// https://github.com/vercel/next.js/issues/51875
		// cookies().set("checkoutId", "");
		redirect(`${channelSlug}/stripe`);
	}

	return checkout.checkout;
}
