import { executeGraphQL } from "@/lib/graphql";
import {
	PaymentGatewayInitializeDocument,
	type PaymentGatewayInitializeError,
	type PaymentGatewayInitializeMutationVariables
} from "@/gql/graphql";

export const initializePaymentGatewayInfra = async <T>(
	variables: PaymentGatewayInitializeMutationVariables,
) => {
	const { paymentGatewayInitialize } = await executeGraphQL(PaymentGatewayInitializeDocument, {
		withAuth: false,
		variables,
		cache: "no-store",
	});

	const errors = [
		...(paymentGatewayInitialize?.errors ?? []),
		...(paymentGatewayInitialize?.gatewayConfigs?.map((data) => data.errors)?.flat() ?? []),
	] as PaymentGatewayInitializeError[];


	if (errors.length) {
		return { errors };
	}
	const data: T = paymentGatewayInitialize?.gatewayConfigs?.find(({ id }) => id === variables.gatewayAppId)?.data
	console.log('initializePaymentGatewayInfra', data)

	const paymentGateway = {
		clientKey: data?.gatewayClientContext?.publishableKey,
		environment: data?.gatewayClientContext?.pspEnvironment,
		paymentMethodsResponse: data?.pspData
	}

	return { errors: [], paymentGateway };
};
