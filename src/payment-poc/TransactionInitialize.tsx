"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Button } from "@/checkout/components";
import { type CheckoutFragment } from "@/gql/graphql";
import { Loader } from "@/payment-poc/Loader";
import { paymentGatewayService } from "@/payment/service";
import { gatewayAppId } from "@/checkout/lib/utils/common";

// 2 x saleor
export const TransactionInitialize = ({ checkout }: { checkout: CheckoutFragment }) => {
	const [processing, setProcessing] = useState(false);
	const { refresh } = useRouter();

	const handleClick = async () => {
		setProcessing(true);

		const paymentGateway = paymentGatewayService({ gatewayAppId });

		{
			const { errors } = await paymentGateway.initializeSaleorPaymentGateway({
				id: checkout.id,
				amount: checkout.totalPrice.gross.amount,
				gatewayAppId: gatewayAppId,
			});

			if (errors.length) {
				return alert(`paymentGatewayInitialize failed: ${JSON.stringify(errors)}`);
			}
		}

		// await paymentGateway.initializeSaleorTransaction(checkout.id);

		const { errors, transactionId, publicKey, secretKey } = await paymentGateway.initializeSaleorTransaction(
			checkout.id,
		);

		if (errors.length) {
			return alert(`transactionInitialize failed: ${JSON.stringify(errors)}`);
		}

		Cookies.set("secretKey", secretKey);
		Cookies.set("publicKey", publicKey);
		Cookies.set("transactionId", transactionId);

		refresh();
		setProcessing(false);
	};

	return processing ? (
		<Loader />
	) : (
		<Button onClick={handleClick} variant="secondary" label="Transaction initialize"></Button>
	);
};
