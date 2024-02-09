import { redirectUrl } from '../constants'
import { type TransactionEventTypeEnum } from "@/gql/graphql";

type EventType = `${TransactionEventTypeEnum}`;

const SUCCESSFUL_TRANSACTION_EVENT_TYPES: EventType[] = [
    "AUTHORIZATION_SUCCESS",
    "CHARGE_SUCCESS",
    "AUTHORIZATION_ADJUSTMENT", // FIXME: Stripe app has a weird status?
];

export const processAdyenTransactionAdditionalInfoHandler = ({
    // service config
    processTransaction
}) => async (
    // returned by adyen client
    adyenState,
    uiElement
) => {
        const processData: AdyenProcessTransactionData = { stateData: adyenState.data.details };
        const {
            errors,
            transaction: {
                transactionEventType,
            } } = await processTransaction({
                id: uiElement.state.transactionId,
                data: processData,
            });

        if (errors.length) {
            // TODO handle
            return alert("processSaleorTransaction error: " + JSON.stringify(errors));
        }
        const isTransactionSuccessful = SUCCESSFUL_TRANSACTION_EVENT_TYPES.includes(transactionEventType);

        if (isTransactionSuccessful) {
            window.location.href = redirectUrl;
        }
    };