import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import ProductImageUpload from "@/components/admin-view/image-upload";

import {
    addFeature,
    getFeatures,
    updateFeature,
    deleteFeature,
} from "@/store/admin/feature-slice";

import { Button } from "@/components/ui/button";

import {
    Pencil,
    Trash2,
    Loader2,
} from "lucide-react";

import { toast } from "sonner";

// ==========================================
// Admin Dashboard
// ==========================================

function AdminDashboard() {
    const dispatch = useDispatch();

    // ==========================================
    // Feature Redux State
    // ==========================================

    const {
        featureList,
        isLoading,
        isSubmitting,
        error,
    } = useSelector(
        (state) => state.adminFeatures
    );

    // ==========================================
    // Image State
    // ==========================================

    const [imageFile, setImageFile] =
        useState(null);

    const [
        uploadedImageUrl,
        setUploadedImageUrl,
    ] = useState("");

    const [
        imageLoadingState,
        setImageLoadingState,
    ] = useState(false);

    // ==========================================
    // Feature Form State
    // ==========================================

    const [title, setTitle] =
        useState("");

    const [
        description,
        setDescription,
    ] = useState("");

    // ==========================================
    // Edit State
    // ==========================================

    const [
        currentEditedId,
        setCurrentEditedId,
    ] = useState(null);

    // ==========================================
    // Fetch Features
    // ==========================================

    useEffect(() => {
        dispatch(getFeatures());
    }, [dispatch]);

    // ==========================================
    // Reset Form
    // ==========================================

    function resetForm() {
        setImageFile(null);
        setUploadedImageUrl("");
        setTitle("");
        setDescription("");
        setCurrentEditedId(null);
        setImageLoadingState(false);
    }

    // ==========================================
    // Submit Feature
    // ==========================================

    async function handleSubmit(event) {
        event.preventDefault();

        // ----------------------------------------
        // Validation
        // ----------------------------------------

        if (!uploadedImageUrl.trim()) {
            toast.error(
                "Please upload a feature image."
            );
            return;
        }

        if (!title.trim()) {
            toast.error(
                "Please enter a feature title."
            );
            return;
        }

        if (!description.trim()) {
            toast.error(
                "Please enter a feature description."
            );
            return;
        }

        try {
            // ======================================
            // Update Existing Feature
            // ======================================

            if (currentEditedId) {
                const result =
                    await dispatch(
                        updateFeature({
                            id: currentEditedId,
                            image:
                                uploadedImageUrl.trim(),
                            title: title.trim(),
                            description:
                                description.trim(),
                            isActive: true,
                        })
                    ).unwrap();

                if (result?.success) {
                    toast.success(
                        "Feature updated successfully!"
                    );

                    resetForm();
                }

                return;
            }

            // ======================================
            // Add New Feature
            // ======================================

            const result =
                await dispatch(
                    addFeature({
                        image:
                            uploadedImageUrl.trim(),
                        title: title.trim(),
                        description:
                            description.trim(),
                        isActive: true,
                    })
                ).unwrap();

            if (result?.success) {
                toast.success(
                    "Feature added successfully!"
                );

                resetForm();
            }
        } catch (error) {
            console.error(
                "Feature Submit Error:",
                error
            );

            toast.error(
                error?.message ||
                error ||
                "Something went wrong."
            );
        }
    }

    // ==========================================
    // Edit Feature
    // ==========================================

    function handleEdit(feature) {
        setCurrentEditedId(
            feature._id
        );

        setUploadedImageUrl(
            feature.image || ""
        );

        setTitle(
            feature.title || ""
        );

        setDescription(
            feature.description || ""
        );

        setImageFile(null);

        setImageLoadingState(false);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    // ==========================================
    // Delete Feature
    // ==========================================

    async function handleDelete(id) {
        const confirmed =
            window.confirm(
                "Are you sure you want to delete this feature?"
            );

        if (!confirmed) {
            return;
        }

        try {
            const result =
                await dispatch(
                    deleteFeature(id)
                ).unwrap();

            if (result?.success) {
                toast.success(
                    "Feature deleted successfully!"
                );

                if (
                    currentEditedId ===
                    id
                ) {
                    resetForm();
                }
            }
        } catch (error) {
            console.error(
                "Delete Feature Error:",
                error
            );

            toast.error(
                error?.message ||
                error ||
                "Failed to delete feature."
            );
        }
    }

    // ==========================================
    // Render
    // ==========================================

    return (
        <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
            {/* ==========================================
                Header
            ========================================== */}

            <div className="mb-6">
                <h1 className="text-2xl font-bold sm:text-3xl">
                    Admin Dashboard
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                    Manage your ecommerce features
                    and homepage slides.
                </p>
            </div>

            {/* ==========================================
                Feature Form
            ========================================== */}

            <div className="rounded-xl border bg-card p-5 shadow-sm sm:p-6">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold">
                        {currentEditedId
                            ? "Edit Feature"
                            : "Add Feature"}
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        {currentEditedId
                            ? "Update your existing homepage slide."
                            : "Add a new homepage slide."}
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    {/* ======================================
                        Image Upload
                    ====================================== */}

                    <div>
                        <h3 className="mb-3 text-sm font-medium">
                            Feature Image
                        </h3>

                        <ProductImageUpload
                            imageFile={
                                imageFile
                            }
                            setImageFile={
                                setImageFile
                            }
                            uploadedImageUrl={
                                uploadedImageUrl
                            }
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
                                currentEditedId !==
                                null
                            }
                        />
                    </div>

                    {/* ======================================
                        Title
                    ====================================== */}

                    <div>
                        <label
                            htmlFor="feature-title"
                            className="mb-2 block text-sm font-medium"
                        >
                            Feature Title
                        </label>

                        <input
                            id="feature-title"
                            type="text"
                            value={title}
                            onChange={(event) =>
                                setTitle(
                                    event.target
                                        .value
                                )
                            }
                            placeholder="Enter feature title"
                            maxLength={100}
                            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>

                    {/* ======================================
                        Description
                    ====================================== */}

                    <div>
                        <label
                            htmlFor="feature-description"
                            className="mb-2 block text-sm font-medium"
                        >
                            Feature Description
                        </label>

                        <textarea
                            id="feature-description"
                            value={
                                description
                            }
                            onChange={(event) =>
                                setDescription(
                                    event.target
                                        .value
                                )
                            }
                            placeholder="Enter feature description"
                            maxLength={500}
                            rows={4}
                            className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>

                    {/* ======================================
                        Buttons
                    ====================================== */}

                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                        {currentEditedId && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={
                                    resetForm
                                }
                                disabled={
                                    isSubmitting
                                }
                            >
                                Cancel
                            </Button>
                        )}

                        <Button
                            type="submit"
                            disabled={
                                isSubmitting ||
                                imageLoadingState
                            }
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                                    {currentEditedId
                                        ? "Updating..."
                                        : "Adding..."}
                                </>
                            ) : currentEditedId ? (
                                "Update Feature"
                            ) : (
                                "Add Feature"
                            )}
                        </Button>
                    </div>
                </form>
            </div>

            {/* ==========================================
                Feature List
            ========================================== */}

            <div className="mt-8">
                <div className="mb-5">
                    <h2 className="text-lg font-semibold">
                        Feature / Slide List
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage your homepage slides.
                    </p>
                </div>

                {/* ======================================
                    Loading
                ====================================== */}

                {isLoading && (
                    <div className="flex min-h-[200px] items-center justify-center rounded-xl border">
                        <Loader2 className="h-7 w-7 animate-spin text-primary" />
                    </div>
                )}

                {/* ======================================
                    Error
                ====================================== */}

                {!isLoading && error && (
                    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-center">
                        <p className="text-sm text-destructive">
                            {error}
                        </p>
                    </div>
                )}

                {/* ======================================
                    Empty State
                ====================================== */}

                {!isLoading &&
                    !error &&
                    featureList.length === 0 && (
                        <div className="rounded-xl border border-dashed p-8 text-center">
                            <p className="text-sm font-medium">
                                No features found.
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                                Add your first
                                homepage slide above.
                            </p>
                        </div>
                    )}

                {/* ======================================
                    Feature Cards
                ====================================== */}

                {!isLoading &&
                    !error &&
                    featureList.length > 0 && (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {featureList.map(
                                (feature) => (
                                    <div
                                        key={
                                            feature._id
                                        }
                                        className="overflow-hidden rounded-xl border bg-card shadow-sm"
                                    >
                                        {/* Image */}

                                        <div className="aspect-video overflow-hidden bg-muted">
                                            <img
                                                src={
                                                    feature.image
                                                }
                                                alt={
                                                    feature.title ||
                                                    "Feature"
                                                }
                                                className="h-full w-full object-cover"
                                            />
                                        </div>

                                        {/* Content */}

                                        <div className="p-4">
                                            <h3 className="font-semibold">
                                                {
                                                    feature.title
                                                }
                                            </h3>

                                            <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                                                {
                                                    feature.description
                                                }
                                            </p>

                                            <div className="mt-4 flex gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1"
                                                    onClick={() =>
                                                        handleEdit(
                                                            feature
                                                        )
                                                    }
                                                >
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit
                                                </Button>

                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    className="flex-1"
                                                    onClick={() =>
                                                        handleDelete(
                                                            feature._id
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}
            </div>
        </div>
    );
}

export default AdminDashboard;