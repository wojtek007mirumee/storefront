import AdyenCheckout from "@adyen/adyen-web";
import { type CoreOptions } from "@adyen/adyen-web/dist/types/core/types";


export const initializeAdyenClientInfra = ({
    executeTransaction,
    processTransactionAdditionalInfo
}) => async ({
    payment,
    checkoutId,
}: { payment: any, checkoutId: string }) => {
        // if (!clientSDK) {
        // stripe lib stripe do fe 
        console.log("payment: ", JSON.stringify(payment));
        // const client = await loadStripe(transaction.publicKey, { apiVersion: API_VERSION });
        const configuration: CoreOptions = {
            clientKey: payment.paymentGateway.clientKey,
            environment: payment.paymentGateway.environment,
            paymentMethodsResponse: payment.paymentGateway.paymentMethodsResponse,
            showPayButton: false,
            onSubmit: executeTransaction({ checkoutId }),
            // onSubmit: (response, _component) => {
            //     console.log("onSubmit", response, _component);
            // },
            onPaymentCompleted: (response, _component) => {
                console.log("onPaymentCompleted", response, _component);
            },
            onError: (error, _component) => {
                console.error('onError', error, _component);
            },
            onAdditionalDetails: processTransactionAdditionalInfo,
            // onAdditionalDetails: (response, _component) => {
            //     console.log("onAdditionalDetails", response, _component);
            // },
        };
        const client = await AdyenCheckout(configuration);

        if (!client) {
            return {
                errors: ["Could not load adyen."]
            }
        }

        return {
            client
        }
    }