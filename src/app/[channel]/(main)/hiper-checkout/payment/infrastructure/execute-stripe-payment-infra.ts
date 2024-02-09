import { redirectUrl } from '../constants'

const redirect = "always"// "if_required"

export const executeStripePaymentInfra = async ({ clientState }) => {
    if (!clientState.client || !clientState.elements) {
        return { errors: ["Client not initiated."] }
    }

    /**
     * Using always upon successful payment client will be always redirected to `confirmParams.return_url`.
     */
    const { error, ...rest } = await clientState.client.confirmPayment({
        elements: clientState.elements,
        redirect,
        confirmParams: {
            return_url: redirectUrl,
        },
    });
    console.log('executeStripePaymentInfra:error', error, 'rest', rest)

    if (error) {
        return { errors: [error] }
    }
}