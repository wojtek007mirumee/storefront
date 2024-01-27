"use client";
import { useState } from "react";
import { PacmanLoader } from "react-spinners";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Button } from "@/checkout/components";
import { executeGraphQL } from "@/lib/graphql";
import {
	type AddressInput,
	CheckoutCreateDocument,
	CheckoutDeliveryMethodUpdateDocument,
	CountryCode,
} from "@/gql/graphql";
import { channelSlug } from "@/payment-poc/helpers";

export const CheckoutCreate = () => {
	const [processing, setProcessing] = useState(false);
	const { refresh } = useRouter();

	const handleClick = async () => {
		setProcessing(true);

		const email = "piotr.grundas@mirumee.com";
		const address: AddressInput = {
			city: "city",
			streetAddress1: "streetAddress1",
			postalCode: "11-111",
			country: CountryCode.Pl,
			firstName: "Mirumee",
			lastName: "Rock",
			phone: "123123123",
		};

		const { checkoutCreate } = await executeGraphQL(CheckoutCreateDocument, {
			withAuth: false,
			variables: {
				channel: channelSlug,
				billingAddress: address,
				shippingAddress: address,
				lines: [{ variantId: "UHJvZHVjdFZhcmlhbnQ6MzQ2", quantity: 1 }],
				email,
			},
		});

		if (checkoutCreate?.errors.length) {
			return alert(`Failed to crate a checkout: ${JSON.stringify(checkoutCreate.errors)}`);
		}

		let checkout = checkoutCreate!.checkout!;

		const { checkoutDeliveryMethodUpdate } = await executeGraphQL(CheckoutDeliveryMethodUpdateDocument, {
			withAuth: false,
			variables: {
				checkoutId: checkout.id,
				deliveryMethodId: checkout.shippingMethods?.[0]?.id,
			},
		});

		if (checkoutDeliveryMethodUpdate?.errors.length) {
			return alert(
				`Failed to update delivery method: ${JSON.stringify(checkoutDeliveryMethodUpdate.errors)}`,
			);
		}

		checkout = checkoutDeliveryMethodUpdate!.checkout!;

		Cookies.set("checkoutId", checkout.id);
		refresh();
		setProcessing(false);
	};

	return processing ? (
		<PacmanLoader size="15px" />
	) : (
		<Button onClick={handleClick} variant="secondary" label="Checkout create"></Button>
	);
};
