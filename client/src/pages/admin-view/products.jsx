import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "../../components/ui/button";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

import { addProductFormElements } from "@/config";

import CommonForm from "@/components/common/form";

import ProductImageUpload from "@/components/admin-view/image-upload";

import AdminProductTile from "@/components/admin-view/product-tile";

import {
    addNewProduct,
    fetchAllProduct,
    editProduct,
    deleteProduct,
} from "@/store/admin/product-slice";

import { toast } from "sonner";

// ==========================================
// Initial Form Data
// ==========================================

const initialFormData = {
    image: "",
    title: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    salePrice: "",
    totalStock: "",
};

// ==========================================
// Admin Products
// ==========================================

function AdminProducts() {
    const [openCreateProductsDialog, setOpenCreateProductsDialog] =
        useState(false);

    const [formData, setFormData] = useState(initialFormData);

    const [imageFile, setImageFile] = useState(null);

    const [uploadedImageUrl, setUploadedImageUrl] = useState("");

    const [imageLoadingState, setImageLoadingState] = useState(false);

    const [currentEditedId, setCurrentEditedId] = useState(null);

    const dispatch = useDispatch();

    const { productList, isLoading } = useSelector(
        (state) => state.adminProducts
    );

    // ==========================================
    // Handle Sheet Open / Close
    // ==========================================

    function handleOpenChange(isOpen) {
        setOpenCreateProductsDialog(isOpen);

        if (!isOpen) {
            setFormData(initialFormData);
            setImageFile(null);
            setUploadedImageUrl("");
            setImageLoadingState(false);
            setCurrentEditedId(null);
        }
    }

    // ==========================================
    // Delete Product
    // ==========================================

    function handleDelete(productId) {
        if (!productId) {
            toast.error("Product ID not found.");
            return;
        }

        dispatch(deleteProduct(productId))
            .unwrap()
            .then((data) => {
                console.log("Product Deleted:", data);

                if (data?.success) {
                    toast.success(
                        "Product deleted successfully."
                    );
                }
            })
            .catch((error) => {
                console.error(
                    "Delete Product Error:",
                    error
                );

                toast.error(
                    error?.message ||
                    "Failed to delete product."
                );
            });
    }

    // ==========================================
    // Form Validation
    // ==========================================

    function isFormValid() {
        const requiredFields = [
            "title",
            "description",
            "category",
            "brand",
            "price",
            "totalStock",
        ];

        return requiredFields.every(
            (key) =>
                formData[key] !== undefined &&
                formData[key] !== null &&
                String(formData[key]).trim() !== ""
        );
    }

    // ==========================================
    // Add / Edit Product
    // ==========================================

    function onSubmit(event) {
        event.preventDefault();

        // Image upload hone tak submit mat karo
        if (imageLoadingState) {
            toast.error(
                "Please wait, image is still uploading."
            );
            return;
        }

        // Add mode mein image required
        if (
            currentEditedId === null &&
            !uploadedImageUrl
        ) {
            toast.error(
                "Please upload product image first."
            );
            return;
        }

        // Form validation
        if (!isFormValid()) {
            toast.error(
                "Please fill all required fields."
            );
            return;
        }

        // ==========================================
        // Product Data
        // ==========================================

        const productData = {
            ...formData,
            image:
                uploadedImageUrl ||
                formData.image,
            price: Number(formData.price),
            salePrice: Number(
                formData.salePrice || 0
            ),
            totalStock: Number(
                formData.totalStock
            ),
        };

        console.log(
            "Product Data:",
            productData
        );

        // ==========================================
        // Edit Product
        // ==========================================

        if (currentEditedId !== null) {
            dispatch(
                editProduct({
                    id: currentEditedId,
                    formData: productData,
                })
            )
                .unwrap()
                .then((data) => {
                    console.log(
                        "Product Updated:",
                        data
                    );

                    if (data?.success) {
                        toast.success(
                            "Product updated successfully."
                        );

                        handleOpenChange(false);
                    }
                })
                .catch((error) => {
                    console.error(
                        "Edit Product Error:",
                        error
                    );

                    toast.error(
                        error?.message ||
                        "Failed to update product."
                    );
                });

            return;
        }

        // ==========================================
        // Add Product
        // ==========================================

        dispatch(addNewProduct(productData))
            .unwrap()
            .then((data) => {
                console.log(
                    "Product Added:",
                    data
                );

                if (data?.success) {
                    toast.success(
                        "Product added successfully."
                    );

                    handleOpenChange(false);
                }
            })
            .catch((error) => {
                console.error(
                    "Add Product Error:",
                    error
                );

                toast.error(
                    error?.message ||
                    "Failed to add product."
                );
            });
    }

    // ==========================================
    // Fetch All Products
    // ==========================================

    useEffect(() => {
        dispatch(fetchAllProduct());
    }, [dispatch]);

    // ==========================================
    // JSX
    // ==========================================

    return (
        <Fragment>

            {/* ==========================================
                Add New Product Button
            ========================================== */}

            <div className="mb-5 flex w-full justify-end">
                <Button
                    type="button"
                    onClick={() => {
                        setCurrentEditedId(null);
                        setFormData(initialFormData);
                        setImageFile(null);
                        setUploadedImageUrl("");
                        setImageLoadingState(false);
                        setOpenCreateProductsDialog(true);
                    }}
                >
                    Add New Product
                </Button>
            </div>

            {/* ==========================================
                Products Grid
            ========================================== */}

            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">

                {productList && productList.length > 0 ? (
                    productList.map((product) => (
                        <AdminProductTile
                            key={product._id}
                            product={product}
                            setFormData={setFormData}
                            setOpenCreateProductsDialog={
                                setOpenCreateProductsDialog
                            }
                            setCurrentEditedId={
                                setCurrentEditedId
                            }
                            handleDelete={handleDelete}
                        />
                    ))
                ) : (
                    <div className="col-span-full py-10 text-center">
                        <p className="text-gray-500">
                            No products found.
                        </p>
                    </div>
                )}

            </div>

            {/* ==========================================
                Add / Edit Product Sheet
            ========================================== */}

            <Sheet
                open={openCreateProductsDialog}
                onOpenChange={handleOpenChange}
            >
                <SheetContent
                    side="right"
                    className="w-full gap-0 overflow-y-auto p-4 sm:max-w-md"
                >

                    {/* Sheet Header */}

                    <SheetHeader className="mb-0">
                        <SheetTitle>
                            {currentEditedId !== null
                                ? "Edit Product"
                                : "Add New Product"}
                        </SheetTitle>
                    </SheetHeader>

                    {/* Product Image Upload */}

                    <ProductImageUpload
                        imageFile={imageFile}
                        setImageFile={setImageFile}
                        uploadedImageUrl={uploadedImageUrl}
                        setUploadedImageUrl={
                            setUploadedImageUrl
                        }
                        setImageLoadingState={
                            setImageLoadingState
                        }
                        imageLoadingState={
                            imageLoadingState
                        }
                        isEditMode={
                            currentEditedId !== null
                        }
                    />

                    {/* Product Form */}

                    <div className="mt-6 w-full">
                        <CommonForm
                            onSubmit={onSubmit}
                            formData={formData}
                            setFormData={setFormData}
                            buttonText={
                                isLoading
                                    ? currentEditedId !== null
                                        ? "Updating..."
                                        : "Adding..."
                                    : currentEditedId !== null
                                        ? "Update"
                                        : "Add"
                            }
                            formControls={
                                addProductFormElements
                            }
                            isBtnDisabled={
                                isLoading ||
                                !isFormValid() ||
                                imageLoadingState
                            }
                        />
                    </div>

                </SheetContent>
            </Sheet>

        </Fragment>
    );
}

export default AdminProducts;