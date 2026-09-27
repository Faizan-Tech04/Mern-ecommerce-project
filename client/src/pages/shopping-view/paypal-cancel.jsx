import { useNavigate } from "react-router-dom";

function PayPalCancel() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-[70vh] items-center justify-center px-4">
            <div className="max-w-md text-center">
                <div className="text-5xl">❌</div>

                <h1 className="mt-4 text-3xl font-bold">
                    Payment Cancelled
                </h1>

                <p className="mt-2 text-gray-500">
                    Your PayPal payment was cancelled.
                </p>

                <button
                    onClick={() => navigate("/shop/checkout")}
                    className="mt-6 rounded-md bg-black px-6 py-3 text-white"
                >
                    Return to Checkout
                </button>
            </div>
        </div>
    );
}

export default PayPalCancel;