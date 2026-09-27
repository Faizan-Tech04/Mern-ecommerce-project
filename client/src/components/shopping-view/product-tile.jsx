import { useState } from "react";
import { useDispatch } from "react-redux";

import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Button } from "../ui/button";

import {
    brandOptionsMap,
    categoryOptionsMap,
} from "@/config";

import {
    addToCart,
    fetchCartItems,
} from "@/store/shop/cart-slice";

import { toast } from "sonner";


function ShoppingProductTile({
    product,
    handleGetProductDetails,
}) {

    const dispatch = useDispatch();


    // ==========================================
    // Track Currently Adding Product
    // ==========================================

    const [
        addingProductId,
        setAddingProductId,
    ] = useState(null);


    // ==========================================
    // Product Information
    // ==========================================

    const productId =
        product?._id;

    const totalStock =
        Number(product?.totalStock || 0);

    const hasSale =
        Number(product?.salePrice) > 0;

    const isOutOfStock =
        totalStock <= 0;

    const isAdding =
        addingProductId === productId;


    // ==========================================
    // Add To Cart
    // ==========================================

    const handleAddToCart = async () => {

        // --------------------------------------
        // Product Validation
        // --------------------------------------

        if (!productId) {

            toast.error(
                "Product information not found."
            );

            return;
        }


        // --------------------------------------
        // Stock Validation
        // --------------------------------------

        if (isOutOfStock) {

            toast.error(
                "This product is out of stock."
            );

            return;
        }


        // --------------------------------------
        // Start Loading
        // --------------------------------------

        setAddingProductId(
            productId
        );


        try {

            // ----------------------------------
            // Add Product To Cart
            // ----------------------------------

            const data =
                await dispatch(
                    addToCart({
                        productId,
                        quantity: 1,
                    })
                ).unwrap();


            // ----------------------------------
            // Success
            // ----------------------------------

            if (data?.success) {

                toast.success(
                    "Product added to cart!"
                );


                // ------------------------------
                // Refresh Cart
                // ------------------------------

                await dispatch(
                    fetchCartItems()
                );
            }

        } catch (error) {

            console.error(
                "ADD TO CART ERROR:",
                error
            );


            toast.error(
                error?.message ||
                error?.data?.message ||
                "Failed to add product to cart."
            );

        } finally {

            // ----------------------------------
            // Stop Loading
            // ----------------------------------

            setAddingProductId(null);
        }
    };


    // ==========================================
    // Render
    // ==========================================

    return (
        <Card className="mx-auto flex h-full w-full max-w-sm flex-col overflow-hidden">


            {/* ==========================================
                Product Image
            ========================================== */}

            <div
                className="relative cursor-pointer"
                onClick={() =>
                    handleGetProductDetails(
                        productId
                    )
                }
            >

                <img
                    src={product?.image}
                    alt={
                        product?.title ||
                        "Product"
                    }
                    className="h-[300px] w-full object-cover"
                />


                {/* ==========================================
                    Sale Badge
                ========================================== */}

                {hasSale && (
                    <Badge className="absolute left-2 top-2 bg-red-500 hover:bg-red-600">
                        Sale
                    </Badge>
                )}


                {/* ==========================================
                    Out Of Stock Badge
                ========================================== */}

                {isOutOfStock && (
                    <Badge className="absolute right-2 top-2 bg-black text-white hover:bg-black">
                        Out of Stock
                    </Badge>
                )}

            </div>


            {/* ==========================================
                Product Details
            ========================================== */}

            <CardContent className="flex flex-1 flex-col p-4">


                {/* ==========================================
                    Product Title
                ========================================== */}

                <h2 className="mb-2 line-clamp-1 text-xl font-bold">
                    {product?.title}
                </h2>


                {/* ==========================================
                    Category + Brand
                ========================================== */}

                <div className="mb-2 flex items-center justify-between gap-4">

                    <span className="text-sm text-muted-foreground">

                        {
                            categoryOptionsMap[
                            product?.category
                            ] ||
                            product?.category
                        }

                    </span>


                    <span className="text-sm font-medium">

                        {
                            brandOptionsMap[
                            product?.brand
                            ] ||
                            product?.brand
                        }

                    </span>

                </div>


                {/* ==========================================
                    Price
                ========================================== */}

                <div className="mb-2 flex items-center gap-2">

                    {/* Original Price */}

                    <span
                        className={`text-sm font-semibold ${hasSale
                                ? "text-muted-foreground line-through"
                                : "text-primary"
                            }`}
                    >
                        ₹
                        {Number(
                            product?.price || 0
                        ).toFixed(2)}
                    </span>


                    {/* Sale Price */}

                    {hasSale && (
                        <span className="text-sm font-semibold text-primary">
                            ₹
                            {Number(
                                product?.salePrice || 0
                            ).toFixed(2)}
                        </span>
                    )}

                </div>


                {/* ==========================================
                    Stock Information
                ========================================== */}

                <div className="mt-auto pt-2">

                    {isOutOfStock ? (

                        <p className="text-sm font-medium text-red-600">
                            Out of stock
                        </p>

                    ) : (

                        <p className="text-sm text-muted-foreground">

                            {totalStock === 1
                                ? "Only 1 item left"
                                : `${totalStock} items available`}

                        </p>

                    )}

                </div>

            </CardContent>


            {/* ==========================================
                Add To Cart
            ========================================== */}

            <CardFooter className="mt-auto p-4 pt-0">

                <Button
                    type="button"
                    className="w-full"
                    onClick={
                        handleAddToCart
                    }
                    disabled={
                        isOutOfStock ||
                        isAdding
                    }
                >

                    {isAdding
                        ? "Adding..."
                        : isOutOfStock
                            ? "Out of Stock"
                            : "Add to cart"}

                </Button>

            </CardFooter>

        </Card>
    );
}


export default ShoppingProductTile;