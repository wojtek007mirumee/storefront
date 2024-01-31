export const createPaymentComponentHandler = ({
    initializeClientSDK,
    getClientSDKMounters
}) => async ({
    publicKey,
    secretKey
}) => {
        const { clientSDK, errors: clientSDKErrors } = await initializeClientSDK({
            publicKey
        })
        if (clientSDKErrors && clientSDKErrors.length > 0) {
            return { errors: clientSDKErrors }
        }
        const { mount, unmount, errors: mountersErrors } = await getClientSDKMounters({
            clientSDK, secretKey
        })
        if (mountersErrors && mountersErrors.length > 0) {
            return { errors: mountersErrors }
        }

        return {
            mount,
            unmount,
        }
    }