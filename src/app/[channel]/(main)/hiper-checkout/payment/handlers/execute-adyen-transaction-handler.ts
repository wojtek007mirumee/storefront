import { redirectUrl } from '../constants'
import { type TransactionEventTypeEnum } from "@/gql/graphql";

type EventType = `${TransactionEventTypeEnum}`;

const SUCCESSFUL_TRANSACTION_EVENT_TYPES: EventType[] = [
    "AUTHORIZATION_SUCCESS",
    "CHARGE_SUCCESS",
    "AUTHORIZATION_ADJUSTMENT", // FIXME: Stripe app has a weird status?
];

export const executeAdyenTransactionHandler = ({
    // service config
    initializeTransaction,
    gatewayAppId
}) => ({
    // config from initializeAdyenClientInfra
    checkoutId
}) => async (
    // returned by adyen client
    adyenState,
    uiElement
) => {
            console.log('onSubmit', adyenState, uiElement)
            if (!adyenState.isValid) {
                return uiElement.showValidation();
            }

            const initializeData: AdyenInitializeTransactionData = {
                transactionClientContext: {
                    returnUrl: redirectUrl, // should be injected in config
                    native3ds: true, // enables inline iframe for 3ds
                },
                stateData: adyenState.data,
            };
            console.log('transactionPayload', {
                id: checkoutId,
                data: initializeData,
                gatewayAppId,
            })

            const {
                errors,
                transaction: {
                    transactionId,
                    transactionEventType,
                    transactionData
                }
            } = await initializeTransaction({
                id: checkoutId,
                data: initializeData,
                gatewayAppId,
            })

            console.log('RESULT', {
                errors, transactionId,
                transactionEventType,
                transactionData
            })

            if (errors.length) {
                // TODO handle
                return alert("initializeSaleorTransaction error: " + JSON.stringify(errors));
            }

            // NOTE: dangerusly set transactionId to state to use for other callbacks passed to adyen client
            uiElement.setState({ transactionId })

            const is3DSecureV2 = transactionData?.resultCode === "IdentifyShopper";
            const is3DSecureV1 = transactionData?.resultCode === "RedirectShopper";
            if (is3DSecureV1 || is3DSecureV2) {
                return uiElement?.handleAction(transactionData.action);
            }

            // if we move it to some function this all infra+handlers should be grouped into Adyen directory than we can have some helpers
            const isTransactionSuccessful = SUCCESSFUL_TRANSACTION_EVENT_TYPES.includes(transactionEventType);

            if (isTransactionSuccessful) {
                // different redirect for server/clint
                window.location.href = redirectUrl;
            }
            // TODO: unexpected state, error
        };