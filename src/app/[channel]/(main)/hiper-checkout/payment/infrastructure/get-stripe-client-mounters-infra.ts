


export const getStripeClientMountersInfra = async ({ client, payment }) => {


    // if (!elements) {
    // stripe create elements , connectedto to payment secret
    const elements = client.elements({ clientSecret: payment.transaction.secretKey });
    if (!elements) {
        return { error: "Could not create stripe elements instance." }
    }
    // }

    let paymentElement = elements.create("payment");

    const mount = (targetSelector: string) => {
        if (!paymentElement) {
            return { error: "paymentElement not initiated." }
        }

        paymentElement.mount(targetSelector);

        // add when it will be used
        // if (options?.onChange) {
        //     paymentElement.on("change", options.onChange);
        // }
    }

    const unmount = () => {
        paymentElement?.unmount();
        /**
         * New intent  (client secret) requires creation of new elements object.
         */
        paymentElement = null;
    }
    return {
        mount,
        unmount,
        elements
    }
}