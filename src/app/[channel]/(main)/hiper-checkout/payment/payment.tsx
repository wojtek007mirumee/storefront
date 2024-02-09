"use client";
import "@adyen/adyen-web/dist/adyen.css";
import { type FormEventHandler, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Button } from "@/checkout/components";
import { type CheckoutFragment } from "@/gql/graphql";
import { Loader } from "@/payment-poc/Loader";
import paymentService from "./payment-service"
import { GatewayPaymentTargetElement } from "@/payment-poc/GatewayPaymentTargetElement";
import { getRedirectUrl, paymentElementId } from "@/payment-poc/helpers";

// 2 x saleor
// put all of it to higher order component to join with stripeComponent


export default function Payment({ payment, checkoutId }: { payment: any, checkoutId: string }) {
	const [isMountingComponent, setIsMountingComponent] = useState(true);
	const [isPaying, setIsPaying] = useState(false);
	const [clientState, setClientState] = useState(null);


	useEffect(() => {
		if (!payment) {
			return
		}
		let unmount = null;
		console.log('EFFECT2', { payment });
		(async () => {
			const { errors, mount, unmount: passedUnmount, clientState } = await paymentService.createPaymentComponent({
				checkoutId, payment
			});

			setClientState(clientState)
			console.log('EFFECT3', { errors, mount, passedUnmount })

			if (errors && errors.length > 0) {
				return alert(`createPaymentComponent failed: ${JSON.stringify(errors)}`);
			}

			mount(`#${paymentElementId}`);
			unmount = passedUnmount
			setIsMountingComponent(false);
		})();
		return () => unmount && unmount();
	}, [JSON.stringify(payment)])

	const handleExecutePayment: FormEventHandler = async (evt) => {
		evt.preventDefault();
		setIsPaying(true);
		console.log("handleExecutePayment:isPaying", isPaying);
		if (!clientState) {
			return alert("clientState is not present");
		}
		const { errors } = await paymentService.executePayment({
			clientState,
		});
		setIsPaying(false);
		if (errors && errors.length > 0) {
			return alert(JSON.stringify(errors));
		}
	};

	return (
		<form onSubmit={handleExecutePayment}>
			<GatewayPaymentTargetElement />
			{(() => {
				if (isMountingComponent) {
					return (
						<div>
							<h1>Mounting component...</h1>
							<Loader />
						</div>
					)
				}
				if (isPaying) {
					return (
						<div>
							<h1>Paying...</h1>
							<Loader />
						</div>
					)
				}
				return (
					<Button
						type="submit"
						variant="primary"
						label="Pay $"
						className="mt-5"
					/>
				)
			})()}

		</form>
	);

};
