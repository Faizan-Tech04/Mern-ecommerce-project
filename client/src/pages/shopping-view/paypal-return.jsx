import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

import { capturePayment } from "@/store/shop/order-slice";

function PayPalReturn() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const captureStarted = useRef(false);

    const [status, setStatus] = useState("processing");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        // Prevent duplicate capture requests
        if (captureStarted.current) {
            return;
        }

        const paypalOrderId = searchParams.get("token");

        // PayPal Order ID missing
        if (!paypalOrderId) {
            setStatus("error");
            setErrorMessage("PayPal Order ID was not found.");
            return;
        }

        captureStarted.current = true;

        const captureOrder = async () => {
            try {
                console.log("PayPal Order ID:", paypalOrderId);

                const result = await dispatch(
                    capturePayment(paypalOrderId)
                ).unwrap();

                console.log("PayPal Capture Result:", result);

                // Payment successfully captured
                if (result?.success) {
                    navigate("/shop/payment-success", {
                        replace: true,
                    });

                    return;
                }

                // Capture failed
                setStatus("error");
                setErrorMessage(
                    result?.message || "Payment capture failed."
                );
            } catch (error) {
                console.error("PayPal Capture Error:", error);

                setStatus("error");

                setErrorMessage(
                    error?.message ||
                    error?.data?.message ||
                    "Payment capture failed."
                );
            }
        };

        captureOrder();
    }, [dispatch, navigate, searchParams]);

    // ==========================================
    // PROCESSING
    // ==========================================

    if (status === "processing") {
        return (
            <div className="flex min-h-[70vh] items-center justify-center px-4">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />

                    <h1 className="mt-5 text-2xl font-bold">
                        Processing Payment...
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Please wait while we confirm your PayPal payment.
                    </p>
                </div>
            </div>
        );
    }

    // ==========================================
    // ERROR
    // ==========================================

    if (status === "error") {
        return (
            <div className="flex min-h-[70vh] items-center justify-center px-4">
                <div className="w-full max-w-md text-center">
                    <div className="text-5xl">
                        ❌
                    </div>

                    <h1 className="mt-4 text-3xl font-bold text-red-600">
                        Payment Failed
                    </h1>

                    <p className="mt-3 text-gray-500">
                        {errorMessage}
                    </p>

                    <button
                        onClick={() => navigate("/shop/checkout")}
                        className="mt-6 rounded-md bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
                    >
                        Back to Checkout
                    </button>
                </div>
            </div>
        );
    }

    return null;
}

export default PayPalReturn;