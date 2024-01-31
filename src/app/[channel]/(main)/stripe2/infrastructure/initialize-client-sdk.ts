import {
    loadStripe,
    type Stripe as StripeClient,
    type StripeElements,
    type StripePaymentElement,
} from "@stripe/stripe-js";

const API_VERSION = "2022-11-15";

export const initializeClientSDK = async ({ publicKey }: { publicKey: string }) => {
    // if (!clientSDK) {
    // stripe lib stripe do fe 
    const clientSDK = await loadStripe(publicKey, { apiVersion: API_VERSION });

    if (!clientSDK) {
        return {
            error: "Could not load stripe."
        }
    }

    return {
        clientSDK
    }
}