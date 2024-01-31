import { initializePaymentHandler } from "./handlers/initialize-payment-handler";
import { createPaymentComponentHandler } from "./handlers/create-payment-component-handler";
import { executePaymentHandler } from "./handlers/execute-payment-handler";
import { initializeSaleorPaymentGateway, initializeSaleorTransaction } from "@/payment/transactions";
import { initializeClientSDK } from "./infrastructure/initialize-client-sdk";
import { getClientSDKMounters } from "./infrastructure/get-client-sdk-mounters";
import { executePaymentInfra } from "./infrastructure/execute-payment-infra";

const gatewayAppId = `app.saleor.stripe`;
// const gatewayAppId = `app.saleor.adyen`;

const paymentService = {
    initializePayment: initializePaymentHandler({
        // TODO weird lack of consistency in this infrastructure hraphql methods varaibles they take, shoule be unified
        // TODO this injected params should be in infrastructure layer
        initializePaymentGateway: async variables => initializeSaleorPaymentGateway({ gatewayAppId, ...variables }),
        initializeTransaction: async variables => initializeSaleorTransaction({
            data: {
                automatic_payment_methods: {
                    enabled: true,
                },
            },
            ...variables
        }),
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

export default paymentService;