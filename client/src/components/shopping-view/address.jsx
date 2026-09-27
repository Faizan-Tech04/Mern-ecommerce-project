import { useEffect, useState } from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import CommonForm from "../common/form";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../ui/card";

import {
    addressFormControls,
} from "@/config";

import {
    addAddress,
    fetchAllAddresses,
    editAddress,
    deleteAddress,
} from "@/store/shop/address-slice";

import AddressCard from "./address-card";

import { toast } from "sonner";

// ==========================================
// Initial Address Form Data
// ==========================================

const initialAddressFormData = {
    address: "",
    city: "",
    phone: "",
    pincode: "",
    notes: "",
};

// ==========================================
// Maximum Address Limit
// ==========================================

const MAX_ADDRESSES = 3;

// ==========================================
// Address Component
// ==========================================

function Address({
    setCurrentSelectedAddress,
}) {
    const dispatch = useDispatch();

    // ==========================================
    // Redux State
    // ==========================================

    const {
        isLoading,
        addressList,
    } = useSelector(
        (state) => state.address
    );

    // ==========================================
    // Form State
    // ==========================================

    const [
        formData,
        setFormData,
    ] = useState(
        initialAddressFormData
    );

    // ==========================================
    // Edit Address State
    // ==========================================

    const [
        currentEditedId,
        setCurrentEditedId,
    ] = useState(null);

    // ==========================================
    // Selected Address State
    // ==========================================

    const [
        selectedAddressId,
        setSelectedAddressId,
    ] = useState(null);

    // ==========================================
    // Fetch Addresses
    // ==========================================

    useEffect(() => {
        dispatch(
            fetchAllAddresses()
        );
    }, [dispatch]);

    // ==========================================
    // Automatically Select First Address
    // ==========================================

    useEffect(() => {
        if (
            addressList?.length > 0 &&
            !selectedAddressId
        ) {
            const firstAddress =
                addressList[0];

            setSelectedAddressId(
                firstAddress._id
            );

            if (
                typeof setCurrentSelectedAddress ===
                "function"
            ) {
                setCurrentSelectedAddress(
                    firstAddress
                );
            }
        }
    }, [
        addressList,
        selectedAddressId,
        setCurrentSelectedAddress,
    ]);

    // ==========================================
    // Select Address
    // ==========================================

    function handleSelectAddress(
        addressInfo
    ) {
        if (!addressInfo?._id) {
            toast.error(
                "Address information not found."
            );

            return;
        }

        setSelectedAddressId(
            addressInfo._id
        );

        if (
            typeof setCurrentSelectedAddress ===
            "function"
        ) {
            setCurrentSelectedAddress(
                addressInfo
            );
        }

        toast.success(
            "Delivery address selected."
        );
    }

    // ==========================================
    // Form Validation
    // ==========================================

    function isFormValid() {
        const requiredFields = [
            "address",
            "city",
            "phone",
            "pincode",
        ];

        return requiredFields.every(
            (field) =>
                formData[field]?.trim()
        );
    }

    // ==========================================
    // Handle Add / Update Address
    // ==========================================

    function handleManageAddress(
        event
    ) {
        event.preventDefault();

        // ========================================
        // Validate Form
        // ========================================

        if (!isFormValid()) {
            toast.error(
                "Please fill all required fields."
            );

            return;
        }

        // ========================================
        // Maximum Address Check
        // ========================================

        if (
            !currentEditedId &&
            addressList?.length >=
            MAX_ADDRESSES
        ) {
            toast.error(
                "You can add max 3 addresses."
            );

            return;
        }

        // ========================================
        // EDIT ADDRESS
        // ========================================

        if (currentEditedId) {
            dispatch(
                editAddress({
                    addressId:
                        currentEditedId,
                    formData:
                        formData,
                })
            )
                .unwrap()
                .then((data) => {
                    console.log(
                        "Edit Address Response:",
                        data
                    );

                    if (data?.success) {
                        toast.success(
                            data.message ||
                            "Address updated successfully."
                        );

                        const updatedAddress =
                            data?.data;

                        // --------------------------------
                        // Update Selected Address
                        // --------------------------------

                        if (
                            updatedAddress?._id ===
                            selectedAddressId
                        ) {
                            setCurrentSelectedAddress?.(
                                updatedAddress
                            );
                        }

                        // --------------------------------
                        // Reset Form
                        // --------------------------------

                        setFormData(
                            initialAddressFormData
                        );

                        // --------------------------------
                        // Exit Edit Mode
                        // --------------------------------

                        setCurrentEditedId(
                            null
                        );
                    }
                })
                .catch((error) => {
                    console.error(
                        "Edit Address Error:",
                        error
                    );

                    toast.error(
                        error?.message ||
                        "Failed to update address."
                    );
                });

            return;
        }

        // ========================================
        // ADD ADDRESS
        // ========================================

        dispatch(
            addAddress(formData)
        )
            .unwrap()
            .then((data) => {
                console.log(
                    "Add Address Response:",
                    data
                );

                if (data?.success) {
                    toast.success(
                        data.message ||
                        "Address added successfully."
                    );

                    const newAddress =
                        data?.data;

                    // --------------------------------
                    // Automatically Select New Address
                    // --------------------------------

                    if (newAddress?._id) {
                        setSelectedAddressId(
                            newAddress._id
                        );

                        setCurrentSelectedAddress?.(
                            newAddress
                        );
                    }

                    // --------------------------------
                    // Reset Form
                    // --------------------------------

                    setFormData(
                        initialAddressFormData
                    );
                }
            })
            .catch((error) => {
                console.error(
                    "Add Address Error:",
                    error
                );

                toast.error(
                    error?.message ||
                    "Failed to add address."
                );
            });
    }

    // ==========================================
    // Handle Edit Address
    // ==========================================

    function handleEditAddress(
        addressInfo
    ) {
        if (!addressInfo?._id) {
            toast.error(
                "Address information not found."
            );

            return;
        }

        setCurrentEditedId(
            addressInfo._id
        );

        setFormData({
            address:
                addressInfo.address || "",

            city:
                addressInfo.city || "",

            phone:
                addressInfo.phone || "",

            pincode:
                addressInfo.pincode || "",

            notes:
                addressInfo.notes || "",
        });

        // ----------------------------------------
        // Scroll To Form
        // ----------------------------------------

        setTimeout(() => {
            window.scrollTo({
                top:
                    document.body.scrollHeight,
                behavior:
                    "smooth",
            });
        }, 100);
    }

    // ==========================================
    // Handle Delete Address
    // ==========================================

    function handleDeleteAddress(
        addressId
    ) {
        if (!addressId) {
            toast.error(
                "Address ID not found."
            );

            return;
        }

        dispatch(
            deleteAddress(addressId)
        )
            .unwrap()
            .then((data) => {
                console.log(
                    "Delete Address Response:",
                    data
                );

                if (data?.success) {
                    toast.success(
                        data.message ||
                        "Address deleted successfully."
                    );

                    // --------------------------------
                    // If Deleted Address Was Selected
                    // --------------------------------

                    if (
                        selectedAddressId ===
                        addressId
                    ) {
                        const remainingAddresses =
                            (
                                addressList || []
                            ).filter(
                                (address) =>
                                    address._id !==
                                    addressId
                            );

                        const nextAddress =
                            remainingAddresses[0];

                        if (nextAddress) {
                            setSelectedAddressId(
                                nextAddress._id
                            );

                            setCurrentSelectedAddress?.(
                                nextAddress
                            );
                        } else {
                            setSelectedAddressId(
                                null
                            );

                            setCurrentSelectedAddress?.(
                                null
                            );
                        }
                    }

                    // --------------------------------
                    // If Deleted Address Was Being Edited
                    // --------------------------------

                    if (
                        currentEditedId ===
                        addressId
                    ) {
                        setCurrentEditedId(
                            null
                        );

                        setFormData(
                            initialAddressFormData
                        );
                    }
                }
            })
            .catch((error) => {
                console.error(
                    "Delete Address Error:",
                    error
                );

                toast.error(
                    error?.message ||
                    "Failed to delete address."
                );
            });
    }

    // ==========================================
    // Cancel Edit
    // ==========================================

    function handleCancelEdit() {
        setCurrentEditedId(
            null
        );

        setFormData(
            initialAddressFormData
        );
    }

    // ==========================================
    // UI
    // ==========================================

    return (
        <Card className="w-full">

            {/* ==========================================
                Address List Header
            ========================================== */}

            <CardHeader>
                <CardTitle className="text-xl font-bold">
                    Address List
                </CardTitle>
            </CardHeader>

            {/* ==========================================
                Address Content
            ========================================== */}

            <CardContent className="space-y-8">

                {/* ==========================================
                    Saved Addresses
                ========================================== */}

                <div>
                    {isLoading &&
                        !addressList?.length ? (
                        <div className="flex min-h-24 items-center justify-center">
                            <p className="text-sm text-muted-foreground">
                                Loading addresses...
                            </p>
                        </div>
                    ) : addressList?.length > 0 ? (
                        <div
                            className="
        grid
        w-full
        min-w-0
        max-w-full
        grid-cols-1
        gap-4
        sm:grid-cols-2
        md:grid-cols-2
        xl:grid-cols-3
    "
                        >

                            {addressList.map(
                                (
                                    singleAddressItem
                                ) => (
                                    <AddressCard
                                        key={
                                            singleAddressItem._id
                                        }

                                        addressInfo={
                                            singleAddressItem
                                        }

                                        onSelect={
                                            handleSelectAddress
                                        }

                                        onEdit={
                                            handleEditAddress
                                        }

                                        onDelete={
                                            handleDeleteAddress
                                        }

                                        isSelected={
                                            selectedAddressId ===
                                            singleAddressItem?._id
                                        }
                                    />
                                )
                            )}

                        </div>
                    ) : (
                        <div className="rounded-lg border border-dashed p-6 text-center">
                            <p className="text-sm text-muted-foreground">
                                No saved addresses yet.
                            </p>
                        </div>
                    )}
                </div>

                {/* ==========================================
                    Address Limit Information
                ========================================== */}

                {!currentEditedId &&
                    addressList?.length >=
                    MAX_ADDRESSES && (
                        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">

                            <p className="text-sm font-medium text-destructive">
                                You can add a maximum of 3 addresses.
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                                Delete an existing address if you want to add a new one.
                            </p>

                        </div>
                    )}

                {/* ==========================================
                    Add / Edit Address
                ========================================== */}

                <div className="border-t pt-6">

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                            <h3 className="text-lg font-semibold">
                                {currentEditedId
                                    ? "Edit Address"
                                    : "Add New Address"}
                            </h3>

                            <p className="mt-1 text-sm text-muted-foreground">
                                {currentEditedId
                                    ? "Update your delivery address details."
                                    : "Add your delivery address for a faster checkout."}
                            </p>
                        </div>

                        {/* Cancel Edit */}

                        {currentEditedId && (
                            <button
                                type="button"
                                onClick={
                                    handleCancelEdit
                                }
                                className="text-sm font-medium text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
                            >
                                Cancel Edit
                            </button>
                        )}

                    </div>
                </div>

                {/* ==========================================
                    Address Form
                ========================================== */}

                <CommonForm
                    formControls={
                        addressFormControls
                    }

                    formData={
                        formData
                    }

                    setFormData={
                        setFormData
                    }

                    buttonText={
                        isLoading
                            ? currentEditedId
                                ? "Updating..."
                                : "Adding..."
                            : currentEditedId
                                ? "Update"
                                : "Add"
                    }

                    onSubmit={
                        handleManageAddress
                    }

                    isBtnDisabled={
                        !isFormValid() ||
                        isLoading
                    }
                />

            </CardContent>
        </Card>
    );
}

export default Address;