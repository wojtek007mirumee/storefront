"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/checkout/components";
import { clearCookies } from "@/payment-poc/helpers";

export const ClearCookiesButton = () => {
	const { refresh } = useRouter();
	const handleClick = () => {
		clearCookies();
		refresh();
	};

	return <Button onClick={handleClick} variant="secondary" label="Clear cookies" className="mt-10" />;
};
