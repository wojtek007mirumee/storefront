// App logic
import { initializePaymentHandler } from "./handlers/initialize-payment-handler";
import { createPaymentComponentHandler } from "./handlers/create-payment-component-handler";
import { executePaymentHandler } from "./handlers/execute-payment-handler";
// Infra logic
// import { initializeSaleorPaymentGateway, initializeSaleorTransaction } from "@/payment/transactions";
// import { initializeClientSDK } from "./infrastructure/initialize-client-sdk";
// import { getClientSDKMounters } from "./infrastructure/get-client-sdk-mounters";
// import { executePaymentInfra } from "./infrastructure/execute-payment-infra";
import { initializePaymentGatewayInfra } from "./infrastructure/initialize-payment-gateway-infra";
import { initializeSaleorStripeTransactionInfra } from "./infrastructure/initialize-saleor-stripe-transaction-infra";
import { initializeStripeClientInfra } from "./infrastructure/initialize-stripe-client-infra";
import { getStripeClientMountersInfra } from "./infrastructure/get-stripe-client-mounters-infra";
import { initializeAdyenClientInfra } from "./infrastructure/initialize-adyen-client-infra";
import { getAdyenClientMountersInfra } from "./infrastructure/get-adyen-client-mounters-infra";
import { executeStripePaymentInfra } from "./infrastructure/execute-stripe-payment-infra";
import { executeAdyenPaymentInfra } from "./infrastructure/execute-adyen-payment-infra";
import { initializeSaleorAdyenTransactionInfra } from "./infrastructure/initialize-saleor-adyen-transaction-infra";
import { executeAdyenTransactionHandler } from "./handlers/execute-adyen-transaction-handler"
import { processAdyenTransactionAdditionalInfoHandler } from "./handlers/process-adyen-transaction-additional-info-handler";
import { processSaleorTransactionInfra } from "./infrastructure/process-saleor-transaction-infra";
// const gatewayAppId = `app.saleor.stripe`;
// const gatewayAppId = `pkucmus-DEV-marina-adyen`;
// const adyenInitializePaymentGatewayInfra = 
// const stripeInitializePaymentGatewayInfra =

// TODO add everywhere Saleor to infra when needed

const stripe = {
    initializePaymentGateway: async variables => initializePaymentGatewayInfra({ gatewayAppId: `app.saleor.stripe`, ...variables }),
    initializeTransaction: initializeSaleorStripeTransactionInfra,
    initializeClient: initializeStripeClientInfra,
    getClientMounters: getStripeClientMountersInfra,
    executePayment: executeStripePaymentInfra
}
const adyen = {
    initializePaymentGateway: async variables => initializePaymentGatewayInfra({ gatewayAppId: `pkucmus-DEV-marina-adyen`, ...variables }),
    initializeTransaction: () => ({}),
    initializeClient: initializeAdyenClientInfra({
        executeTransaction: executeAdyenTransactionHandler({
            gatewayAppId: `pkucmus-DEV-marina-adyen`,
            initializeTransaction: initializeSaleorAdyenTransactionInfra
        }),
        processTransactionAdditionalInfo: processAdyenTransactionAdditionalInfoHandler({
            processTransaction: processSaleorTransactionInfra
        })
    }),
    getClientMounters: getAdyenClientMountersInfra,
    executePayment: executeAdyenPaymentInfra
}

const methods = {
    stripe,
    adyen
}

export const currentMethod = "adyen"
const currentInfra = methods[currentMethod]

const paymentService = {
    initializePayment: initializePaymentHandler({
        initializePaymentGateway: currentInfra.initializePaymentGateway,
        initializeTransaction: currentInfra.initializeTransaction
    }),
    createPaymentComponent: createPaymentComponentHandler({
        initializeClient: currentInfra.initializeClient,
        getClientMounters: currentInfra.getClientMounters
    }),
    executePayment: executePaymentHandler({
        executePayment: currentInfra.executePayment
    })
}



export default paymentService;