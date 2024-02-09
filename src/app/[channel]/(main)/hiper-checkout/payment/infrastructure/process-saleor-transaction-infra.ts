import { executeGraphQL } from "@/lib/graphql";
import {
    TransactionProcessDocument,
    type TransactionProcessMutationVariables,
} from "@/gql/graphql";


export const processSaleorTransactionInfra = async (variables: TransactionProcessMutationVariables) => {
    const { transactionProcess } = await executeGraphQL(TransactionProcessDocument, {
        withAuth: false,
        variables,
        cache: "no-store",
    });

    const errors = transactionProcess?.errors ?? [];

    console.log("transactionInitialize: " + JSON.stringify(transactionProcess));

    if (errors?.length) {
        return { errors, data: null, result: null, transactionId: null };
    }
    return {
        errors: [],
        transaction: {
            transactionData: transactionProcess?.data,
            transactionEventType: transactionProcess?.transactionEvent?.type,
            transactionId: transactionProcess?.transaction?.id,
        }
    };
};