import { useEffect, useState } from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    useSearchParams,
} from "react-router-dom";

import {
    searchProducts,
    clearSearchResults,
} from "@/store/shop/search-slice";

import ShoppingProductTile from "@/components/shopping-view/product-tile";

import {
    Loader2,
    Search,
    X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

// ==========================================
// Search Page
// ==========================================

function SearchPage() {
    const dispatch = useDispatch();

    const [
        searchParams,
        setSearchParams,
    ] = useSearchParams();

    // ==========================================
    // URL Keyword
    // ==========================================

    const keyword =
        searchParams.get("keyword")?.trim() || "";

    // ==========================================
    // Search Input State
    // ==========================================

    const [searchInput, setSearchInput] =
        useState(keyword);

    // ==========================================
    // Redux State
    // ==========================================

    const {
        searchResults,
        isLoading,
        error,
    } = useSelector(
        (state) => state.search
    );

    // ==========================================
    // Keep Input In Sync With URL
    // ==========================================

    useEffect(() => {
        setSearchInput(keyword);
    }, [keyword]);

    // ==========================================
    // Search Products
    // ==========================================

    useEffect(() => {
        if (!keyword) {
            dispatch(clearSearchResults());
            return;
        }

        dispatch(
            searchProducts(keyword)
        );
    }, [dispatch, keyword]);

    // ==========================================
    // Handle Search
    // ==========================================

    function handleSearch(event) {
        event.preventDefault();

        const trimmedKeyword =
            searchInput.trim();

        // Empty search
        if (!trimmedKeyword) {
            setSearchParams({});
            dispatch(clearSearchResults());
            return;
        }

        // Update URL
        setSearchParams({
            keyword: trimmedKeyword,
        });
    }

    // ==========================================
    // Clear Search
    // ==========================================

    function handleClearSearch() {
        setSearchInput("");

        setSearchParams({});

        dispatch(
            clearSearchResults()
        );
    }

    // ==========================================
    // Render
    // ==========================================

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">

                {/* ==========================================
                    Search Header
                ========================================== */}

                <div className="mb-8">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                            <Search className="h-5 w-5 text-primary" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold sm:text-3xl">
                                Search Products
                            </h1>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Search products by name,
                                brand, category or
                                keyword.
                            </p>
                        </div>

                    </div>

                </div>

                {/* ==========================================
                    Search Form
                ========================================== */}

                <form
                    onSubmit={handleSearch}
                    className="mx-auto mb-8 flex w-full max-w-3xl gap-2"
                >

                    {/* Search Input */}

                    <div className="relative min-w-0 flex-1">

                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                        <input
                            type="text"
                            value={searchInput}
                            onChange={(event) =>
                                setSearchInput(
                                    event.target.value
                                )
                            }
                            placeholder="Search products..."
                            className="
                                h-11
                                w-full
                                rounded-md
                                border
                                border-input
                                bg-background
                                pl-10
                                pr-10
                                text-sm
                                outline-none
                                transition
                                focus:border-primary
                                focus:ring-2
                                focus:ring-primary/20
                            "
                        />

                        {/* Clear Button */}

                        {searchInput && (
                            <button
                                type="button"
                                onClick={
                                    handleClearSearch
                                }
                                className="
                                    absolute
                                    right-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-muted-foreground
                                    transition
                                    hover:text-foreground
                                "
                                aria-label="Clear search"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}

                    </div>

                    {/* Search Button */}

                    <Button
                        type="submit"
                        className="h-11 shrink-0 px-5 sm:px-7"
                        disabled={
                            isLoading ||
                            !searchInput.trim()
                        }
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                                <span className="hidden sm:inline">
                                    Searching...
                                </span>

                                <span className="sm:hidden">
                                    Search
                                </span>
                            </>
                        ) : (
                            <>
                                <Search className="mr-2 h-4 w-4" />

                                Search
                            </>
                        )}
                    </Button>

                </form>

                {/* ==========================================
                    No Keyword
                ========================================== */}

                {!keyword && (
                    <div className="flex min-h-[350px] flex-col items-center justify-center text-center">

                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                            <Search className="h-8 w-8 text-muted-foreground" />
                        </div>

                        <h2 className="text-xl font-semibold">
                            Search for products
                        </h2>

                        <p className="mt-2 max-w-md text-sm text-muted-foreground">
                            Enter a product name,
                            brand, category or
                            keyword above to find
                            products.
                        </p>

                    </div>
                )}

                {/* ==========================================
                    Loading
                ========================================== */}

                {keyword && isLoading && (
                    <div className="flex min-h-[350px] flex-col items-center justify-center">

                        <Loader2 className="h-10 w-10 animate-spin text-primary" />

                        <p className="mt-4 text-sm text-muted-foreground">
                            Searching products...
                        </p>

                    </div>
                )}

                {/* ==========================================
                    Search Error
                ========================================== */}

                {keyword &&
                    !isLoading &&
                    error && (
                        <div className="flex min-h-[350px] flex-col items-center justify-center text-center">

                            <Search className="mb-4 h-12 w-12 text-destructive" />

                            <h2 className="text-xl font-semibold">
                                Search failed
                            </h2>

                            <p className="mt-2 text-sm text-muted-foreground">
                                {error}
                            </p>

                        </div>
                    )}

                {/* ==========================================
                    Search Results
                ========================================== */}

                {keyword &&
                    !isLoading &&
                    !error &&
                    searchResults?.length >
                    0 && (
                        <>

                            {/* Result Header */}

                            <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

                                <div>
                                    <h2 className="text-lg font-semibold">
                                        Search Results
                                    </h2>

                                    <p className="text-sm text-muted-foreground">
                                        Results for{" "}
                                        <span className="font-semibold text-foreground">
                                            "{keyword}"
                                        </span>
                                    </p>
                                </div>

                                <p className="text-sm text-muted-foreground">
                                    {
                                        searchResults.length
                                    }{" "}
                                    {searchResults.length ===
                                        1
                                        ? "product"
                                        : "products"}{" "}
                                    found
                                </p>

                            </div>

                            {/* Products Grid */}

                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">

                                {searchResults.map(
                                    (product) => (
                                        <ShoppingProductTile
                                            key={
                                                product._id
                                            }
                                            product={
                                                product
                                            }
                                        />
                                    )
                                )}

                            </div>

                        </>
                    )}

                {/* ==========================================
                    No Results
                ========================================== */}

                {keyword &&
                    !isLoading &&
                    !error &&
                    searchResults?.length ===
                    0 && (
                        <div className="flex min-h-[350px] flex-col items-center justify-center text-center">

                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                                <Search className="h-8 w-8 text-muted-foreground" />
                            </div>

                            <h2 className="text-xl font-semibold">
                                No products found
                            </h2>

                            <p className="mt-2 max-w-md text-sm text-muted-foreground">
                                We couldn't find any
                                products matching{" "}
                                <span className="font-semibold text-foreground">
                                    "{keyword}"
                                </span>
                                .
                            </p>

                            <Button
                                type="button"
                                variant="outline"
                                className="mt-5"
                                onClick={
                                    handleClearSearch
                                }
                            >
                                Clear Search
                            </Button>

                        </div>
                    )}

            </div>
        </div>
    );
}

export default SearchPage;