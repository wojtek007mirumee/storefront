

export const getAdyenClientMountersInfra = async ({ client }) => {


    // if (!elements) {
    // stripe create elements , connectedto to payment secret
    const dropin = client.create("dropin");
    if (!dropin) {
        return { error: "Could not create adyen dropin." }
    }
    // }


    const mount = (targetSelector: string) => {
        if (!dropin) {
            return { error: "dropin not initiated." }
        }

        dropin.mount(targetSelector);

        // add when it will be used
        // if (options?.onChange) {
        //     dropin.on("change", options.onChange);
        // }
    }

    const unmount = () => {
        if (!dropin) {
            return { error: "dropin not initiated." }
        }
        dropin?.unmount();
        /**
         * New intent  (client secret) requires creation of new elements object.
         */
        // paymentElement = null;
    }
    return {
        mount,
        unmount,
        elements: dropin
    }
}