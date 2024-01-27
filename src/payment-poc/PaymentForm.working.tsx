"use client";

import { type FormEventHandler, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe, type Stripe, type StripeElements, type StripePaymentElement } from "@stripe/stripe-js";
import { Button } from "@/checkout/components";
import { getRedirectUrl, paymentElementId } from "@/payment-poc/helpers";
import { GatewayPaymentTargetElement } from "@/payment-poc/GatewayPaymentTargetElement";
import { Loader } from "@/payment-poc/Loader";

interface PaymentGateway {
	constructor(clientSecret: string, publicKey: string): void;
	initialize(): Promise<void>;
}

class StripeGatewayCheckout {
	private stripe: Stripe;
	private elements: StripeElements;
	private paymentElement: StripePaymentElement;

	constructor(clientSecret: string, publicKey: string) {
		this.clientSecret = clientSecret;
		this.publicKey = publicKey;
	}

	async initialize(clientSecret: string, publicKey: string, dropinOpts) {
		const stripe_ = await loadStripe(publicKey);
		if (!stripe_) {
			throw new Error("Could not load stripe.");
		}

		const elements_ = stripe_.elements({ clientSecret });
		if (!elements_) {
			throw new Error("Could not create stripe elements instance.");
		}
		this.stripe = stripe_;
		this.elements = elements_;
	}

	mount(targetSelector: string) {
		this.paymentElement = this.elements.create("payment");
		this.paymentElement.mount(targetSelector);
	}

	unmount() {
		this.paymentElement.unmount();
	}
}

type CheckoutOpts = {
	clientSecret: string
	publicKey: string
}
async function MarinaCheckout({clientSecret,publicKey}: CheckoutOpts) {
	const checkout = new StripeGatewayCheckout(clientSecret,publicKey);
	return await checkoutinitialize();
}

// const PaymentGateway = {
// 	async initialize() {},
// 	mount() {},
// };

export const PaymentForm = ({ clientSecret, publicKey }: { clientSecret: string; publicKey: string }) => {
	// const stripe = useStripe();
	// const elements = useElements();
	const [isProcessing, setIsProcessing] = useState(false);
	const [isInitializing, setIsInitializing] = useState(true);
	const { push } = useRouter();
	const [stripe, setStripe] = useState<Stripe | null>(null);
	const [elements, setElements] = useState<StripeElements | null>(null);

	useEffect(() => {
		(async () => {
			const stripe = await loadStripe(publicKey);

			if (stripe) {
				setStripe(stripe);

				const elements = stripe.elements({
					clientSecret,
				});

				if (elements) {
					setElements(elements);
					const paymentElement = elements.create("payment");
					paymentElement.mount(`#${paymentElementId}`);
				}
			}
			setIsInitializing(false);
		})();
	}, []);

	const handleSubmit: FormEventHandler = async (evt) => {
		evt.preventDefault();
		setIsProcessing(true);

		if (!stripe || !elements) {
			return;
		}

		const { error, paymentIntent } = await stripe.confirmPayment({
			elements,
			redirect: "if_required",
			confirmParams: {
				return_url: getRedirectUrl(),
			},
		});

		if (error) {
			return alert(`confirmPayment error: ${JSON.stringify(error)}`);
		}

		if (paymentIntent.status === "succeeded") {
			const params = new URLSearchParams();
			params.append("payment_intent", paymentIntent.id);
			params.append("payment_intent_client_secret", paymentIntent.client_secret);
			push(`${getRedirectUrl()}?${params.toString()}`);
		} else {
			console.log({ error, paymentIntent });

			setIsProcessing(false);
		}
	};

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
