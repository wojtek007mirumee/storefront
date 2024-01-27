import Cookies from "js-cookie";

export const getRedirectUrl = () => `http://localhost:3000/payment-confirm`;

export const clearCookies = () => {
	Cookies.remove("checkoutId");
	Cookies.remove("secretKey");
	Cookies.remove("publicKey");
	Cookies.remove("transactionId");
};

export const channelSlug = "channel-pln";

export const paymentElementId = "payment-element";
