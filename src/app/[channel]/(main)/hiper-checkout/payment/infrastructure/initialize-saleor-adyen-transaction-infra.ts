import { initializeSaleorTransaction } from "@/payment/transactions";

export const initializeSaleorAdyenTransactionInfra = async variables => {

    // TODO here will be implemented the content of initializeSaleorTransaction
    const {
        errors,
        publicKey,
        secretKey,
        transactionId,
        transactionEventType,
        transactionData
    } = await initializeSaleorTransaction({
        ...variables
    })
    if (errors && errors.length) {
        return {
            errors
        }
    }

    return {
        errors,
        transaction: {
            publicKey,
            secretKey,
            transactionId,
            transactionEventType,
            transactionData
        }
    }
}