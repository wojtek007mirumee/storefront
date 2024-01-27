import {
	loadStripe,
	type Stripe as StripeClient,
	type StripeElements,
	type StripePaymentElement,
} from "@stripe/stripe-js";
import { type ConfirmPaymentData } from "@stripe/stripe-js/types/stripe-js/payment-intents";
import Stripe, { type Stripe as StripeApi } from "stripe";

import { invariant } from "ts-invariant";
import { type PaymentGatewayOptions } from "@/payment/types";
import { initializeSaleorPaymentGateway, initializeSaleorTransaction } from "@/payment/transactions";

const API_VERSION = "2022-11-15";

/** SERVER
 * const paymentGateway = paymentGatewayService({ gatewayAppId });
 * await paymentGateway.initializeSaleorPaymentGateway() // save publicKey
 * await paymentGateway.initializeApiSDK() // initiate server sdk
 * await paymentGateway.paymentGet() // retrieve payment intent
 */

/** CLIENT
 * const paymentGateway = paymentGatewayService({ gatewayAppId, ...opts });
 * await paymentGateway.initializeSaleorPaymentGateway() // save publicKey
 * await paymentGateway.initializeSaleorTransaction() // save client secret
 * await paymentGateway.initializeClientSDK() // initiate client sdk, create elements object from payment intent secret
 * await mount('#payment-element') // create payment element and mount it
 * await pay() // authorize/capture payment intent using payment element
 * */

const stripeGateway = (options: PaymentGatewayOptions) => {
	let clientSDK: StripeClient | null;
	let apiSDK: StripeApi | null;
	let paymentElement: StripePaymentElement | null = null;
	let elements: StripeElements | null;

	return {
		async initializeSaleorPaymentGateway(variables) {
			return initializeSaleorPaymentGateway({
				...variables,
				gatewayAppId: options.gatewayAppId,
			});
		},

		async initializeSaleorTransaction(id: string) {
			return initializeSaleorTransaction({
				id,
				data: {
					automatic_payment_methods: {
						enabled: true,
					},
				},
			});
		},

		initializeApiSDK(publicKey: string) {
			if (!apiSDK) {
				apiSDK = new Stripe(publicKey, { apiVersion: API_VERSION });

				invariant(apiSDK, "Could not load stripe.");
			}

			return { stripe: apiSDK };
		},

		async paymentGet(id: string, secret: string) {
			invariant(apiSDK, "apiSDK not initiated.");

			const intent = await apiSDK.paymentIntents.retrieve(id, { client_secret: secret });

			return intent;
		},

		async initializeClientSDK(publicKey: string, secretKey: string) {
			if (!clientSDK) {
				clientSDK = await loadStripe(publicKey, { apiVersion: API_VERSION });

				invariant(clientSDK, "Could not load stripe.");
			}

			if (!elements) {
				elements = clientSDK.elements({ clientSecret: secretKey });
				invariant(elements, "Could not create stripe elements instance.");
			}
		},

		async pay({
			redirect = "always",
			...opts
		}: ConfirmPaymentData & {
			redirect?: "always" | "if_required";
		}) {
			invariant(clientSDK && elements, "clientSDK not initiated.");

			/**
			 * Using always upon successful payment client will be always redirected to `confirmParams.return_url`.
			 */
			const { paymentIntent, error } = await clientSDK.confirmPayment({
				elements,
				redirect: redirect as any,
				confirmParams: opts,
			});

			if (error) {
				options.onError?.({
					type: error.type,
					code: error.code,
					status: error,
					message: error.message,
					source: error,
				});
			}

			invariant(paymentIntent, "Unexpected payment intent state.");

			return { id: paymentIntent.id, secret: paymentIntent.client_secret, data: paymentIntent };
		},

		mount(targetSelector: string) {
			invariant(elements, "clientSDK not initiated.");

			paymentElement = elements.create("payment");
			paymentElement.mount(targetSelector);

			if (options?.onChange) {
				paymentElement.on("change", options.onChange);
			}
		},

		unmount() {
			paymentElement?.unmount();
			/**
			 * New intent  (client secret) requires creation of new elements object.
			 */
			elements = null;
		},
	};
};

export default stripeGateway;
