"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Button } from "@/checkout/components";
import { type CheckoutFragment } from "@/gql/graphql";
import { Loader } from "@/payment-poc/Loader";
import { paymentGatewayService } from "@/payment/service";
import { gatewayAppId } from "@/checkout/lib/utils/common";
import paymentService from "@/payment-poc/service";

// 2 x saleor
// put all of it to higher order component to join with stripeComponent
export const InitializePaymentBtn = ({ checkout }: { checkout: CheckoutFragment }) => {
	const [loading, setLoading] = useState(false);
	const { refresh } = useRouter();

	const handleClick = async () => {
		setLoading(true);


		const { errors, transactionId, publicKey, secretKey } = await paymentService.initializePayment({
			checkoutId: checkout.id,
			amount: checkout.totalPrice.gross.amount
			// or pass just checkout object and use methods on it to get values
		});


		if (errors.length) {
			return alert(`initializePayment failed: ${JSON.stringify(errors)}`);
		}

		Cookies.set("secretKey", secretKey);
		Cookies.set("publicKey", publicKey);
		Cookies.set("transactionId", transactionId);// TODO I dont see it being used anywhere

		refresh();
		setLoading(false);
	};

	return loading ? (
		<Loader />
	) : (
		<Button onClick={handleClick} variant="primary" label="Initialize payment"></Button>
	);
};
