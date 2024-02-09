import {
    loadStripe,
    type Stripe as StripeClient,
    type StripeElements,
    type StripePaymentElement,
} from "@stripe/stripe-js";

const API_VERSION = "2022-11-15";

export const initializeStripeClientInfra = async ({ payment }: { payment: any }) => {
    // if (!clientSDK) {
    // stripe lib stripe do fe 
    console.log("transaction: ", JSON.stringify(payment));
    const client = await loadStripe(payment.transaction.publicKey, { apiVersion: API_VERSION });

    if (!client) {
        return {
            errors: ["Could not load stripe."]
        }
    }

    return {
        client
    }
}