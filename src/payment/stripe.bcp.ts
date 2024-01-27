import { loadStripe, type Stripe, type StripeElements, type StripePaymentElement } from "@stripe/stripe-js";
import { type ConfirmPaymentData } from "@stripe/stripe-js/types/stripe-js/payment-intents";
import { type PaymentGatewayMethods } from "@/payment/types";
import { PaymentGatewayBase } from "@/payment/base";

class StripeGateway extends PaymentGatewayBase implements PaymentGatewayMethods {
	private stripe: Stripe;
	private elements: StripeElements;
	private paymentElement: StripePaymentElement;

	private constructor({ stripe, elements, ...opts }) {
		super(opts);
		this.elements = elements;
		this.stripe = stripe;
	}

	static transactionInitialize = async (id: string) =>
		PaymentGatewayBase.transactionInitialize({
			checkoutId: id,
			data: {
				automatic_payment_methods: {
					enabled: true,
				},
			},
		});

	static async initialize(opts) {
		// Should we check if it isn't loaded already?
		const stripe = await loadStripe(opts.publicKey);

		if (!stripe) {
			throw new Error("Could not load stripe.");
		}

		const elements = stripe.elements({ clientSecret: opts.clientSecret });
		if (!elements) {
			throw new Error("Could not create stripe elements instance.");
		}

		return new StripeGateway({ ...opts, stripe, elements });
	}

	async paymentSubmit({
		redirectUrl,
		redirect = "always",
		...opts
	}: Omit<ConfirmPaymentData, "return_url"> & {
		redirectUrl: string;
		redirect?: "always" | "if_required";
	}) {
		/**
		 * In case of successful payment, stripe will automatically redirect customer to `the opts.return_url`
		 */
		// TODO:
		// Should we force redirect or should we allow returning intent and processing it depending on the client?
		const { paymentIntent, error } = await this.stripe.confirmPayment({
			elements: this.elements,
			redirect: redirect as any,
			confirmParams: { ...opts, return_url: redirectUrl },
		});

		if (error) {
			this.options.onError?.({
				type: error.type,
				code: error.code,
				status: error,
				message: error.message,
				source: error,
			});
		}

		return paymentIntent;
	}

	mount(targetSelector: string) {
		this.paymentElement = this.elements.create("payment");
		this.paymentElement.mount(targetSelector);

		if (this.options.onChange) {
			this.paymentElement.on("change", this.options.onChange);
		}
	}

	unmount() {
		this.paymentElement.unmount();
	}
}

export default StripeGateway;
