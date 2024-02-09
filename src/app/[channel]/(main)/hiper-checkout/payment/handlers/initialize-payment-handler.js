export const initializePaymentHandler = ({
    initializePaymentGateway,
    initializeTransaction,
    // initializeClientSDK
}) => async ({
    checkoutId,
    amount,
    // checkout//maybe use instead of checkoutId and amount, than use methods on this object
}) => {

        // Why we need to do two calls instead of making one ot the saleor backend?
        // const { paymentGateway, isSuccess, error } 
        const { /*publicKey,*/ errors: paymentGatewayErrors, paymentGateway } = await initializePaymentGateway({
            id: checkoutId,
            amount,
        })
        console.log(' paymentGateway', paymentGateway, 'paymentGatewayErrors', paymentGatewayErrors)
        if (paymentGatewayErrors && paymentGatewayErrors.length > 0) {
            return { errors: paymentGatewayErrors }
        }

        // const { transaction, isSuccess, error }
        const { errors: transactionErrors, transaction } = await initializeTransaction({
            id: checkoutId,
        })
        console.log(' paymentGateway', paymentGateway, 'transactionErrors', transactionErrors)
        if (transactionErrors && transactionErrors.length > 0) {
            return { errors: transactionErrors }
        }
        return {
            payment: {
                paymentGateway,
                transaction
            }
        }
        // const { mount, unmount, errors: clientSDKErrors } = await initializeClientSDK({
        //     publicKey, secretKey
        // })
        // if (clientSDKErrors && clientSDKErrors.length > 0) {
        //     return { errors: clientSDKErrors }
        // }

        // return {
        //     publicKey,
        //     secretKey,
        //     transactionId,
        //     mount,
        //     unmount,
        // }
    }