import stripeGateway from "@/payment/stripe";

export const paymentGatewayService = stripeGateway;

export type PaymentGatewayService = ReturnType<typeof paymentGatewayService>;
