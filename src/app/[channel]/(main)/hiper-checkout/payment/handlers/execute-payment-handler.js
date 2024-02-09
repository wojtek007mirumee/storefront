export const executePaymentHandler = ({
    executePayment
}) => async ({
    clientState,
}) => {

        const { errors: paymentErrors } = await executePayment({
            clientState
        })
        if (paymentErrors && paymentErrors.length > 0) {
            return { errors: paymentErrors }
        }

        return {}
    }