import { useEffect } from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    useNavigate,
} from "react-router-dom";

import {
    SheetHeader,
    SheetTitle,
} from "../ui/sheet";

import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

import {
    Plus,
    Minus,
    Trash2,
} from "lucide-react";

import {
    fetchCartItems,
    updateCartItemQty,
    deleteCartItem,
} from "@/store/shop/cart-slice";

import { toast } from "sonner";


// ==========================================
// User Cart Wrapper
// ==========================================

function UserCartWrapper() {

    const dispatch = useDispatch();

    const navigate = useNavigate();


    // ==========================================
    // Redux State
    // ==========================================

    const {
        cartItems,
        isLoading,
    } = useSelector(
        (state) => state.shopCart
    );


    // ==========================================
    // Fetch Cart Items
    // ==========================================

    useEffect(() => {

        dispatch(
            fetchCartItems()
        );

    }, [dispatch]);


    // ==========================================
    // Update Quantity
    // ==========================================

    function handleUpdateQuantity(
        productId,
        currentQuantity,
        action
    ) {

        let newQuantity =
            Number(currentQuantity);


        // ----------------------------------------
        // Increase Quantity
        // ----------------------------------------

        if (action === "plus") {

            newQuantity =
                newQuantity + 1;

        }


        // ----------------------------------------
        // Decrease Quantity
        // ----------------------------------------

        if (action === "minus") {

            newQuantity =
                newQuantity - 1;

        }


        // ----------------------------------------
        // Minimum Quantity = 1
        // ----------------------------------------

        if (newQuantity < 1) {

            return;

        }


        // ----------------------------------------
        // Update Cart
        // ----------------------------------------

        dispatch(
            updateCartItemQty({
                productId,
                quantity: newQuantity,
            })
        )
            .unwrap()
            .catch((error) => {

                console.error(
                    "Update Cart Quantity Error:",
                    error
                );

                toast.error(
                    error?.message ||
                    "Failed to update quantity"
                );

            });

    }


    // ==========================================
    // Delete Cart Item
    // ==========================================

    function handleDeleteCartItem(
        productId
    ) {

        if (!productId) {

            toast.error(
                "Product ID not found."
            );

            return;

        }


        dispatch(
            deleteCartItem(productId)
        )
            .unwrap()
            .then((data) => {

                if (data?.success) {

                    toast.success(
                        data.message ||
                        "Product removed from cart"
                    );

                }

            })
            .catch((error) => {

                console.error(
                    "Delete Cart Item Error:",
                    error
                );

                toast.error(
                    error?.message ||
                    "Failed to remove product"
                );

            });

    }


    // ==========================================
    // Checkout
    // ==========================================

    function handleCheckout() {

        if (
            !cartItems ||
            cartItems.length === 0
        ) {

            toast.error(
                "Your cart is empty."
            );

            return;

        }


        navigate(
            "/shop/checkout"
        );

    }


    // ==========================================
    // Calculate Total
    // ==========================================

    const totalCartAmount =
        (cartItems || []).reduce(
            (
                total,
                item
            ) => {

                const price =
                    Number(
                        item?.salePrice
                    ) > 0
                        ? Number(
                            item.salePrice
                        )
                        : Number(
                            item?.price || 0
                        );


                const quantity =
                    Number(
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
    // Render
    // ==========================================

    return (
        <div className="flex h-full flex-col">


            {/* ==========================================
                Cart Header
            ========================================== */}

            <SheetHeader className="border-b pb-4">

                <SheetTitle>
                    Your Cart
                </SheetTitle>

            </SheetHeader>


            {/* ==========================================
                Cart Items
            ========================================== */}

            <div className="flex-1 overflow-y-auto py-4">

                {isLoading ? (

                    <div className="flex h-32 items-center justify-center">

                        <p className="text-sm text-muted-foreground">
                            Loading cart...
                        </p>

                    </div>

                ) : cartItems?.length > 0 ? (

                    <div className="flex flex-col gap-4">


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


                                return (

                                    <div
                                        key={
                                            item?.productId
                                        }
                                        className="flex gap-4 border-b pb-4 last:border-b-0"
                                    >


                                        {/* ==================================
                                            Product Image
                                        ================================== */}

                                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-muted">

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


                                        {/* ==================================
                                            Product Information
                                        ================================== */}

                                        <div className="flex min-w-0 flex-1 flex-col">


                                            {/* ==================================
                                                Title + Delete
                                            ================================== */}

                                            <div className="flex items-start justify-between gap-2">

                                                <h3 className="line-clamp-2 text-sm font-semibold">

                                                    {
                                                        item?.title ||
                                                        "Product"
                                                    }

                                                </h3>


                                                {/* Delete Button */}

                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                                                    onClick={() =>
                                                        handleDeleteCartItem(
                                                            item?.productId
                                                        )
                                                    }
                                                >

                                                    <Trash2 className="h-4 w-4" />

                                                    <span className="sr-only">
                                                        Remove product
                                                    </span>

                                                </Button>

                                            </div>


                                            {/* ==================================
                                                Product Price
                                            ================================== */}

                                            <p className="mt-1 text-sm font-semibold">

                                                ₹
                                                {price.toFixed(2)}

                                            </p>


                                            {/* ==================================
                                                Quantity + Item Total
                                            ================================== */}

                                            <div className="mt-2 flex items-center justify-between gap-3">


                                                {/* Quantity Controls */}

                                                <div className="flex items-center rounded-md border">


                                                    {/* Minus */}

                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-none"
                                                        disabled={
                                                            quantity <=
                                                            1 ||
                                                            isLoading
                                                        }
                                                        onClick={() =>
                                                            handleUpdateQuantity(
                                                                item?.productId,
                                                                quantity,
                                                                "minus"
                                                            )
                                                        }
                                                    >

                                                        <Minus className="h-4 w-4" />

                                                    </Button>


                                                    {/* Quantity */}

                                                    <span className="w-8 text-center text-sm font-medium">

                                                        {
                                                            quantity
                                                        }

                                                    </span>


                                                    {/* Plus */}

                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-none"
                                                        disabled={
                                                            isLoading
                                                        }
                                                        onClick={() =>
                                                            handleUpdateQuantity(
                                                                item?.productId,
                                                                quantity,
                                                                "plus"
                                                            )
                                                        }
                                                    >

                                                        <Plus className="h-4 w-4" />

                                                    </Button>

                                                </div>


                                                {/* Item Total */}

                                                <span className="text-right text-sm font-bold">

                                                    ₹
                                                    {(
                                                        price *
                                                        quantity
                                                    ).toFixed(2)}

                                                </span>

                                            </div>

                                        </div>

                                    </div>

                                );

                            }
                        )}

                    </div>

                ) : (

                    <div className="flex h-40 items-center justify-center">

                        <p className="text-sm text-muted-foreground">
                            Your cart is empty.
                        </p>

                    </div>

                )}

            </div>


            {/* ==========================================
                Cart Footer
            ========================================== */}

            {cartItems?.length > 0 && (

                <div className="border-t pt-4">


                    <Separator className="mb-4" />


                    {/* ==================================
                        Total
                    ================================== */}

                    <div className="mb-4 flex items-center justify-between">

                        <span className="text-base font-semibold">
                            Total
                        </span>

                        <span className="text-xl font-bold">
                            ₹
                            {totalCartAmount.toFixed(
                                2
                            )}
                        </span>

                    </div>


                    {/* ==================================
                        Checkout Button
                    ================================== */}

                    <Button
                        type="button"
                        className="w-full"
                        onClick={
                            handleCheckout
                        }
                    >
                        Checkout
                    </Button>

                </div>

            )}

        </div>
    );
}


export default UserCartWrapper;