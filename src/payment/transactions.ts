import { type PaymentGatewayInitialize, type PaymentTransactionInitialize } from "@/payment/types";
import { executeGraphQL } from "@/lib/graphql";
import {
	PaymentGatewayInitializeDocument,
	type PaymentGatewayInitializeError,
	TransactionInitializeDocument,
} from "@/gql/graphql";

/**
 * Variables needed are specific per payment app
 */
export const initializeSaleorTransaction: PaymentTransactionInitialize = async (variables) => {
	const { transactionInitialize } = await executeGraphQL(TransactionInitializeDocument, {
		withAuth: false,
		variables,
		cache: "no-store",
	});

	const errors = transactionInitialize?.errors ?? [];
	const intentData = transactionInitialize?.data as
		| undefined
		| {
				publishableKey: string;
				paymentIntent: { client_secret: string };
		  };

	const publicKey = intentData?.publishableKey;
	const secretKey = intentData?.paymentIntent?.client_secret;

	if (errors?.length || !publicKey || !secretKey) {
		return { errors, publicKey: null, secretKey: null, transactionId: null };
	}

	return {
		errors: [],
		publicKey,
		secretKey,
		transactionId: transactionInitialize!.transaction!.id,
	};
};

export const initializeSaleorPaymentGateway: PaymentGatewayInitialize = async (variables) => {
	const { paymentGatewayInitialize } = await executeGraphQL(PaymentGatewayInitializeDocument, {
		withAuth: false,
		variables,
		cache: "no-store",
	});

	const errors = [
		...(paymentGatewayInitialize?.errors ?? []),
		...(paymentGatewayInitialize?.gatewayConfigs?.map((data) => data.errors)?.flat() ?? []),
	] as PaymentGatewayInitializeError[];

	const initializeData = paymentGatewayInitialize?.gatewayConfigs?.find(
		({ id }) => id === variables.gatewayAppId,
	)?.data as undefined | { publishableKey: string };
	const publicKey = initializeData?.publishableKey;

	if (errors.length || !publicKey) {
		return { errors, publicKey: null };
	}

	return { errors: [], publicKey };
};
