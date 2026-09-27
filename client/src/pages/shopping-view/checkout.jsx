import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Address from "@/components/shopping-view/address";

import { createOrder } from "@/store/shop/order-slice";
import { fetchAllAddresses } from "@/store/shop/address-slice";

import { toast } from "sonner";

import img from "../../assets/account 2.jpg";

// ==========================================
// Shopping Checkout
// ==========================================

function ShoppingCheckout() {
    const dispatch = useDispatch();

    // ==========================================
    // Redux - Cart
    // ==========================================

    const { cartItems } = useSelector(
        (state) => state.shopCart
    );

    // ==========================================
    // Redux - Auth
    // ==========================================

    const { user } = useSelector(
        (state) => state.auth
    );

    // ==========================================
    // Redux - Address
    // ==========================================

    const {
        addressList,
        isLoading: addressLoading,
    } = useSelector(
        (state) => state.address
    );

    // ==========================================
    // Redux - Order
    // ==========================================

    const {
        isLoading: orderLoading,
    } = useSelector(
        (state) => state.order
    );

    // ==========================================
    // Current Selected Address
    // ==========================================

    const [
        currentSelectedAddress,
        setCurrentSelectedAddress,
    ] = useState(null);

    // ==========================================
    // Fetch Addresses
    // ==========================================

    useEffect(() => {
        dispatch(fetchAllAddresses());
    }, [dispatch]);

    // ==========================================
    // Select First Address Automatically
    // ==========================================

    useEffect(() => {
        if (
            addressList?.length > 0 &&
            !currentSelectedAddress
        ) {
            setCurrentSelectedAddress(
                addressList[0]
            );
        }
    }, [
        addressList,
        currentSelectedAddress,
    ]);

    // ==========================================
    // Calculate Total - INR
    // ==========================================

    const totalCartAmount = (
        cartItems || []
    ).reduce(
        (total, item) => {
            const price =
                Number(item?.salePrice) > 0
                    ? Number(item.salePrice)
                    : Number(item?.price || 0);

            const quantity = Number(
                item?.quantity || 0
            );

            return (
                total +
                price * quantity
            );
        },
        0
    );

    // ==========================================
    // Initiate PayPal Payment
    // ==========================================

    const handleInitiatePaypalPayment =
        async () => {
            // --------------------------------------
            // Check Login
            // --------------------------------------

            if (!user?.id) {
                toast.error(
                    "Please login before placing an order."
                );

                return;
            }

            // --------------------------------------
            // Check Cart
            // --------------------------------------

            if (!cartItems?.length) {
                toast.error(
                    "Your cart is empty. Please add items to proceed."
                );

                return;
            }

            // --------------------------------------
            // Check Address
            // --------------------------------------

            if (!currentSelectedAddress?._id) {
                toast.error(
                    "Please select a delivery address."
                );

                return;
            }

            // --------------------------------------
            // Check Total
            // --------------------------------------

            if (totalCartAmount <= 0) {
                toast.error(
                    "Invalid order amount."
                );

                return;
            }

            // ======================================
            // Address Information
            // ======================================

            const addressInfo = {
                addressId:
                    currentSelectedAddress._id,

                address:
                    currentSelectedAddress.address?.trim() ||
                    "",

                city:
                    currentSelectedAddress.city?.trim() ||
                    "",

                pincode:
                    currentSelectedAddress.pincode?.trim() ||
                    "",

                phone:
                    currentSelectedAddress.phone?.trim() ||
                    "",

                notes:
                    currentSelectedAddress.notes?.trim() ||
                    "",
            };

            // ======================================
            // Order Data
            // ======================================

            const orderData = {
                userId: user.id,

                cartItems: cartItems.map(
                    (singleCartItem) => ({
                        productId:
                            singleCartItem?.productId,

                        title:
                            singleCartItem?.title ||
                            "Product",

                        image:
                            singleCartItem?.image ||
                            "",

                        price: Number(
                            singleCartItem?.price || 0
                        ),

                        salePrice: Number(
                            singleCartItem?.salePrice || 0
                        ),

                        quantity: Number(
                            singleCartItem?.quantity || 1
                        ),
                    })
                ),

                addressInfo,

                totalAmount: Number(
                    totalCartAmount.toFixed(2)
                ),
            };

            // ======================================
            // Debug
            // ======================================

            console.log(
                "================================"
            );

            console.log(
                "PAYPAL ORDER DATA:",
                orderData
            );

            console.log(
                "USER ID:",
                user.id
            );

            console.log(
                "CART ITEMS:",
                orderData.cartItems
            );

            console.log(
                "ADDRESS INFO:",
                orderData.addressInfo
            );

            console.log(
                "TOTAL INR:",
                orderData.totalAmount
            );

            console.log(
                "================================"
            );

            // ======================================
            // Create PayPal Order
            // ======================================

            try {
                const response =
                    await dispatch(
                        createOrder(orderData)
                    ).unwrap();

                console.log(
                    "PAYPAL CREATE ORDER RESPONSE:",
                    response
                );

                // ==================================
                // Redirect To PayPal
                // ==================================

                if (
                    response?.success &&
                    response?.approvalURL
                ) {
                    toast.success(
                        "Redirecting to PayPal..."
                    );

                    window.location.href =
                        response.approvalURL;

                    return;
                }

                toast.error(
                    response?.message ||
                    "Failed to create PayPal order."
                );
            } catch (error) {
                console.error(
                    "PAYPAL ORDER ERROR:",
                    error
                );

                toast.error(
                    error?.message ||
                    error?.data?.message ||
                    "Failed to create PayPal order."
                );
            }
        };

    // ==========================================
    // Render
    // ==========================================

    return (
        <div className="flex min-h-screen w-full min-w-0 flex-col overflow-x-hidden">

            {/* ==========================================
                Checkout Hero
            ========================================== */}

            <section className="relative h-[220px] w-full max-w-full overflow-hidden sm:h-[260px] md:h-[300px]">
                <img
                    src={img}
                    alt="Checkout"
                    className="h-full w-full object-cover object-center"
                />

                <div className="absolute inset-0 bg-black/40" />

                <div className="absolute inset-0 flex items-center justify-center px-4">
                    <h1 className="text-center text-3xl font-bold text-white drop-shadow-md sm:text-4xl md:text-5xl">
                        Checkout
                    </h1>
                </div>
            </section>

            {/* ==========================================
                Checkout Content
            ========================================== */}

            <section className="w-full min-w-0 max-w-full overflow-x-hidden bg-gray-50 py-8 sm:py-10 md:py-12">
                <div
                    className="
                        mx-auto
                        grid
                        w-full
                        max-w-7xl
                        min-w-0
                        grid-cols-1
                        items-start
                        gap-6
                        px-4
                        sm:px-6
                        md:gap-8
                        lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]
                        lg:px-8
                    "
                >

                    {/* ==========================================
                        LEFT - ADDRESS
                    ========================================== */}

                    <div className="w-full min-w-0 max-w-full overflow-hidden">
                        <Address
                            setCurrentSelectedAddress={
                                setCurrentSelectedAddress
                            }
                        />
                    </div>

                    {/* ==========================================
                        RIGHT - ORDER SUMMARY
                    ========================================== */}

                    <div
                        className="
                            w-full
                            min-w-0
                            max-w-full
                            overflow-hidden
                            rounded-xl
                            border
                            bg-background
                            p-4
                            shadow-sm
                            sm:p-5
                            md:p-6
                            lg:sticky
                            lg:top-24
                        "
                    >

                        {/* Header */}

                        <div className="mb-6 min-w-0">
                            <h2 className="break-words text-xl font-bold sm:text-2xl">
                                Order Summary
                            </h2>

                            <p className="mt-1 break-words text-sm text-muted-foreground">
                                Review your products before placing
                                your order.
                            </p>
                        </div>

                        {/* ==========================================
                            Selected Address
                        ========================================== */}

                        {currentSelectedAddress && (
                            <div className="mb-6 w-full min-w-0 max-w-full overflow-hidden rounded-lg border bg-muted/30 p-4">

                                <div className="mb-3 flex min-w-0 flex-wrap items-center justify-between gap-2">
                                    <h3 className="min-w-0 break-words text-sm font-semibold">
                                        Delivery Address
                                    </h3>

                                    <span className="shrink-0 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
                                        Selected
                                    </span>
                                </div>

                                <div className="min-w-0 space-y-1 text-sm text-muted-foreground">
                                    <p className="break-words">
                                        {
                                            currentSelectedAddress.address
                                        }
                                    </p>

                                    <p className="break-words">
                                        {
                                            currentSelectedAddress.city
                                        }{" "}
                                        -{" "}
                                        {
                                            currentSelectedAddress.pincode
                                        }
                                    </p>

                                    <p className="break-words">
                                        Phone:{" "}
                                        {
                                            currentSelectedAddress.phone
                                        }
                                    </p>

                                    {currentSelectedAddress.notes && (
                                        <p className="break-words">
                                            Notes:{" "}
                                            {
                                                currentSelectedAddress.notes
                                            }
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ==========================================
                            Cart Items
                        ========================================== */}

                        {cartItems?.length > 0 ? (
                            <div className="w-full min-w-0 space-y-4">

                                {cartItems.map(
                                    (item) => {
                                        const price =
                                            Number(
                                                item?.salePrice
                                            ) > 0
                                                ? Number(
                                                    item.salePrice
                                                )
                                                : Number(
                                                    item?.price ||
                                                    0
                                                );

                                        const quantity =
                                            Number(
                                                item?.quantity ||
                                                0
                                            );

                                        const itemTotal =
                                            price *
                                            quantity;

                                        return (
                                            <div
                                                key={
                                                    item?.productId
                                                }
                                                className="
                                                    flex
                                                    min-w-0
                                                    w-full
                                                    max-w-full
                                                    gap-3
                                                    overflow-hidden
                                                    border-b
                                                    pb-4
                                                    last:border-b-0
                                                    sm:gap-4
                                                "
                                            >

                                                {/* Product Image */}

                                                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-muted sm:h-24 sm:w-24">
                                                    <img
                                                        src={
                                                            item?.image
                                                        }
                                                        alt={
                                                            item?.title ||
                                                            "Product"
                                                        }
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>

                                                {/* Product Info */}

                                                <div className="min-w-0 flex-1 overflow-hidden">

                                                    <h3 className="break-words text-sm font-semibold sm:text-base">
                                                        {
                                                            item?.title ||
                                                            "Product"
                                                        }
                                                    </h3>

                                                    <p className="mt-1 break-words text-sm text-muted-foreground">
                                                        Quantity:{" "}
                                                        {
                                                            quantity
                                                        }
                                                    </p>

                                                    <div className="mt-2 flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-1">

                                                        <span className="min-w-0 break-words text-sm text-muted-foreground">
                                                            ₹
                                                            {price.toFixed(
                                                                2
                                                            )}{" "}
                                                            ×{" "}
                                                            {
                                                                quantity
                                                            }
                                                        </span>

                                                        <span className="shrink-0 text-sm font-bold sm:text-base">
                                                            ₹
                                                            {itemTotal.toFixed(
                                                                2
                                                            )}
                                                        </span>

                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                )}

                            </div>
                        ) : (
                            <div className="w-full rounded-lg border border-dashed p-8 text-center">
                                <p className="text-sm text-muted-foreground">
                                    Your cart is empty.
                                </p>
                            </div>
                        )}

                        {/* ==========================================
                            Price Summary
                        ========================================== */}

                        {cartItems?.length > 0 && (
                            <div className="mt-6 w-full min-w-0 border-t pt-6">

                                <div className="space-y-3">

                                    {/* Subtotal */}

                                    <div className="flex min-w-0 items-center justify-between gap-4 text-sm">
                                        <span className="shrink-0 text-muted-foreground">
                                            Subtotal
                                        </span>

                                        <span className="shrink-0 font-medium">
                                            ₹
                                            {totalCartAmount.toFixed(
                                                2
                                            )}
                                        </span>
                                    </div>

                                    {/* Shipping */}

                                    <div className="flex min-w-0 items-center justify-between gap-4 text-sm">
                                        <span className="shrink-0 text-muted-foreground">
                                            Shipping
                                        </span>

                                        <span className="shrink-0 font-medium">
                                            Free
                                        </span>
                                    </div>

                                    {/* Total */}

                                    <div className="flex min-w-0 items-center justify-between gap-4 border-t pt-4">
                                        <span className="shrink-0 text-lg font-bold">
                                            Total
                                        </span>

                                        <span className="shrink-0 text-xl font-bold">
                                            ₹
                                            {totalCartAmount.toFixed(
                                                2
                                            )}
                                        </span>
                                    </div>

                                </div>

                                {/* ==========================================
                                    Place Order
                                ========================================== */}

                                <button
                                    type="button"
                                    onClick={
                                        handleInitiatePaypalPayment
                                    }
                                    disabled={
                                        orderLoading ||
                                        addressLoading ||
                                        !cartItems?.length ||
                                        !currentSelectedAddress
                                    }
                                    className="
                                        mt-6
                                        w-full
                                        max-w-full
                                        rounded-md
                                        bg-primary
                                        px-4
                                        py-3
                                        text-sm
                                        font-semibold
                                        text-primary-foreground
                                        transition-opacity
                                        hover:opacity-90
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >
                                    {orderLoading
                                        ? "Processing..."
                                        : "Place Order with PayPal"}
                                </button>

                                {/* Address Warning */}

                                {!currentSelectedAddress &&
                                    addressList?.length ===
                                    0 && (
                                        <p className="mt-3 break-words text-center text-xs text-destructive">
                                            Please add a delivery
                                            address before placing
                                            your order.
                                        </p>
                                    )}

                            </div>
                        )}

                    </div>
                </div>
            </section>
        </div>
    );
}

export default ShoppingCheckout;