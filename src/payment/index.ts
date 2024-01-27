import stripeGateway from "./stripe";

export { initializeSaleorTransaction, initializeSaleorPaymentGateway } from "./transactions";

export const marinaPaymentGateway = stripeGateway;
export const MarinaPaymentGateway = typeof stripeGateway;
