import { CheckCircle2, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

function PaymentSuccess() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-4 py-10">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 text-center shadow-lg sm:p-10">

                {/* Success Icon */}
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>

                {/* Heading */}
                <h1 className="mt-6 text-3xl font-bold text-gray-900 sm:text-4xl">
                    Payment Successful!
                </h1>

                {/* Message */}
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
                    Thank you for your purchase. Your payment has been successfully
                    processed and your order has been placed.
                </p>

                {/* Order Status */}
                <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">
                    <p className="text-sm font-medium text-green-800">
                        Your order is being processed.
                    </p>

                    <p className="mt-1 text-xs text-green-700">
                        You can check your order details from your account.
                    </p>
                </div>

                {/* Buttons */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">

                    <button
                        onClick={() => navigate("/shop/account")}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                    >
                        <ShoppingBag className="h-5 w-5" />
                        View My Orders
                    </button>

                    <button
                        onClick={() => navigate("/shop/home")}
                        className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
                    >
                        Continue Shopping
                    </button>

                </div>

                {/* Small Note */}
                <p className="mt-8 text-xs text-gray-400">
                    Thank you for shopping with us!
                </p>
            </div>
        </div>
    );
}

export default PaymentSuccess;