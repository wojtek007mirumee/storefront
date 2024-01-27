import {
	type PaymentGatewayInitializeError,
	type PaymentGatewayInitializeMutationVariables,
	type TransactionInitializeError,
	type TransactionInitializeMutationVariables,
} from "@/gql/graphql";

type GatewayError<T> = {
	message: string;
	type: string;
	error: T; // Original error Stripe/Adyen
};

export type PaymentGatewayOptions = {
	// clientSecret: string;
	// publicKey: string;
	gatewayAppId: string;
	onPaymentSuccess?: () => Promise<void>;
	onChange?: (opts: any) => void;
	onError?: (x: any) => void;
};

export interface PaymentGatewayMethods {
	paymentSubmit(opts: any): Promise<any>;
	mount(targetSelector: string): void;
	unmount(targetSelector: string): void;
}

// Those can be a normal fn.
export type PaymentGatewayInitialize = (
	variables: PaymentGatewayInitializeMutationVariables,
) =>
	| Promise<{ publicKey: never; errors: PaymentGatewayInitializeError[] }>
	| Promise<{ publicKey: string; errors: never[] }>;

export type PaymentTransactionInitialize = (variables: TransactionInitializeMutationVariables) =>
	| Promise<{
			transactionId: never;
			publicKey: never;
			secretKey: never;
			errors: TransactionInitializeError[];
	  }>
	| Promise<{ transactionId: string; publicKey: string; secretKey: string; errors: never }>;
