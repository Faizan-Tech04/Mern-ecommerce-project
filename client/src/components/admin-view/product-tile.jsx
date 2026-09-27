import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";

function AdminProductTile({
    product,
    setFormData,
    setOpenCreateProductsDialog,
    setCurrentEditedId,
    handleDelete,
}) {
    // ==========================================
    // Edit Product
    // ==========================================

    function handleEdit() {
        setFormData({
            image: product?.image || "",
            title: product?.title || "",
            description: product?.description || "",
            category: product?.category || "",
            brand: product?.brand || "",
            price: product?.price || "",
            salePrice: product?.salePrice || "",
            totalStock: product?.totalStock || "",
        });

        setCurrentEditedId(product?._id);
        setOpenCreateProductsDialog(true);
    }

    return (
        <Card className="mx-auto flex h-full w-full max-w-sm flex-col overflow-hidden">

            {/* ==========================================
    Product Image
========================================== */}

            <div className="relative">
                <img
                    src={product?.image}
                    alt={product?.title || "Product"}
                    className="h-[300px] w-full object-cover"
                />
            </div>

            {/* ==========================================
                Product Details
            ========================================== */}

            <CardContent className="flex-1 p-4">

                {/* Product Title */}

                <h2 className="mb-2 line-clamp-1 text-xl font-bold">
                    {product?.title}
                </h2>

                {/* ==========================================
                    Product Price
                ========================================== */}

                <div className="mb-2 flex items-center gap-4">

                    {/* Original Price */}

                    <span
                        className={`text-lg font-semibold ${Number(product?.salePrice) > 0
                            ? "text-gray-500 line-through"
                            : "text-primary"
                            }`}
                    >
                        ₹{product?.price}
                    </span>

                    {/* Sale Price */}

                    {Number(product?.salePrice) > 0 && (
                        <span className="text-lg font-bold text-primary">
                            ₹{product?.salePrice}
                        </span>
                    )}

                </div>

                {/* ==========================================
                    Stock
                ========================================== */}

                <p className="text-sm text-gray-500">
                    Stock: {product?.totalStock}
                </p>

            </CardContent>

            {/* ==========================================
                Action Buttons
            ========================================== */}

            <CardFooter className="flex items-center justify-between p-4 pt-0">

                <Button
                    type="button"
                    onClick={handleEdit}
                >
                    Edit
                </Button>

                <Button
                    type="button"
                    variant="destructive"
                    onClick={() =>
                        handleDelete(product?._id)
                    }
                >
                    Delete
                </Button>

            </CardFooter>

        </Card>
    );
}

export default AdminProductTile;