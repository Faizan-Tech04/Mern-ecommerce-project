import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    Dialog,
    DialogContent,
} from "../ui/dialog";

import { Button } from "../ui/button";

import {
    Avatar,
    AvatarFallback,
} from "../ui/avatar";

import {
    StarIcon,
    Loader2,
} from "lucide-react";

import {
    categoryOptionsMap,
    brandOptionsMap,
} from "@/config";

import {
    addToCart,
    fetchCartItems,
} from "@/store/shop/cart-slice";

import {
    getReviews,
    addReview,
    clearReviews,
} from "@/store/shop/review-slice";

import { toast } from "sonner";

// ==========================================
// Product Details Dialog
// ==========================================

function ProductDetailsDialog({
    open,
    setOpen,
    productDetails,
}) {
    const dispatch = useDispatch();

    // ==========================================
    // Cart State
    // ==========================================

    const {
        isLoading: cartLoading,
    } = useSelector(
        (state) => state.shopCart
    );

    // ==========================================
    // Review State
    // ==========================================

    const {
        reviews,
        totalReviews,
        averageRating,
        isLoading: reviewsLoading,
        isSubmitting: reviewSubmitting,
        error: reviewError,
    } = useSelector(
        (state) => state.review
    );

    // ==========================================
    // Review Input State
    // ==========================================

    const [reviewText, setReviewText] =
        useState("");

    const [selectedRating, setSelectedRating] =
        useState(5);

    // ==========================================
    // Fetch Reviews When Product Opens
    // ==========================================

    useEffect(() => {
        if (
            open &&
            productDetails?._id
        ) {
            dispatch(
                getReviews(
                    productDetails._id
                )
            );
        }
    }, [
        open,
        productDetails?._id,
        dispatch,
    ]);

    // ==========================================
    // Clear Review State When Dialog Closes
    // ==========================================

    useEffect(() => {
        if (!open) {
            setReviewText("");
            setSelectedRating(5);

            dispatch(clearReviews());
        }
    }, [open, dispatch]);

    // ==========================================
    // Product Stock
    // ==========================================

    const totalStock = Number(
        productDetails?.totalStock || 0
    );

    const isOutOfStock =
        totalStock <= 0;

    const isLowStock =
        totalStock > 0 &&
        totalStock <= 5;

    // ==========================================
    // Sale Price Check
    // ==========================================

    const hasSale =
        Number(
            productDetails?.salePrice
        ) > 0;

    // ==========================================
    // Display Price
    // ==========================================

    const displayPrice = hasSale
        ? productDetails?.salePrice
        : productDetails?.price;

    // ==========================================
    // Render Stars
    // ==========================================

    function renderStars(
        rating,
        interactive = false
    ) {
        return Array.from({
            length: 5,
        }).map((_, index) => {
            const starNumber =
                index + 1;

            const isFilled =
                starNumber <=
                Number(rating || 0);

            return (
                <StarIcon
                    key={index}
                    className={`h-4 w-4 ${interactive
                            ? "cursor-pointer transition-transform hover:scale-110"
                            : ""
                        } ${isFilled
                            ? "fill-primary text-primary"
                            : "text-muted-foreground"
                        }`}
                    onClick={
                        interactive
                            ? () =>
                                setSelectedRating(
                                    starNumber
                                )
                            : undefined
                    }
                />
            );
        });
    }

    // ==========================================
    // Add To Cart
    // ==========================================

    function handleAddToCart() {
        // Product validation
        if (!productDetails?._id) {
            toast.error(
                "Product information not found."
            );
            return;
        }

        // Stock validation
        if (isOutOfStock) {
            toast.error(
                "This product is out of stock."
            );
            return;
        }

        // Add exactly 1 item per click
        dispatch(
            addToCart({
                productId:
                    productDetails._id,
                quantity: 1,
            })
        )
            .unwrap()
            .then((data) => {
                if (data?.success) {
                    toast.success(
                        "Product added to cart!"
                    );

                    // Refresh cart
                    dispatch(
                        fetchCartItems()
                    );

                    // Close dialog
                    setOpen(false);
                }
            })
            .catch((error) => {
                console.error(
                    "Add To Cart Error:",
                    error
                );

                toast.error(
                    error?.message ||
                    "Failed to add product to cart."
                );
            });
    }

    // ==========================================
    // Submit Review
    // ==========================================

    async function handleSubmitReview(
        event
    ) {
        event.preventDefault();

        const trimmedReview =
            reviewText.trim();

        // Product validation
        if (!productDetails?._id) {
            toast.error(
                "Product information not found."
            );
            return;
        }

        // Review validation
        if (!trimmedReview) {
            toast.error(
                "Please write a review."
            );
            return;
        }

        if (
            trimmedReview.length < 2
        ) {
            toast.error(
                "Review must contain at least 2 characters."
            );
            return;
        }

        if (
            trimmedReview.length > 500
        ) {
            toast.error(
                "Review cannot exceed 500 characters."
            );
            return;
        }

        try {
            const result = await dispatch(
                addReview({
                    productId:
                        productDetails._id,
                    rating: selectedRating,
                    comment:
                        trimmedReview,
                })
            ).unwrap();

            if (result?.success) {
                toast.success(
                    "Review submitted successfully!"
                );

                // Clear form
                setReviewText("");
                setSelectedRating(5);
            }
        } catch (error) {
            console.error(
                "Submit Review Error:",
                error
            );

            toast.error(
                error ||
                "Failed to submit review."
            );
        }
    }

    // ==========================================
    // Review Error Toast
    // ==========================================

    useEffect(() => {
        if (reviewError) {
            // Error is already handled
            // through submit/fetch flows.
            console.error(
                "Review Error:",
                reviewError
            );
        }
    }, [reviewError]);

    // ==========================================
    // Render
    // ==========================================

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogContent className="max-h-[90vh] w-[95vw] max-w-[900px] overflow-y-auto p-6 sm:p-8">
                {/* ==========================================
                    Main Product Details
                ========================================== */}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* ==========================================
                        Product Image
                    ========================================== */}

                    <div className="relative overflow-hidden rounded-lg">
                        <img
                            src={
                                productDetails?.image
                            }
                            alt={
                                productDetails?.title ||
                                "Product"
                            }
                            className="aspect-square w-full rounded-lg object-cover"
                        />

                        {/* Sale Badge */}

                        {hasSale && (
                            <span className="absolute left-3 top-3 rounded-md bg-red-500 px-3 py-1 text-sm font-semibold text-white">
                                Sale
                            </span>
                        )}

                        {/* Out Of Stock Badge */}

                        {isOutOfStock && (
                            <span className="absolute right-3 top-3 rounded-md bg-black/80 px-3 py-1 text-sm font-semibold text-white">
                                Out of Stock
                            </span>
                        )}
                    </div>

                    {/* ==========================================
                        Product Information
                    ========================================== */}

                    <div className="flex flex-col">
                        {/* Product Title */}

                        <h1 className="text-2xl font-bold sm:text-3xl">
                            {
                                productDetails?.title
                            }
                        </h1>

                        {/* Category + Brand */}

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                                {
                                    categoryOptionsMap[
                                    productDetails
                                        ?.category
                                    ] ||
                                    productDetails?.category
                                }
                            </span>

                            <span className="text-sm text-muted-foreground">
                                •
                            </span>

                            <span className="text-sm text-muted-foreground">
                                {
                                    brandOptionsMap[
                                    productDetails
                                        ?.brand
                                    ] ||
                                    productDetails?.brand
                                }
                            </span>
                        </div>

                        {/* Description */}

                        <p className="mt-3 text-sm text-muted-foreground">
                            {
                                productDetails?.description
                            }
                        </p>

                        {/* ==========================================
                            Price + Stock
                        ========================================== */}

                        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            {/* Price */}

                            <div className="flex items-center gap-3">
                                {hasSale && (
                                    <span className="text-xl font-bold text-muted-foreground line-through">
                                        ₹
                                        {
                                            productDetails?.price
                                        }
                                    </span>
                                )}

                                <span className="text-xl font-bold">
                                    ₹
                                    {
                                        displayPrice
                                    }
                                </span>
                            </div>

                            {/* Stock */}

                            <div>
                                {isOutOfStock ? (
                                    <span className="text-sm font-semibold text-red-500">
                                        Out of Stock
                                    </span>
                                ) : isLowStock ? (
                                    <span className="text-sm font-semibold text-orange-500">
                                        Only{" "}
                                        {
                                            totalStock
                                        }{" "}
                                        {totalStock ===
                                            1
                                            ? "item"
                                            : "items"}{" "}
                                        available
                                    </span>
                                ) : (
                                    <span className="text-sm font-medium text-muted-foreground">
                                        {
                                            totalStock
                                        }{" "}
                                        {totalStock ===
                                            1
                                            ? "item"
                                            : "items"}{" "}
                                        available
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* ==========================================
                            Product Rating
                        ========================================== */}

                        <div className="mt-3 flex items-center gap-2">
                            <div className="flex items-center gap-0.5">
                                {renderStars(
                                    averageRating
                                )}
                            </div>

                            <span className="text-sm text-muted-foreground">
                                {averageRating > 0
                                    ? averageRating.toFixed(
                                        1
                                    )
                                    : "No ratings"}{" "}
                                (
                                {
                                    totalReviews
                                }{" "}
                                {totalReviews ===
                                    1
                                    ? "review"
                                    : "reviews"}
                                )
                            </span>
                        </div>

                        {/* ==========================================
                            Add To Cart
                        ========================================== */}

                        <Button
                            type="button"
                            className="mt-4 w-full"
                            disabled={
                                cartLoading ||
                                isOutOfStock
                            }
                            onClick={
                                handleAddToCart
                            }
                        >
                            {isOutOfStock
                                ? "Out of Stock"
                                : cartLoading
                                    ? "Adding..."
                                    : "Add to Cart"}
                        </Button>

                        {/* ==========================================
                            Stock Information
                        ========================================== */}

                        {!isOutOfStock && (
                            <p className="mt-2 text-center text-xs text-muted-foreground">
                                You can add up to{" "}
                                <span className="font-semibold text-foreground">
                                    {
                                        totalStock
                                    }
                                </span>{" "}
                                {totalStock ===
                                    1
                                    ? "item"
                                    : "items"}{" "}
                                of this product
                                to your cart.
                            </p>
                        )}

                        {/* Separator */}

                        <div className="my-4 border-t" />

                        {/* ==========================================
                            Reviews Heading
                        ========================================== */}

                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold">
                                Reviews
                            </h2>

                            {totalReviews >
                                0 && (
                                    <span className="text-sm text-muted-foreground">
                                        {
                                            totalReviews
                                        }{" "}
                                        {totalReviews ===
                                            1
                                            ? "review"
                                            : "reviews"}
                                    </span>
                                )}
                        </div>

                        {/* ==========================================
                            Reviews Loading
                        ========================================== */}

                        {reviewsLoading && (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />

                                <span className="ml-2 text-sm text-muted-foreground">
                                    Loading reviews...
                                </span>
                            </div>
                        )}

                        {/* ==========================================
                            Reviews List
                        ========================================== */}

                        {!reviewsLoading &&
                            reviews.length >
                            0 && (
                                <div className="mt-4 grid gap-4">
                                    {reviews.map(
                                        (
                                            review
                                        ) => (
                                            <div
                                                key={
                                                    review._id
                                                }
                                                className="flex gap-3"
                                            >
                                                {/* User Avatar */}

                                                <Avatar className="h-9 w-9 shrink-0">
                                                    <AvatarFallback className="text-xs">
                                                        {review.userName
                                                            ?.split(
                                                                " "
                                                            )
                                                            .map(
                                                                (
                                                                    name
                                                                ) =>
                                                                    name?.[0]
                                                            )
                                                            .join(
                                                                ""
                                                            )
                                                            .slice(
                                                                0,
                                                                2
                                                            )
                                                            .toUpperCase() ||
                                                            "U"}
                                                    </AvatarFallback>
                                                </Avatar>

                                                {/* Review Content */}

                                                <div className="min-w-0 flex-1">
                                                    {/* User Name */}

                                                    <h3 className="text-sm font-bold">
                                                        {
                                                            review.userName
                                                        }
                                                    </h3>

                                                    {/* Stars */}

                                                    <div className="mt-1 flex items-center gap-0.5">
                                                        {renderStars(
                                                            review.rating
                                                        )}
                                                    </div>

                                                    {/* Comment */}

                                                    <p className="mt-1 break-words text-sm text-muted-foreground">
                                                        {
                                                            review.comment
                                                        }
                                                    </p>

                                                    {/* Date */}

                                                    {review.createdAt && (
                                                        <p className="mt-1 text-xs text-muted-foreground">
                                                            {new Date(
                                                                review.createdAt
                                                            ).toLocaleDateString(
                                                                "en-IN",
                                                                {
                                                                    day: "numeric",
                                                                    month: "short",
                                                                    year: "numeric",
                                                                }
                                                            )}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}

                        {/* ==========================================
                            No Reviews
                        ========================================== */}

                        {!reviewsLoading &&
                            reviews.length ===
                            0 && (
                                <div className="mt-4 rounded-lg border border-dashed p-6 text-center">
                                    <StarIcon className="mx-auto h-8 w-8 text-muted-foreground" />

                                    <p className="mt-2 text-sm font-medium">
                                        No reviews
                                        yet
                                    </p>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Be the first
                                        to review
                                        this
                                        product.
                                    </p>
                                </div>
                            )}

                        {/* ==========================================
                            Write Review
                        ========================================== */}

                        <form
                            onSubmit={
                                handleSubmitReview
                            }
                            className="mt-5 rounded-lg border p-4"
                        >
                            <h3 className="text-sm font-semibold">
                                Write a Review
                            </h3>

                            {/* Rating Selector */}

                            <div className="mt-3">
                                <p className="mb-2 text-xs text-muted-foreground">
                                    Your Rating
                                </p>

                                <div className="flex items-center gap-1">
                                    {renderStars(
                                        selectedRating,
                                        true
                                    )}
                                </div>
                            </div>

                            {/* Review Input */}

                            <div className="mt-3">
                                <textarea
                                    value={
                                        reviewText
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setReviewText(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="Write a review..."
                                    maxLength={500}
                                    rows={3}
                                    className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
                                />

                                <div className="mt-1 text-right text-xs text-muted-foreground">
                                    {
                                        reviewText.length
                                    }
                                    /500
                                </div>
                            </div>

                            {/* Submit Button */}

                            <Button
                                type="submit"
                                size="sm"
                                className="mt-2 w-full"
                                disabled={
                                    reviewSubmitting ||
                                    !reviewText.trim()
                                }
                            >
                                {reviewSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    "Submit Review"
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ProductDetailsDialog;