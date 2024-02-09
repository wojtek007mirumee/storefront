

export const executeAdyenPaymentInfra = async ({ clientState }) => {
    if (!clientState.elements) {
        return { errors: ["Client not initiated."] }
    }

    clientState.elements.submit('sssss');
    return {}
}