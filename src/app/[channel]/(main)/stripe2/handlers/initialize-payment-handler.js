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
        const { /*publicKey,*/ errors: paymentGatewayErrors } = await initializePaymentGateway({
            id: checkoutId,
            amount,
        })
        if (paymentGatewayErrors && paymentGatewayErrors.length > 0) {
            return { errors: paymentGatewayErrors }
        }
        // const { transaction, isSuccess, error }
        const { errors: transactionErrors, publicKey, secretKey, transactionId } = await initializeTransaction({
            id: checkoutId,
        })
        if (transactionErrors && transactionErrors.length > 0) {
            return { errors: transactionErrors }
        }
        return {
            publicKey,
            secretKey,
            transactionId,
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