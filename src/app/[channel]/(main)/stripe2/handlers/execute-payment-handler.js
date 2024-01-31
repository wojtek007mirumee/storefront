export const executePaymentHandler = ({
    initializeClientSDK,
    executePaymentInfra
}) => async ({
    publicKey,
    redirectUrl,
}) => {
        const { clientSDK, errors: clientSDKErrors } = await initializeClientSDK({
            publicKey
        })
        if (clientSDKErrors && clientSDKErrors.length > 0) {
            return { errors: clientSDKErrors }
        }
        const { paymentIntent, errors: paymentErrors } = await executePaymentInfra({
            clientSDK, redirectUrl
        })
        if (paymentErrors && paymentErrors.length > 0) {
            return { errors: paymentErrors }
        }

        return {
            paymentIntent
        }
    }