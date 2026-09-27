import {
    Link,
    useNavigate,
} from "react-router-dom";

import {
    HousePlug,
    Menu,
    ShoppingCart,
    CircleUser,
    LogOut,
    Search,
} from "lucide-react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import { useState } from "react";

import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "../ui/sheet";

import { Button } from "../ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import {
    Avatar,
    AvatarFallback,
} from "../ui/avatar";

import {
    shoppingViewHeaderMenuItems,
} from "@/config";

import {
    logoutUser,
} from "../../store/auth-slice";

import { toast } from "sonner";

import UserCartWrapper from "./cart-wrapper";

// ==========================================
// Menu Items
// ==========================================

function MenuItems({
    searchKeyword,
    setSearchKeyword,
}) {
    const navigate = useNavigate();

    // ==========================================
    // Handle Menu Click
    // ==========================================

    function handleMenuClick(menuItem) {
        const label =
            menuItem.label?.toLowerCase();

        // --------------------------------------
        // Search
        // --------------------------------------

        if (label === "search") {
            navigate("/shop/search");

            return;
        }

        // --------------------------------------
        // Home
        // --------------------------------------

        if (label === "home") {
            navigate("/shop/home");

            return;
        }

        // --------------------------------------
        // All Products
        // --------------------------------------

        if (
            label === "all products" ||
            label === "products"
        ) {
            navigate("/shop/listing");

            return;
        }

        // --------------------------------------
        // Category
        // --------------------------------------

        const categoryMap = {
            men: "men",
            women: "women",
            kids: "kids",
            accessories: "accessories",
            footwear: "footwear",
        };

        if (categoryMap[label]) {
            navigate(
                `/shop/listing?category=${encodeURIComponent(
                    categoryMap[label],
                )}`,
            );

            return;
        }

        // --------------------------------------
        // Fallback
        // --------------------------------------

        if (menuItem.path) {
            navigate(menuItem.path);
        }
    }

    return (
        <nav
            className="
        flex
        min-w-0
        flex-col
        gap-5
        lg:flex-row
        lg:items-center
        lg:gap-6
      "
        >
            {shoppingViewHeaderMenuItems.map(
                (menuItem) => {
                    const isSearch =
                        menuItem.label?.toLowerCase() ===
                        "search";

                    return (
                        <div
                            key={menuItem.id}
                            className="shrink-0"
                        >
                            {isSearch ? (
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleMenuClick(
                                            menuItem,
                                        )
                                    }
                                    className="
                    flex
                    w-fit
                    max-w-full
                    cursor-pointer
                    items-center
                    gap-1.5
                    whitespace-nowrap
                    border-0
                    bg-transparent
                    p-0
                    text-left
                    text-sm
                    font-medium
                    transition-colors
                    hover:text-primary
                  "
                                >
                                    <Search className="h-4 w-4" />

                                    <span>
                                        Search
                                    </span>
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleMenuClick(
                                            menuItem,
                                        )
                                    }
                                    className="
                    w-fit
                    max-w-full
                    cursor-pointer
                    whitespace-nowrap
                    border-0
                    bg-transparent
                    p-0
                    text-left
                    text-sm
                    font-medium
                    transition-colors
                    hover:text-primary
                  "
                                >
                                    {menuItem.label}
                                </button>
                            )}
                        </div>
                    );
                },
            )}
        </nav>
    );
}

// ==========================================
// Header Right Content
// ==========================================

