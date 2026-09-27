import { useEffect, useState } from "react";

import {
    ChevronLeftIcon,
    ChevronRightIcon,
    ShirtIcon,
    CloudLightning,
    BabyIcon,
    WatchIcon,
    UmbrellaIcon,
    TagsIcon,
    ShoppingBagIcon,
    CrownIcon,
    ZapIcon,
    GemIcon,
    SparklesIcon,
    Loader2,
} from "lucide-react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import {
    fetchAllFilteredProducts,
    fetchProductDetails,
} from "@/store/shop/product-slice";

import ShoppingProductTile from "@/components/shopping-view/product-tile";

import ProductDetailsDialog from "@/components/shopping-view/product-details";

// ==========================================
// Feature / Slide
// ==========================================

import {
    getFeatures,
} from "@/store/admin/feature-slice";

// ==========================================
// Shopping Home
// ==========================================

function ShoppingHome() {
    // ==========================================
    // Categories
    // ==========================================

    const categories = [
        {
            id: "men",
            label: "Men",
            icon: ShirtIcon,
        },
        {
            id: "women",
            label: "Women",
            icon: CloudLightning,
        },
        {
            id: "kids",
            label: "Kids",
            icon: BabyIcon,
        },
        {
            id: "accessories",
            label: "Accessories",
            icon: WatchIcon,
        },
        {
            id: "footwear",
            label: "Footwear",
            icon: UmbrellaIcon,
        },
    ];

    // ==========================================
    // Brands
    // ==========================================

    const brands = [
        {
            id: "nike",
            label: "Nike",
            icon: TagsIcon,
        },
        {
            id: "adidas",
            label: "Adidas",
            icon: ShoppingBagIcon,
        },
        {
            id: "puma",
            label: "Puma",
            icon: ZapIcon,
        },
        {
            id: "levi",
            label: "Levi's",
            icon: CrownIcon,
        },
        {
            id: "zara",
            label: "Zara",
            icon: GemIcon,
        },
        {
            id: "h&m",
            label: "H&M",
            icon: SparklesIcon,
        },
    ];

    // ==========================================
    // State
    // ==========================================

    const [
        currentSlide,
        setCurrentSlide,
    ] = useState(0);

    const [
        openDetailsDialog,
        setOpenDetailsDialog,
    ] = useState(false);

    // ==========================================
    // Redux
    // ==========================================

    const dispatch = useDispatch();

    const navigate = useNavigate();

    // ==========================================
    // Product State
    // ==========================================

    const {
        productList,
        productDetails,
    } = useSelector(
        (state) => state.shopProducts
    );

    // ==========================================
    // Feature / Slide State
    // ==========================================

    const {
        featureList,
        isLoading: featureLoading,
        error: featureError,
    } = useSelector(
        (state) => state.adminFeatures
    );

    // ==========================================
    // Fetch Features / Slides
    // ==========================================

    useEffect(() => {
        dispatch(getFeatures());
    }, [dispatch]);

    // ==========================================
    // Reset Slide When Feature List Changes
    // ==========================================

    useEffect(() => {
        if (
            featureList?.length > 0 &&
            currentSlide >=
            featureList.length
        ) {
            setCurrentSlide(0);
        }
    }, [
        featureList,
        currentSlide,
    ]);

    // ==========================================
    // Previous Slide
    // ==========================================

    function handlePrevious() {
        if (
            !featureList ||
            featureList.length === 0
        ) {
            return;
        }

        setCurrentSlide(
            (prev) =>
                prev === 0
                    ? featureList.length - 1
                    : prev - 1
        );
    }

    // ==========================================
    // Next Slide
    // ==========================================

    function handleNext() {
        if (
            !featureList ||
            featureList.length === 0
        ) {
            return;
        }

        setCurrentSlide(
            (prev) =>
                prev ===
                    featureList.length - 1
                    ? 0
                    : prev + 1
        );
    }

    // ==========================================
    // Auto Slide
    // ==========================================

    useEffect(() => {
        if (
            !featureList ||
            featureList.length <= 1
        ) {
            return;
        }

        const interval =
            setInterval(() => {
                setCurrentSlide(
                    (prev) =>
                        prev ===
                            featureList.length - 1
                            ? 0
                            : prev + 1
                );
            }, 4000);

        return () =>
            clearInterval(
                interval
            );
    }, [featureList]);

    // ==========================================
    // Go To Specific Slide
    // ==========================================

    function handleDotClick(index) {
        setCurrentSlide(index);
    }

    // ==========================================
    // Category Click
    // ==========================================

    function handleCategoryClick(
        categoryId
    ) {
        navigate(
            `/shop/listing?category=${encodeURIComponent(
                categoryId
            )}`
        );
    }

    // ==========================================
    // Brand Click
    // ==========================================

    function handleBrandClick(
        brandId
    ) {
        navigate(
            `/shop/listing?brand=${encodeURIComponent(
                brandId
            )}`
        );
    }

    // ==========================================
    // Fetch Products
    // ==========================================

    useEffect(() => {
        dispatch(
            fetchAllFilteredProducts({
                filterParams: {},
                sortParams:
                    "price-lowtohigh",
            })
        );
    }, [dispatch]);

    // ==========================================
    // Product Details
    // ==========================================

    function handleGetProductDetails(
        getCurrentProductId
    ) {
        dispatch(
            fetchProductDetails(
                getCurrentProductId
            )
        );

        setOpenDetailsDialog(
            true
        );
    }

    // ==========================================
    // Featured Products
    // ==========================================

    const featuredProducts =
        productList?.slice(
            0,
            20
        ) || [];

    // ==========================================
    // Render
    // ==========================================

    return (
        <div className="flex min-h-screen w-full flex-col">

            {/* ==========================================
                Hero / Feature Carousel
            ========================================== */}

            <section className="relative w-full overflow-hidden bg-gray-100">

                {/* ======================================
                    Loading State
                ====================================== */}

                {featureLoading && (
                    <div className="flex h-[220px] w-full items-center justify-center sm:h-[320px] md:h-[420px] lg:h-[500px]">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                )}

                {/* ======================================
                    Error State
                ====================================== */}

                {!featureLoading &&
                    featureError && (
                        <div className="flex h-[220px] w-full items-center justify-center px-4 text-center sm:h-[320px] md:h-[420px] lg:h-[500px]">
                            <div>
                                <p className="text-sm font-medium text-destructive">
                                    Failed to load
                                    homepage slides.
                                </p>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    Please try again
                                    later.
                                </p>
                            </div>
                        </div>
                    )}

                {/* ======================================
                    Empty State
                ====================================== */}

                {!featureLoading &&
                    !featureError &&
                    featureList?.length ===
                    0 && (
                        <div className="flex h-[220px] w-full items-center justify-center px-4 text-center sm:h-[320px] md:h-[420px] lg:h-[500px]">
                            <div>
                                <p className="text-sm font-medium">
                                    No homepage
                                    slides available.
                                </p>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    Add slides from
                                    the admin
                                    dashboard.
                                </p>
                            </div>
                        </div>
                    )}

                {/* ======================================
                    Slides
                ====================================== */}

                {!featureLoading &&
                    !featureError &&
                    featureList?.length >
                    0 && (
                        <>
                            <div
                                className="flex w-full transition-transform duration-700 ease-in-out"
                                style={{
                                    transform: `translateX(-${currentSlide *
                                        100
                                        }%)`,
                                }}
                            >
                                {featureList.map(
                                    (
                                        feature,
                                        index
                                    ) => (
                                        <div
                                            key={
                                                feature._id
                                            }
                                            className="relative flex h-[220px] min-w-full shrink-0 items-center justify-center bg-gray-100 sm:h-[320px] md:h-[420px] lg:h-[500px]"
                                        >
                                            <img
                                                src={
                                                    feature.image
                                                }
                                                alt={
                                                    feature.title ||
                                                    `Fashion banner ${index +
                                                    1
                                                    }`
                                                }
                                                className="h-full w-full object-contain object-center"
                                                loading={
                                                    index ===
                                                        0
                                                        ? "eager"
                                                        : "lazy"
                                                }
                                            />
                                        </div>
                                    )
                                )}
                            </div>

                            {/* ======================================
                                Previous Button
                            ====================================== */}

                            {featureList.length >
                                1 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={
                                            handlePrevious
                                        }
                                        className="absolute left-3 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full border bg-white/90 shadow-md backdrop-blur-sm transition-all hover:scale-105 hover:bg-white sm:left-5 sm:h-10 sm:w-10"
                                    >
                                        <ChevronLeftIcon className="h-5 w-5" />

                                        <span className="sr-only">
                                            Previous
                                            banner
                                        </span>
                                    </Button>
                                )}

                            {/* ======================================
                                Next Button
                            ====================================== */}

                            {featureList.length >
                                1 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={
                                            handleNext
                                        }
                                        className="absolute right-3 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full border bg-white/90 shadow-md backdrop-blur-sm transition-all hover:scale-105 hover:bg-white sm:right-5 sm:h-10 sm:w-10"
                                    >
                                        <ChevronRightIcon className="h-5 w-5" />

                                        <span className="sr-only">
                                            Next banner
                                        </span>
                                    </Button>
                                )}

                            {/* ======================================
                                Dots
                            ====================================== */}

                            {featureList.length >
                                1 && (
                                    <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
                                        {featureList.map(
                                            (
                                                _,
                                                index
                                            ) => (
                                                <button
                                                    key={
                                                        index
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        handleDotClick(
                                                            index
                                                        )
                                                    }
                                                    aria-label={`Go to banner ${index +
                                                        1
                                                        }`}
                                                    className={`h-2.5 rounded-full transition-all duration-300 ${currentSlide ===
                                                        index
                                                        ? "w-7 bg-black"
                                                        : "w-2.5 bg-black/30"
                                                        }`}
                                                />
                                            )
                                        )}
                                    </div>
                                )}
                        </>
                    )}
            </section>

            {/* ==========================================
                Shop By Category
            ========================================== */}

            <section className="w-full bg-gray-50 py-12 sm:py-16">

                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

                    <div className="mb-8 text-center">

                        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            Shop by Category
                        </h2>

                        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                            Explore our latest
                            collections
                        </p>

                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">

                        {categories.map(
                            (
                                category
                            ) => {
                                const Icon =
                                    category.icon;

                                return (
                                    <button
                                        key={
                                            category.id
                                        }
                                        type="button"
                                        onClick={() =>
                                            handleCategoryClick(
                                                category.id
                                            )
                                        }
                                        className="group flex flex-col items-center rounded-xl border bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                    >
                                        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 transition-all duration-300 group-hover:bg-black group-hover:text-white">
                                            <Icon className="h-9 w-9" />
                                        </div>

                                        <h3 className="text-base font-bold">
                                            {
                                                category.label
                                            }
                                        </h3>
                                    </button>
                                );
                            }
                        )}

                    </div>

                </div>

            </section>

            {/* ==========================================
                Shop By Brand
            ========================================== */}

            <section className="w-full bg-white py-12 sm:py-16">

                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

                    <div className="mb-8 text-center">

                        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            Shop by Brand
                        </h2>

                        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                            Explore products from
                            your favorite brands
                        </p>

                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">

                        {brands.map(
                            (
                                brand
                            ) => {
                                const Icon =
                                    brand.icon;

                                return (
                                    <button
                                        key={
                                            brand.id
                                        }
                                        type="button"
                                        onClick={() =>
                                            handleBrandClick(
                                                brand.id
                                            )
                                        }
                                        className="group flex flex-col items-center justify-center rounded-xl border bg-gray-50 p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg"
                                    >
                                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm transition-all duration-300 group-hover:bg-black group-hover:text-white">
                                            <Icon className="h-7 w-7" />
                                        </div>

                                        <h3 className="text-base font-bold">
                                            {
                                                brand.label
                                            }
                                        </h3>
                                    </button>
                                );
                            }
                        )}

                    </div>

                </div>

            </section>

            {/* ==========================================
                Featured Products
            ========================================== */}

            <section className="w-full bg-gray-50 py-12 sm:py-16">

                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

                    <div className="mb-8 text-center">

                        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            Featured Products
                        </h2>

                        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                            Discover our popular
                            products
                        </p>

                    </div>

                    {featuredProducts.length >
                        0 ? (
                        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {featuredProducts.map(
                                (
                                    product
                                ) => (
                                    <ShoppingProductTile
                                        key={
                                            product._id
                                        }
                                        product={
                                            product
                                        }
                                        handleGetProductDetails={
                                            handleGetProductDetails
                                        }
                                    />
                                )
                            )}
                        </div>
                    ) : (
                        <div className="w-full py-10 text-center">
                            <p className="text-muted-foreground">
                                No featured
                                products found.
                            </p>
                        </div>
                    )}

                </div>

            </section>

            {/* ==========================================
                Product Details Dialog
            ========================================== */}

            <ProductDetailsDialog
                open={
                    openDetailsDialog
                }
                setOpen={
                    setOpenDetailsDialog
                }
                productDetails={
                    productDetails
                }
            />
        </div>
    );
}

export default ShoppingHome;