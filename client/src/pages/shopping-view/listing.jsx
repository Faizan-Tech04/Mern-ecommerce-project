import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    useSearchParams,
} from "react-router-dom";

import ProductFilter from "@/components/shopping-view/filter";

import ShoppingProductTile from "@/components/shopping-view/product-tile";

import ProductDetailsDialog from "@/components/shopping-view/product-details";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import {
    ArrowUpDownIcon,
} from "lucide-react";

import {
    fetchAllFilteredProducts,
    fetchProductDetails,
} from "@/store/shop/product-slice";


function ShoppingListing() {

    // ==========================================
    // Redux
    // ==========================================

    const dispatch = useDispatch();

    const {
        productList,
        productDetails,
    } = useSelector(
        (state) => state.shopProducts
    );


    // ==========================================
    // Search Params
    // ==========================================

    const [
        searchParams,
        setSearchParams,
    ] = useSearchParams();


    // ==========================================
    // Get Filters From URL
    // ==========================================

    const filters = useMemo(() => {

        const filtersFromURL = {};


        // --------------------------------------
        // Category
        // --------------------------------------

        const category =
            searchParams.get("category");

        if (category) {

            filtersFromURL.category =
                category
                    .split(",")
                    .filter(Boolean);

        }


        // --------------------------------------
        // Brand
        // --------------------------------------

        const brand =
            searchParams.get("brand");

        if (brand) {

            filtersFromURL.brand =
                brand
                    .split(",")
                    .filter(Boolean);

        }


        return filtersFromURL;

    }, [searchParams]);


    // ==========================================
    // Sort State
    // ==========================================

    const [
        sort,
        setSort,
    ] = useState(
        "price-lowtohigh"
    );


    // ==========================================
    // Product Details Dialog
    // ==========================================

    const [
        openDetailsDialog,
        setOpenDetailsDialog,
    ] = useState(false);


    // ==========================================
    // Get Product Details
    // ==========================================

    function handleGetProductDetails(
        getCurrentProductId
    ) {

        console.log(
            "Selected Product ID:",
            getCurrentProductId
        );


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
    // Handle Sort
    // ==========================================

    function handleSort(value) {

        setSort(value);

    }


    // ==========================================
    // Handle Sidebar Filter
    // ==========================================

    function handleFilter(
        getSectionId,
        getCurrentOption
    ) {

        console.log(
            "Filter:",
            getSectionId,
            getCurrentOption
        );


        // --------------------------------------
        // Copy Current Filters
        // --------------------------------------

        const updatedFilters = {
            ...filters,
        };


        // --------------------------------------
        // Get Current Values
        // --------------------------------------

        const currentValues = [
            ...(updatedFilters[
                getSectionId
            ] || []),
        ];


        // --------------------------------------
        // Find Current Option
        // --------------------------------------

        const indexOfCurrentOption =
            currentValues.indexOf(
                getCurrentOption
            );


        // --------------------------------------
        // Add Filter
        // --------------------------------------

        if (
            indexOfCurrentOption === -1
        ) {

            currentValues.push(
                getCurrentOption
            );

        }


        // --------------------------------------
        // Remove Filter
        // --------------------------------------

        else {

            currentValues.splice(
                indexOfCurrentOption,
                1
            );

        }


        // --------------------------------------
        // Update Filter Object
        // --------------------------------------

        if (
            currentValues.length === 0
        ) {

            delete updatedFilters[
                getSectionId
            ];

        } else {

            updatedFilters[
                getSectionId
            ] = currentValues;

        }


        // --------------------------------------
        // Create New URL Params
        // --------------------------------------

        const newSearchParams = {};


        if (
            updatedFilters.category?.length
        ) {

            newSearchParams.category =
                updatedFilters.category.join(",");

        }


        if (
            updatedFilters.brand?.length
        ) {

            newSearchParams.brand =
                updatedFilters.brand.join(",");

        }


        // --------------------------------------
        // Update URL
        // --------------------------------------

        setSearchParams(
            newSearchParams
        );


        console.log(
            "Updated Filters:",
            updatedFilters
        );


        console.log(
            "New URL:",
            newSearchParams
        );

    }


    // ==========================================
    // Fetch Products
    // ==========================================

    useEffect(() => {

        console.log(
            "Fetching products with filters:",
            filters
        );


        dispatch(
            fetchAllFilteredProducts({

                filterParams:
                    filters,

                sortParams:
                    sort,

            })
        );

    }, [
        dispatch,
        filters,
        sort,
    ]);


    // ==========================================
    // Debug
    // ==========================================

    console.log(
        "Shop Products:",
        productList
    );

    console.log(
        "Product Details:",
        productDetails
    );

    console.log(
        "Filters:",
        filters
    );

    console.log(
        "Sort:",
        sort
    );

    console.log(
        "Search Params:",
        searchParams.toString()
    );


    // ==========================================
    // UI
    // ==========================================

    return (
        <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-[300px_1fr] md:p-6">


            {/* ==========================================
                Product Filters
            ========================================== */}

            <ProductFilter
                filters={
                    filters
                }
                handleFilter={
                    handleFilter
                }
            />


            {/* ==========================================
                Products Section
            ========================================== */}

            <div className="w-full rounded-lg bg-background shadow-sm">


                {/* ==========================================
                    Products Header
                ========================================== */}

                <div className="flex items-center justify-between border-b p-4">

                    <h2 className="text-lg font-extrabold">
                        All Products
                    </h2>


                    <div className="flex items-center gap-4">

                        <span className="text-sm text-muted-foreground">

                            {
                                productList?.length ||
                                0
                            }{" "}

                            Products

                        </span>


                        {/* ==========================================
                            Sort Dropdown
                        ========================================== */}

                        <DropdownMenu>

                            <DropdownMenuTrigger
                                asChild
                            >

                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-1"
                                >

                                    <ArrowUpDownIcon className="h-4 w-4" />

                                    <span>
                                        Sort by
                                    </span>

                                </Button>

                            </DropdownMenuTrigger>


                            <DropdownMenuContent align="end">

                                <DropdownMenuRadioGroup
                                    value={
                                        sort
                                    }
                                    onValueChange={
                                        handleSort
                                    }
                                >

                                    <DropdownMenuRadioItem value="price-lowtohigh">

                                        Price: Low to High

                                    </DropdownMenuRadioItem>


                                    <DropdownMenuRadioItem value="price-hightolow">

                                        Price: High to Low

                                    </DropdownMenuRadioItem>


                                    <DropdownMenuRadioItem value="title-atoz">

                                        Title: A to Z

                                    </DropdownMenuRadioItem>


                                    <DropdownMenuRadioItem value="title-ztoa">

                                        Title: Z to A

                                    </DropdownMenuRadioItem>

                                </DropdownMenuRadioGroup>

                            </DropdownMenuContent>

                        </DropdownMenu>

                    </div>

                </div>


                {/* ==========================================
                    Product Grid
                ========================================== */}

                <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3">

                    {productList &&
                        productList.length > 0 ? (

                        productList.map(
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
                        )

                    ) : (

                        <div className="col-span-full py-10 text-center">

                            <p className="text-muted-foreground">
                                No products found.
                            </p>

                        </div>

                    )}

                </div>

            </div>


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

export default ShoppingListing;