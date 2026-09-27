import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../ui/card";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";

import { Button } from "../ui/button";

import {
    Dialog,
    DialogTrigger,
} from "../ui/dialog";

import AdminOrderDetailsView from "./order-details";

import {
    getAllOrders,
} from "@/store/admin/order-slice";


// ==========================================
// Admin Orders View
// ==========================================

function AdminOrdersView() {

    const dispatch = useDispatch();


    // ==========================================
    // Redux - Admin Orders
    // ==========================================

    const {
        orderList = [],
        isLoading,
    } = useSelector(
        (state) => state.adminOrder
    );


    // ==========================================
    // Fetch All Orders
    // ==========================================

    useEffect(() => {

        dispatch(
            getAllOrders()
        );

    }, [dispatch]);


    // ==========================================
    // Format Date
    // ==========================================

    const formatDate = (date) => {

        if (!date) {
            return "N/A";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "N/A";
        }

        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "2-digit",
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
    // Loading State
    // ==========================================

    if (isLoading) {

        return (
            <Card className="w-full min-w-0">

                <CardHeader className="px-4 py-4 sm:px-6 sm:py-5">

                    <CardTitle className="text-lg font-bold sm:text-xl">
                        All Orders History
                    </CardTitle>

                </CardHeader>

                <CardContent className="px-4 pb-5 sm:px-6 sm:pb-6">

                    <div className="flex min-h-32 items-center justify-center rounded-lg border">

                        <div className="flex flex-col items-center gap-3">

                            <div className="h-7 w-7 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

                            <span className="text-sm text-muted-foreground">
                                Loading orders...
                            </span>

                        </div>

                    </div>

                </CardContent>

            </Card>
        );
    }


    // ==========================================
    // Render
    // ==========================================

    return (
        <Card className="w-full min-w-0">


            {/* ==========================================
                Header
            ========================================== */}

            <CardHeader className="px-4 py-4 sm:px-6 sm:py-5">

                <CardTitle className="text-lg font-bold sm:text-xl">
                    All Orders History
                </CardTitle>

            </CardHeader>


            {/* ==========================================
                Content
            ========================================== */}

            <CardContent className="px-4 pb-5 sm:px-6 sm:pb-6">


                {/* ==========================================
                    Empty Orders
                ========================================== */}

                {orderList.length === 0 ? (

                    <div className="flex min-h-32 items-center justify-center rounded-lg border border-dashed">

                        <span className="text-sm text-muted-foreground">
                            No orders found.
                        </span>

                    </div>

                ) : (

                    <>


                        {/* =================================================
                            DESKTOP ORDERS TABLE
                        ================================================= */}

                        <div className="hidden w-full overflow-x-auto lg:block">

                            <Table className="w-full">

                                <TableHeader>

                                    <TableRow>

                                        <TableHead className="whitespace-nowrap">
                                            Order ID
                                        </TableHead>

                                        <TableHead className="whitespace-nowrap">
                                            Order Date
                                        </TableHead>

                                        <TableHead className="whitespace-nowrap">
                                            Payment
                                        </TableHead>

                                        <TableHead className="whitespace-nowrap">
                                            Order Status
                                        </TableHead>

                                        <TableHead className="whitespace-nowrap">
                                            Order Price
                                        </TableHead>

                                        <TableHead className="whitespace-nowrap text-right">
                                            Details
                                        </TableHead>

                                    </TableRow>

                                </TableHeader>


                                <TableBody>

                                    {orderList.map(
                                        (order) => (

                                            <TableRow
                                                key={order._id}
                                            >

                                                {/* Order ID */}

                                                <TableCell className="max-w-[180px] truncate font-medium">
                                                    #{order._id}
                                                </TableCell>


                                                {/* Order Date */}

                                                <TableCell className="whitespace-nowrap">
                                                    {formatDate(
                                                        order.createdAt
                                                    )}
                                                </TableCell>


                                                {/* Payment Status */}

                                                <TableCell className="whitespace-nowrap">

                                                    <span
                                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getPaymentStatusClass(
                                                            order.paymentStatus
                                                        )}`}
                                                    >
                                                        {formatPaymentStatus(
                                                            order.paymentStatus
                                                        )}
                                                    </span>

                                                </TableCell>


                                                {/* Order Status */}

                                                <TableCell className="whitespace-nowrap">

                                                    <span
                                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getOrderStatusClass(
                                                            order.orderStatus
                                                        )}`}
                                                    >
                                                        {formatOrderStatus(
                                                            order.orderStatus
                                                        )}
                                                    </span>

                                                </TableCell>


                                                {/* Order Price */}

                                                <TableCell className="whitespace-nowrap font-medium">
                                                    ₹
                                                    {Number(
                                                        order.totalAmount || 0
                                                    ).toFixed(2)}
                                                </TableCell>


                                                {/* Details */}

                                                <TableCell className="whitespace-nowrap text-right">

                                                    <Dialog>

                                                        <DialogTrigger
                                                            asChild
                                                        >

                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                className="bg-black text-white hover:bg-black/80"
                                                            >
                                                                View Details
                                                            </Button>

                                                        </DialogTrigger>


                                                        <AdminOrderDetailsView
                                                            order={order}
                                                        />

                                                    </Dialog>

                                                </TableCell>

                                            </TableRow>

                                        )
                                    )}

                                </TableBody>

                            </Table>

                        </div>


                        {/* =================================================
                            MOBILE + TABLET ORDER CARDS
                        ================================================= */}

                        <div className="grid grid-cols-1 gap-4 lg:hidden">

                            {orderList.map(
                                (order) => (

                                    <div
                                        key={order._id}
                                        className="w-full min-w-0 rounded-xl border bg-background p-4 shadow-sm sm:p-5"
                                    >

                                        {/* Order Header */}

                                        <div className="flex items-start justify-between gap-3 border-b pb-4">

                                            <div className="min-w-0">

                                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                    Order ID
                                                </p>

                                                <p className="mt-1 truncate text-sm font-bold sm:text-base">
                                                    #{order._id}
                                                </p>

                                            </div>


                                            {/* Payment Status */}

                                            <span
                                                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${getPaymentStatusClass(
                                                    order.paymentStatus
                                                )}`}
                                            >
                                                {formatPaymentStatus(
                                                    order.paymentStatus
                                                )}
                                            </span>

                                        </div>


                                        {/* Order Information */}

                                        <div className="space-y-4 py-4">

                                            {/* Order Date */}

                                            <div className="flex items-center justify-between gap-4">

                                                <span className="text-sm text-muted-foreground">
                                                    Order Date
                                                </span>

                                                <span className="text-right text-sm font-medium">
                                                    {formatDate(
                                                        order.createdAt
                                                    )}
                                                </span>

                                            </div>


                                            {/* Payment */}

                                            <div className="flex items-center justify-between gap-4">

                                                <span className="text-sm text-muted-foreground">
                                                    Payment
                                                </span>

                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-medium ${getPaymentStatusClass(
                                                        order.paymentStatus
                                                    )}`}
                                                >
                                                    {formatPaymentStatus(
                                                        order.paymentStatus
                                                    )}
                                                </span>

                                            </div>


                                            {/* Order Status */}

                                            <div className="flex items-center justify-between gap-4">

                                                <span className="text-sm text-muted-foreground">
                                                    Order Status
                                                </span>

                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-medium ${getOrderStatusClass(
                                                        order.orderStatus
                                                    )}`}
                                                >
                                                    {formatOrderStatus(
                                                        order.orderStatus
                                                    )}
                                                </span>

                                            </div>


                                            {/* Order Price */}

                                            <div className="flex items-center justify-between gap-4">

                                                <span className="text-sm text-muted-foreground">
                                                    Order Price
                                                </span>

                                                <span className="text-right text-base font-bold">
                                                    ₹
                                                    {Number(
                                                        order.totalAmount || 0
                                                    ).toFixed(2)}
                                                </span>

                                            </div>

                                        </div>


                                        {/* Details */}

                                        <div className="border-t pt-4">

                                            <Dialog>

                                                <DialogTrigger
                                                    asChild
                                                >

                                                    <Button
                                                        type="button"
                                                        className="w-full bg-black text-white hover:bg-black/80"
                                                    >
                                                        View Details
                                                    </Button>

                                                </DialogTrigger>


                                                <AdminOrderDetailsView
                                                    order={order}
                                                />

                                            </Dialog>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    </>

                )}

            </CardContent>

        </Card>
    );
}


export default AdminOrdersView;