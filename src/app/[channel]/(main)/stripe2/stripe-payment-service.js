// App logic
import { initializePaymentHandler } from "./handlers/initialize-payment-handler";
import { createPaymentComponentHandler } from "./handlers/create-payment-component-handler";
import { executePaymentHandler } from "./handlers/execute-payment-handler";
// Infra logic
import { initializeSaleorPaymentGateway, initializeSaleorTransaction } from "@/payment/transactions";
import { initializeClientSDK } from "./infrastructure/initialize-client-sdk";
import { getClientSDKMounters } from "./infrastructure/get-client-sdk-mounters";
import { executePaymentInfra } from "./infrastructure/execute-payment-infra";

const gatewayAppId = `app.saleor.stripe`;
// const gatewayAppId = `pkucmus-DEV-marina-adyen`;

const paymentService = {
    initializePayment: initializePaymentHandler({
        initializePaymentGateway: genericInitializePaymentGatewayInfra,
        initializeTransaction: stripeInitializeTransactionInfra
        // initializeTransaction: adyenInitializeTransactionInfra
    }),
    createPaymentComponent: createPaymentComponentHandler({
        initializeClientSDK: initializeClientSDK,
        getClientSDKMounters: getClientSDKMounters
    }),
    executePayment: executePaymentHandler({
        initializeClientSDK: initializeClientSDK,
        executePayment: executePaymentInfra

    })
}

// start INIT PAYMENT
// TODO weird lack of consistency in this infrastructure hraphql methods varaibles they take, shoule be unified
// TODO this injected params should be in infrastructure layer
const genericInitializePaymentGatewayInfra = async variables => initializeSaleorPaymentGateway({ gatewayAppId, ...variables });
const stripeInitializeTransactionInfra = async variables => initializeSaleorTransaction({
    data: {
        automatic_payment_methods: {
            enabled: true,
        },
    },
    ...variables
})
const adyenInitializeTransactionInfra = async () => ({})
// end INIT PAYMENT

// start CREATE PAYMENT COMPONENT

// end CREATE PAYMENT COMPONENT


export default paymentService;