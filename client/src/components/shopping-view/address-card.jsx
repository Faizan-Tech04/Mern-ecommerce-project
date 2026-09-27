import {
    Card,
    CardContent,
    CardFooter,
} from "../ui/card";

import {
    Button,
} from "../ui/button";

// ==========================================
// Address Card
// ==========================================

function AddressCard({
    addressInfo,
    onSelect,
    onEdit,
    onDelete,
    isSelected = false,
}) {
    // ==========================================
    // Handle Select
    // ==========================================

    function handleSelect() {
        if (!addressInfo?._id) {
            return;
        }

        onSelect?.(addressInfo);
    }

    // ==========================================
    // Render
    // ==========================================

    return (
        <Card
            className={`flex h-full w-full min-w-0 max-w-full overflow-hidden transition-all ${isSelected
                ? "border-primary ring-2 ring-primary/20"
                : ""
                }`}
        >
            {/* ==========================================
                Address Information
            ========================================== */}

            <CardContent className="flex-1 space-y-4 p-5">

                {/* ==========================================
                    Selected Status
                ========================================== */}

                <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold">
                        Delivery Address
                    </p>

                    {isSelected && (
                        <span className="shrink-0 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                            Selected
                        </span>
                    )}
                </div>

                {/* ==========================================
                    Address
                ========================================== */}

                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Address:
                    </p>

                    <p className="mt-1 break-words text-sm font-medium">
                        {addressInfo?.address || "N/A"}
                    </p>
                </div>

                {/* ==========================================
                    City
                ========================================== */}

                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        City:
                    </p>

                    <p className="mt-1 break-words text-sm font-medium">
                        {addressInfo?.city || "N/A"}
                    </p>
                </div>

                {/* ==========================================
                    Pincode
                ========================================== */}

                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Pincode:
                    </p>

                    <p className="mt-1 text-sm font-medium">
                        {addressInfo?.pincode || "N/A"}
                    </p>
                </div>

                {/* ==========================================
                    Phone
                ========================================== */}

                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Phone:
                    </p>

                    <p className="mt-1 text-sm font-medium">
                        {addressInfo?.phone || "N/A"}
                    </p>
                </div>

                {/* ==========================================
                    Notes
                ========================================== */}

                {addressInfo?.notes && (
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Notes:
                        </p>

                        <p className="mt-1 break-words text-sm text-muted-foreground">
                            {addressInfo.notes}
                        </p>
                    </div>
                )}
            </CardContent>

            {/* ==========================================
                Actions
            ========================================== */}

            <CardFooter className="flex flex-wrap gap-2 border-t p-4">

                {/* ==========================================
                    Select Address
                ========================================== */}

                <Button
                    type="button"
                    variant={
                        isSelected
                            ? "default"
                            : "outline"
                    }
                    className="w-full"
                    onClick={handleSelect}
                    disabled={isSelected}
                >
                    {isSelected
                        ? "Selected Address"
                        : "Select Address"}
                </Button>

                {/* ==========================================
                    Edit
                ========================================== */}

                <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() =>
                        onEdit?.(addressInfo)
                    }
                >
                    Edit
                </Button>

                {/* ==========================================
                    Delete
                ========================================== */}

                <Button
                    type="button"
                    variant="destructive"
                    className="flex-1"
                    onClick={() =>
                        onDelete?.(
                            addressInfo?._id
                        )
                    }
                >
                    Delete
                </Button>

            </CardFooter>
        </Card>
    );
}

export default AddressCard;