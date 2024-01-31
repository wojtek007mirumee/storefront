"use client";

import { type FormEventHandler, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Button } from "@/checkout/components";
import { type CheckoutFragment } from "@/gql/graphql";
import { Loader } from "@/payment-poc/Loader";
import paymentService from "../service"
import { GatewayPaymentTargetElement } from "@/payment-poc/GatewayPaymentTargetElement";
import { getRedirectUrl, paymentElementId } from "@/payment-poc/helpers";

// 2 x saleor
// put all of it to higher order component to join with stripeComponent
export const Payment = ({ checkout, secretKey, publicKey }: { checkout: CheckoutFragment, secretKey: string, publicKey: string }) => {
	const [isInitializingPayment, setIsInitializingPayment] = useState(false);
	const [isMountingComponent, setIsMountingComponent] = useState(true);
	const [isPaying, setIsPaying] = useState(false);
	const [sdkState, setSdkState] = useState(null);
	// const [params, setParams] = useState(null);
	// const [mounters, setMounters] = useState(null);
	const { refresh } = useRouter();
	// const handlePaymentSuccess = async ({ id, secret }) => {
	// 	const params = new URLSearchParams();
	// 	params.append("payment_intent", id);
	// 	params.append("payment_intent_client_secret", secret);
	// 	push(`${getRedirectUrl()}?${params.toString()}`);
	// };

	// TODO
	// const { params } = service.getUrlParams({ searchParams })
	// const { params } = service.getCookiesParams()

	console.log('params', { checkout, secretKey, publicKey })
	console.log('flags', {
		isInitializingPayment,
		isMountingComponent,
		isPaying
	})

	const handleInitializePayment = async () => {
		setIsInitializingPayment(true);


		// tutaj return jakies newUrlParams
		const { errors, transactionId, publicKey, secretKey } = await paymentService.initializePayment({
			checkoutId: checkout.id,
			amount: checkout.totalPrice.gross.amount
			// or pass just checkout object and use methods on it to get values
		});


		if (errors && errors.length > 0) {
			return alert(`initializePayment failed: ${JSON.stringify(errors)}`);
		}

		// obsluzyc jakos te newUrlParams
		// moze to powinien byc state
		// why cookies and not url params? security?
		Cookies.set("secretKey", secretKey); // this cookies setting should be in infra anyway
		Cookies.set("publicKey", publicKey);
		Cookies.set("transactionId", transactionId);// TODO I dont see it being used anywhere
		//TODO
		// service.setCookiesParams(({secretKey,publicKey,transactionId}))

		refresh();
		// mount(`#${paymentElementId}`);
		// setMounters({ secretKey, mount, unmount })
		setIsInitializingPayment(false);
	};

	useEffect(() => {
		// const { params,arePresent } = service.getUrlParams({ searchParams })
		// const { params,arePresent } = service.getCookiesParams()
		console.log('EFFECT1', { secretKey, publicKey })
		// if (!arePresent) {
		if (!publicKey || !secretKey) {
			return
		}
		let unmount = null;
		console.log('EFFECT2', { secretKey, publicKey });
		(async () => {
			const { errors, mount, unmount: passedUnmount, state } = await paymentService.createPaymentComponent({
				publicKey,
				secretKey
				//TODO params
			});

			setSdkState(state)
			console.log('EFFECT3', { errors, mount, passedUnmount })

			if (errors && errors.length > 0) {
				return alert(`createPaymentComponent failed: ${JSON.stringify(errors)}`);
			}

			mount(`#${paymentElementId}`);
			unmount = passedUnmount
			setIsMountingComponent(false);
		})();
		return () => unmount && unmount();
	}, [publicKey, secretKey])

	const handleExecutePayment: FormEventHandler = async (evt) => {
		evt.preventDefault();
		setIsPaying(true);
		console.log("handleExecutePayment:isPaying", isPaying);
		// if (!paymentGateway) {
		// 	return;
		// }
		// const { params,arePresent } = service.getUrlParams({ searchParams })
		// const { params,arePresent } = service.getCookiesParams()
		// // factory function to pay
		// await paymentGateway.pay({ return_url: getRedirectUrl() });
		const { errors } = await paymentService.executePayment({
			// publicKey,
			params,
			redirectUrl: getRedirectUrl(),
		});

		if (errors && errors.length > 0) {
			return alert(`pay failed: ${JSON.stringify(errors)}`);
		}
	};

	if (isInitializingPayment) {
		return (
			<div>
				<h1>Initializing payment...</h1>
				<Loader />
			</div>
		)
	}

	if (!secretKey || !publicKey) {
		return (
			<Button onClick={handleInitializePayment} variant="primary" label="Initialize payment"></Button>
		)
	}

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
						// disabled={isInitializingPayment}
						variant="primary"
						label="Pay $"
						className="mt-5"
					/>
				)
			})()}
			{/* {
				// !isInitializing &&
				(isPaying ? (
					<Loader />
				) : (
					<Button
						type="submit"
						disabled={isInitializing}
						variant="secondary"
						label={isInitializing ? "..." : "Pay $"}
						className="mt-5"
					/>
				))} */}

		</form>
	);

};
