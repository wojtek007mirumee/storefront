"use client";

import { PaymentForm } from "@/payment-poc/PaymentForm";
import { type CheckoutFragment } from "@/gql/graphql";

export const StripeComponent = ({
	secretKey,
	publicKey,
	checkout,
}: {
	checkout: CheckoutFragment;
	secretKey: string;
	publicKey: string;
}) => {
	return <PaymentForm clientSecret={secretKey} publicKey={publicKey} />;
};
