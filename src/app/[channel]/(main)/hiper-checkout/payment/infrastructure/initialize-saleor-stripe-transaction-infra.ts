import { initializeSaleorTransaction } from "@/payment/transactions";

export const initializeSaleorStripeTransactionInfra = async variables => {


    const { errors, publicKey, secretKey, transactionId } = await initializeSaleorTransaction({
        data: {
            automatic_payment_methods: {
                enabled: true,
            },
        },
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
            publicKey, secretKey, transactionId
        }
    }
}