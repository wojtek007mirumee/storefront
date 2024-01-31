"use client";

import { type FormEventHandler, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/checkout/components";
import { getRedirectUrl, paymentElementId } from "@/payment-poc/helpers";
import { GatewayPaymentTargetElement } from "@/payment-poc/GatewayPaymentTargetElement";
import { Loader } from "@/payment-poc/Loader";
import { type PaymentGatewayService, paymentGatewayService } from "@/payment/service";
import { gatewayAppId } from "@/checkout/lib/utils/common";

export const PaymentForm = ({ clientSecret, publicKey }: { clientSecret: string; publicKey: string }) => {
	// const stripe = useStripe();
	// const elements = useElements();
	const [isProcessing, setIsProcessing] = useState(false);
	const [isInitializing, setIsInitializing] = useState(true);
	const { push } = useRouter();
	// const [stripe, setStripe] = useState<Stripe | null>(null);
	// const [elements, setElements] = useState<StripeElements | null>(null);

	const [paymentGateway, setPaymentGateway] = useState<PaymentGatewayService | undefined>();

	const handlePaymentSuccess = async ({ id, secret }) => {
		const params = new URLSearchParams();
		params.append("payment_intent", id);
		params.append("payment_intent_client_secret", secret);
		push(`${getRedirectUrl()}?${params.toString()}`);
	};
	const handleChange = (...opts) => console.log(opts);

	const handleSubmit: FormEventHandler = async (evt) => {
		evt.preventDefault();
		setIsProcessing(true);

		if (!paymentGateway) {
			return;
		}

		// factory function to pay
		await paymentGateway.pay({ return_url: getRedirectUrl() });
	};

	useEffect(() => {
		(async () => {
			// stripe preapre factory
			const paymentGateway = paymentGatewayService({
				gatewayAppId,
				onPaymentSuccess: handlePaymentSuccess,
				onChange: handleChange,
			});

			setPaymentGateway(paymentGateway);

			// stripe iniclizacja factory
			await paymentGateway.initializeClientSDK(publicKey, clientSecret);

			// zamootowanie z factory
			paymentGateway.mount(`#${paymentElementId}`);

			setIsInitializing(false);

			// umonut z facotry
			return () => paymentGateway.unmount(); // this wont work it needs to be from higher scope of useEffect
		})();
	}, []);

	return (
		<form onSubmit={handleSubmit}>
			<GatewayPaymentTargetElement />

			{!isInitializing &&
				(isProcessing ? (
					<Loader />
				) : (
					<Button
						type="submit"
						disabled={isInitializing}
						variant="secondary"
						label={isInitializing ? "..." : "Pay $"}
						className="mt-5"
					/>
				))}
		</form>
	);
};
