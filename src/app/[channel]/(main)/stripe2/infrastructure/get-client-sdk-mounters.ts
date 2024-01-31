import {
    loadStripe,
    type Stripe as StripeClient,
    type StripeElements,
    type StripePaymentElement,
} from "@stripe/stripe-js";

const API_VERSION = "2022-11-15";

export const getClientSDKMounters = async ({ clientSDK, secretKey }) => {


    // if (!elements) {
    // stripe create elements , connectedto to payment secret
    const elements = clientSDK.elements({ clientSecret: secretKey });
    if (!elements) {
        return { error: "Could not create stripe elements instance." }
    }
    // }

    let paymentElement = elements.create("payment");

    const mount = (targetSelector: string) => {
        if (!paymentElement) {
            return { error: "paymentElement not initiated." }
        }

        paymentElement.mount(targetSelector);

        // add when it will be used
        // if (options?.onChange) {
        //     paymentElement.on("change", options.onChange);
        // }
    }

    const unmount = () => {
        paymentElement?.unmount();
        /**
         * New intent  (client secret) requires creation of new elements object.
         */
        paymentElement = null;
    }
    return {
        mount,
        unmount
    }
}