function HeaderRightContent({
    user,
}) {
    const [
        openCartSheet,
        setOpenCartSheet,
    ] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // ==========================================
    // Cart State
    // ==========================================

    const { cartItems } = useSelector(
        (state) => state.shopCart,
    );

    // ==========================================
    // Total Cart Quantity
    // ==========================================

    const cartCount =
        cartItems?.reduce(
            (total, item) =>
                total +
                Number(item.quantity || 0),
            0,
        ) || 0;

    // ==========================================
    // Logout
    // ==========================================

    function handleLogout() {
        dispatch(logoutUser())
            .unwrap()
            .then((data) => {
                if (data?.success) {
                    toast.success(
                        data.message ||
                        "Logged out successfully.",
                    );

                    navigate("/auth/login");
                }
            })
            .catch((error) => {
                console.error(
                    "Logout Error:",
                    error,
                );

                toast.error(
                    error?.message ||
                    "Logout failed.",
                );
            });
    }

    return (
        <div
            className="
        flex
        shrink-0
        items-center
        gap-2
        sm:gap-3
      "
        >
            {/* ==========================================
          Shopping Cart
      ========================================== */}

            <Sheet
                open={openCartSheet}
                onOpenChange={
                    setOpenCartSheet
                }
            >
                <SheetTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="
              relative
              h-9
              w-9
              shrink-0
              sm:h-10
              sm:w-10
            "
                    >
                        <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />

                        {/* Cart Count Badge */}

                        {cartCount > 0 && (
                            <span
                                className="
                  absolute
                  -right-1
                  -top-1
                  flex
                  min-h-5
                  min-w-5
                  items-center
                  justify-center
                  rounded-full
                  bg-primary
                  px-1
                  text-[10px]
                  font-bold
                  leading-none
                  text-primary-foreground
                  ring-2
                  ring-background
                "
                            >
                                {cartCount > 99
                                    ? "99+"
                                    : cartCount}
                            </span>
                        )}

                        <span className="sr-only">
                            User Cart
                        </span>
                    </Button>
                </SheetTrigger>

                <SheetContent
                    side="right"
                    className="
            w-[90vw]
            max-w-[400px]
            overflow-y-auto
            p-4
            sm:w-full
            sm:max-w-md
            sm:p-6
          "
                >
                    <UserCartWrapper />
                </SheetContent>
            </Sheet>

            {/* ==========================================
          User Dropdown
      ========================================== */}

            <DropdownMenu>
                <DropdownMenuTrigger
                    asChild
                >
                    <Button
                        variant="ghost"
                        className="
              relative
              h-9
              w-9
              shrink-0
              rounded-full
              p-0
              sm:h-10
              sm:w-10
            "
                    >
                        <Avatar className="h-9 w-9 sm:h-10 sm:w-10">
                            <AvatarFallback className="bg-black font-bold text-white">
                                {user?.userName?.[0]?.toUpperCase() ||
                                    "A"}
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="w-[calc(100vw-2rem)] max-w-56"
                >
                    <DropdownMenuLabel>
                        <div className="flex min-w-0 flex-col gap-1">
                            <span className="break-words text-sm font-semibold">
                                Logged in as{" "}
                                {user?.userName ||
                                    "User"}
                            </span>

                            <span className="break-all text-xs font-normal text-muted-foreground">
                                {user?.email || ""}
                            </span>
                        </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    {/* Account */}

                    <DropdownMenuItem
                        onClick={() =>
                            navigate(
                                "/shop/account",
                            )
                        }
                        className="cursor-pointer"
                    >
                        <CircleUser className="mr-2 h-4 w-4 shrink-0" />

                        <span>
                            Account
                        </span>
                    </DropdownMenuItem>

                    {/* Logout */}

                    <DropdownMenuItem
                        onClick={
                            handleLogout
                        }
                        className="cursor-pointer"
                    >
                        <LogOut className="mr-2 h-4 w-4 shrink-0" />

                        <span>
                            Logout
                        </span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

// ==========================================
// Shopping Header
// ==========================================

function ShoppingHeader() {
    const {
        isAuthenticated,
        user,
    } = useSelector(
        (state) => state.auth,
    );

    // ==========================================
    // Search State
    // ==========================================

    const [
        searchKeyword,
        setSearchKeyword,
    ] = useState("");

    return (
        <header
            className="
        sticky
        top-0
        z-50
        w-full
        min-w-0
        max-w-full
        overflow-x-hidden
        border-b
        bg-background
      "
        >
            <div
                className="
          mx-auto
          flex
          h-16
          w-full
          min-w-0
          max-w-full
          items-center
          justify-between
          gap-3
          px-3
          sm:px-4
          md:px-6
          lg:gap-6
        "
            >
                {/* ==========================================
            Logo
        ========================================== */}

                <Link
                    to="/shop/home"
                    className="
            flex
            min-w-0
            shrink
            items-center
            gap-2
          "
                >
                    <HousePlug className="h-6 w-6 shrink-0" />

                    <span className="truncate font-bold">
                        Ecommerce
                    </span>
                </Link>

                {/* ==========================================
            Desktop Navigation
        ========================================== */}

                <div
                    className="
            hidden
            min-w-0
            flex-1
            justify-center
            overflow-hidden
            lg:flex
          "
                >
                    <MenuItems
                        searchKeyword={
                            searchKeyword
                        }
                        setSearchKeyword={
                            setSearchKeyword
                        }
                    />
                </div>

                {/* ==========================================
            Mobile Menu
        ========================================== */}

                <div className="shrink-0 lg:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="
                  h-9
                  w-9
                  shrink-0
                  sm:h-10
                  sm:w-10
                "
                            >
                                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />

                                <span className="sr-only">
                                    Toggle header menu
                                </span>
                            </Button>
                        </SheetTrigger>

                        <SheetContent
                            side="left"
                            className="
                flex
                w-[85vw]
                max-w-xs
                flex-col
                overflow-y-auto
                p-6
              "
                        >
                            <MenuItems
                                searchKeyword={
                                    searchKeyword
                                }
                                setSearchKeyword={
                                    setSearchKeyword
                                }
                            />

                            {/* Mobile Authentication */}

                            {isAuthenticated && (
                                <div className="mt-8 border-t pt-6">
                                    <HeaderRightContent
                                        user={user}
                                    />
                                </div>
                            )}
                        </SheetContent>
                    </Sheet>
                </div>

                {/* ==========================================
            Desktop Authentication
        ========================================== */}

                {isAuthenticated && (
                    <div
                        className="
              hidden
              shrink-0
              lg:block
            "
                    >
                        <HeaderRightContent
                            user={user}
                        />
                    </div>
                )}
            </div>
        </header>
    );
}

export default ShoppingHeader;