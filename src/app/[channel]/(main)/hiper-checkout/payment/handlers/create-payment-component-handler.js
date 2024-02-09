export const createPaymentComponentHandler = ({
    initializeClient,
    getClientMounters
}) => async ({
    payment,
    checkoutId
}) => {
        const { client, errors: clientErrors } = await initializeClient({
            payment,
            checkoutId
        })
        if (clientErrors && clientErrors.length > 0) {
            return { errors: clientErrors }
        }
        const { mount, unmount, elements, errors: mountersErrors } = await getClientMounters({
            client, payment
        })
        if (mountersErrors && mountersErrors.length > 0) {
            return { errors: mountersErrors }
        }

        return {
            mount,
            unmount,
            clientState: {
                client,
                elements
            }
        }
    }