import {
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";

import { Separator } from "../ui/separator";


// ==========================================
// Shopping Order Details View
// ==========================================

function ShoppingOrderDetailsView({ order }) {

    // ==========================================
    // Format Date
    // ==========================================

    const formatDate = (date) => {
        if (!date) {
            return "N/A";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }
        );
    };


    // ==========================================
    // Format Payment Status
    // ==========================================

    const formatPaymentStatus = (status) => {
        switch (status) {
            case "pending":
                return "Pending";

            case "paid":
                return "Paid";

            case "failed":
                return "Failed";

            case "refunded":
                return "Refunded";

            default:
                return status || "N/A";
        }
    };


    // ==========================================
    // Payment Status Style
    // ==========================================

    const getPaymentStatusClass = (status) => {
        switch (status) {
            case "paid":
                return "bg-green-100 text-green-700";

            case "failed":
                return "bg-red-100 text-red-700";

            case "refunded":
                return "bg-purple-100 text-purple-700";

            case "pending":
            default:
                return "bg-yellow-100 text-yellow-700";
        }
    };


    // ==========================================
    // Format Order Status
    // ==========================================

    const formatOrderStatus = (status) => {
        switch (status) {
            case "pending":
                return "Pending";

            case "inProcess":
                return "In Process";

            case "inShipping":
                return "In Shipping";

            case "delivered":
                return "Delivered";

            case "rejected":
                return "Rejected";

            default:
                return status || "N/A";
        }
    };


    // ==========================================
    // Order Status Style
    // ==========================================

    const getOrderStatusClass = (status) => {
        switch (status) {
            case "delivered":
                return "bg-green-100 text-green-700";

            case "inShipping":
                return "bg-blue-100 text-blue-700";

            case "inProcess":
                return "bg-yellow-100 text-yellow-700";

            case "rejected":
                return "bg-red-100 text-red-700";

            case "pending":
            default:
                return "bg-gray-100 text-gray-700";
        }
    };


    // ==========================================
    // Cart Items
    // ==========================================

    const cartItems = order?.cartItems || [];


    // ==========================================
    // Render
    // ==========================================

    return (
        <DialogContent
            className="
                w-[calc(100%-2rem)]
                max-h-[90vh]
                overflow-y-auto
                p-4
                sm:max-w-[650px]
                sm:p-6
            "
        >

            {/* ==========================================
                Dialog Header
            ========================================== */}

            <DialogHeader>
                <DialogTitle className="text-lg font-bold sm:text-xl">
                    Order Details
                </DialogTitle>
            </DialogHeader>


            {/* ==========================================
                Order Information
            ========================================== */}

            <div className="grid gap-3">

                {/* ==================================
                    Order ID
                ================================== */}

                <div className="flex items-start justify-between gap-4 border-b pb-3">

                    <span className="shrink-0 text-sm text-muted-foreground">
                        Order ID
                    </span>

                    <span className="max-w-[65%] break-all text-right text-xs font-semibold sm:text-sm">
                        #{order?._id || "N/A"}
                    </span>

                </div>


                {/* ==================================
                    Order Date
                ================================== */}

                <div className="flex items-center justify-between gap-4 border-b pb-3">

                    <span className="shrink-0 text-sm text-muted-foreground">
                        Order Date
                    </span>

                    <span className="text-right text-sm font-semibold">
                        {formatDate(order?.createdAt)}
                    </span>

                </div>


                {/* ==================================
                    Payment Status
                ================================== */}

                <div className="flex items-center justify-between gap-4 border-b pb-3">

                    <span className="shrink-0 text-sm text-muted-foreground">
                        Payment
                    </span>

                    <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${getPaymentStatusClass(
                            order?.paymentStatus
                        )}`}
                    >
                        {formatPaymentStatus(
                            order?.paymentStatus
                        )}
                    </span>

                </div>


                {/* ==================================
                    Order Status
                ================================== */}

                <div className="flex items-center justify-between gap-4 border-b pb-3">

                    <span className="shrink-0 text-sm text-muted-foreground">
                        Order Status
                    </span>

                    <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${getOrderStatusClass(
                            order?.orderStatus
                        )}`}
                    >
                        {formatOrderStatus(
                            order?.orderStatus
                        )}
                    </span>

                </div>


                {/* ==================================
                    Payment Method
                ================================== */}

                <div className="flex items-center justify-between gap-4 border-b pb-3">

                    <span className="shrink-0 text-sm text-muted-foreground">
                        Payment Method
                    </span>

                    <span className="text-right text-sm font-semibold capitalize">
                        {order?.paymentMethod || "N/A"}
                    </span>

                </div>


                {/* ==================================
                    Total Amount
                ================================== */}

                <div className="flex items-center justify-between gap-4">

                    <span className="shrink-0 text-sm font-medium text-muted-foreground">
                        Total Amount
                    </span>

                    <span className="shrink-0 text-right text-lg font-bold sm:text-xl">
                        ₹
                        {Number(
                            order?.totalAmount || 0
                        ).toFixed(2)}
                    </span>

                </div>

            </div>


            {/* ==========================================
                Separator
            ========================================== */}

            <Separator />


            {/* ==========================================
                Products
            ========================================== */}

            <div className="grid gap-4">

                <div>
                    <h3 className="font-semibold">
                        Order Items
                    </h3>

                    <p className="mt-1 text-xs text-muted-foreground">
                        {cartItems.length}{" "}
                        {cartItems.length === 1
                            ? "item"
                            : "items"}
                    </p>
                </div>


                {/* ==================================
                    Product List
                ================================== */}

                <div className="grid gap-3">

                    {cartItems.length === 0 ? (
                        <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                            No product details available.
                        </div>
                    ) : (
                        cartItems.map(
                            (item, index) => {

                                const itemPrice =
                                    Number(
                                        item?.salePrice ||
                                        item?.price ||
                                        0
                                    );

                                const quantity =
                                    Number(
                                        item?.quantity || 1
                                    );

                                const itemTotal =
                                    itemPrice * quantity;

                                return (
                                    <div
                                        key={
                                            item?._id ||
                                            item?.productId ||
                                            index
                                        }
                                        className="
                                            flex
                                            gap-3
                                            rounded-lg
                                            border
                                            p-3
                                            sm:gap-4
                                            sm:p-4
                                        "
                                    >

                                        {/* Product Image */}

                                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-gray-50 sm:h-20 sm:w-20">

                                            {item?.image ? (
                                                <img
                                                    src={
                                                        item.image
                                                    }
                                                    alt={
                                                        item?.title ||
                                                        "Product"
                                                    }
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                                                    No Image
                                                </div>
                                            )}

                                        </div>


                                        {/* Product Information */}

                                        <div className="min-w-0 flex-1">

                                            <div className="flex items-start justify-between gap-3">

                                                <div className="min-w-0">

                                                    <h4 className="break-words text-sm font-semibold sm:text-base">
                                                        {item?.title ||
                                                            "Product"}
                                                    </h4>

                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        Quantity:{" "}
                                                        {
                                                            quantity
                                                        }
                                                    </p>

                                                </div>


                                                {/* Item Total */}

                                                <span className="shrink-0 text-sm font-bold sm:text-base">
                                                    ₹
                                                    {itemTotal.toFixed(
                                                        2
                                                    )}
                                                </span>

                                            </div>


                                            {/* Price */}

                                            <div className="mt-2 flex flex-wrap items-center gap-2">

                                                <span className="text-xs font-medium text-muted-foreground">
                                                    ₹
                                                    {itemPrice.toFixed(
                                                        2
                                                    )}{" "}
                                                    each
                                                </span>

                                                {Number(
                                                    item?.salePrice || 0
                                                ) > 0 &&
                                                    Number(
                                                        item?.price || 0
                                                    ) >
                                                    Number(
                                                        item?.salePrice || 0
                                                    ) && (
                                                        <span className="text-xs text-gray-400 line-through">
                                                            ₹
                                                            {Number(
                                                                item.price
                                                            ).toFixed(
                                                                2
                                                            )}
                                                        </span>
                                                    )}

                                            </div>

                                        </div>

                                    </div>
                                );
                            }
                        )
                    )}

                </div>

            </div>


            {/* ==========================================
                Separator
            ========================================== */}

            <Separator />


            {/* ==========================================
                Shipping Information
            ========================================== */}

            <div className="grid gap-4">

                <div>
                    <h3 className="font-semibold">
                        Shipping Information
                    </h3>
                </div>


                <div className="grid gap-1.5 rounded-lg border bg-muted/30 p-4 text-sm">

                    {/* Address */}

                    <div className="grid gap-1 sm:grid-cols-[100px_1fr]">

                        <span className="font-medium text-muted-foreground">
                            Address
                        </span>

                        <span className="break-words font-medium">
                            {order?.addressInfo?.address ||
                                "N/A"}
                        </span>

                    </div>


                    {/* City */}

                    <div className="grid gap-1 sm:grid-cols-[100px_1fr]">

                        <span className="font-medium text-muted-foreground">
                            City
                        </span>

                        <span className="font-medium">
                            {order?.addressInfo?.city ||
                                "N/A"}
                        </span>

                    </div>


                    {/* Pincode */}

                    <div className="grid gap-1 sm:grid-cols-[100px_1fr]">

                        <span className="font-medium text-muted-foreground">
                            Pincode
                        </span>

                        <span className="font-medium">
                            {order?.addressInfo?.pincode ||
                                "N/A"}
                        </span>

                    </div>


                    {/* Phone */}

                    <div className="grid gap-1 sm:grid-cols-[100px_1fr]">

                        <span className="font-medium text-muted-foreground">
                            Phone
                        </span>

                        <span className="font-medium">
                            {order?.addressInfo?.phone ||
                                "N/A"}
                        </span>

                    </div>


                    {/* Notes */}

                    {order?.addressInfo?.notes && (
                        <div className="grid gap-1 sm:grid-cols-[100px_1fr]">

                            <span className="font-medium text-muted-foreground">
                                Notes
                            </span>

                            <span className="break-words font-medium">
                                {
                                    order.addressInfo
                                        .notes
                                }
                            </span>

                        </div>
                    )}

                </div>

            </div>


            {/* ==========================================
                PayPal Information
            ========================================== */}

            {(order?.paypalOrderId ||
                order?.paymentId) && (
                    <>
                        <Separator />

                        <div className="grid gap-4">

                            <h3 className="font-semibold">
                                Payment Information
                            </h3>

                            <div className="grid gap-2 rounded-lg border bg-muted/30 p-4 text-xs sm:text-sm">

                                {/* PayPal Order ID */}

                                {order?.paypalOrderId && (
                                    <div className="grid gap-1 sm:grid-cols-[130px_1fr]">

                                        <span className="text-muted-foreground">
                                            PayPal Order ID
                                        </span>

                                        <span className="break-all font-medium">
                                            {
                                                order.paypalOrderId
                                            }
                                        </span>

                                    </div>
                                )}


                                {/* Payment ID */}

                                {order?.paymentId && (
                                    <div className="grid gap-1 sm:grid-cols-[130px_1fr]">

                                        <span className="text-muted-foreground">
                                            Payment ID
                                        </span>

                                        <span className="break-all font-medium">
                                            {
                                                order.paymentId
                                            }
                                        </span>

                                    </div>
                                )}


                                {/* Payer ID */}

                                {order?.payerId && (
                                    <div className="grid gap-1 sm:grid-cols-[130px_1fr]">

                                        <span className="text-muted-foreground">
                                            Payer ID
                                        </span>

                                        <span className="break-all font-medium">
                                            {
                                                order.payerId
                                            }
                                        </span>

                                    </div>
                                )}

                            </div>

                        </div>
                    </>
                )}

        </DialogContent>
    );
}


export default ShoppingOrderDetailsView;