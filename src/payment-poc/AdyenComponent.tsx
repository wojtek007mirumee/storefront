"use client";

import { type FormEventHandler, useState } from "react";
import { useRouter } from "next/navigation";
import { type CoreOptions } from "@adyen/adyen-web/dist/types/core/types";
import { Button } from "@/checkout/components";
import { Loader } from "@/payment-poc/Loader";
import { type CheckoutFragment } from "@/gql/graphql";
import { GatewayPaymentTargetElement } from "@/payment-poc/GatewayPaymentTargetElement";

export const AdyenComponent = ({
	secretKey,
	publicKey,
	checkout,
}: {
	checkout: CheckoutFragment;
	secretKey: string;
	publicKey: string;
}) => {
	const [isProcessing, setIsProcessing] = useState(false);
	const { push } = useRouter();

	const isInitializing = false;

	const handleSubmit: FormEventHandler = async (evt) => {
		evt.preventDefault();
		setIsProcessing(true);

		const configuration: CoreOptions = {
			amount: checkout.totalPrice.gross.amount,
		};
		// const checkout = await AdyenCheckout(configuration);

		// if (error) {
		// 	return alert(`confirmPayment error: ${JSON.stringify(error)}`);
		// }
		//
		// if (paymentIntent.status === "succeeded") {
		// 	const params = new URLSearchParams();
		// 	params.append("payment_intent", paymentIntent.id);
		// 	params.append("payment_intent_client_secret", paymentIntent.client_secret);
		// 	push(`${getRedirectUrl()}?${params.toString()}`);
		// } else {
		// 	console.log({ error, paymentIntent });
		//
		// 	setIsProcessing(false);
		// }
	};

	return (
		<form onSubmit={handleSubmit}>
			<GatewayPaymentTargetElement />

			{isProcessing ? (
				<Loader />
			) : (
				<Button type="submit" disabled={isInitializing} variant="secondary" label="Pay $" className="mt-5" />
			)}
		</form>
	);
};
