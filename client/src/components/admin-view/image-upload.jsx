import { useRef, useEffect } from "react";
import axios from "axios";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

import {
    UploadCloudIcon,
    FileIcon,
    XIcon,
} from "lucide-react";

function ProductImageUpload({
    imageFile,
    setImageFile,
    imageLoadingState,
    uploadedImageUrl,
    setUploadedImageUrl,
    setImageLoadingState,
    isEditMode,
}) {
    const inputRef = useRef(null);

    // ==========================================
    // Select Image
    // ==========================================

    function handleImageFileChange(event) {
        const selectedFile = event.target.files?.[0];

        if (selectedFile) {
            setImageFile(selectedFile);
        }
    }

    // ==========================================
    // Drag Over
    // ==========================================

    function handleDragOver(event) {
        event.preventDefault();
    }

    // ==========================================
    // Drop Image
    // ==========================================

    function handleDrop(event) {
        event.preventDefault();

        const droppedFile = event.dataTransfer.files?.[0];

        if (droppedFile) {
            setImageFile(droppedFile);
        }
    }

    // ==========================================
    // Remove Image
    // ==========================================

    function handleRemoveImage() {
        setImageFile(null);
        setUploadedImageUrl("");
        setImageLoadingState(false);

        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }

    // ==========================================
    // Upload Image To Cloudinary
    // ==========================================

    async function uploadImageToCloudinary() {
        if (!imageFile) return;

        try {
            setImageLoadingState(true);

            const data = new FormData();

            data.append("my_file", imageFile);

            const response = await axios.post(
                "http://localhost:5000/api/admin/products/upload-image",
                data
            );

            console.log("Upload Response:", response.data);

            if (response.data?.success) {
                setUploadedImageUrl(
                    response.data.result.secure_url
                );
            } else {
                setUploadedImageUrl("");

                console.error(
                    "Image upload failed:",
                    response.data?.message
                );
            }
        } catch (error) {
            console.error(
                "Image upload error:",
                error.response?.data || error.message
            );

            setUploadedImageUrl("");
        } finally {
            setImageLoadingState(false);
        }
    }

    // ==========================================
    // Upload When Image Changes
    // ==========================================

    useEffect(() => {
        if (imageFile) {
            uploadImageToCloudinary();
        }
    }, [imageFile]);

    // ==========================================
    // JSX
    // ==========================================

    return (
        <div className="mx-auto mt-0 w-full max-w-md">

            {/* ==========================================
                Title
            ========================================== */}

            <Label className="mb-2 block text-lg font-semibold">
                Upload Image
            </Label>

            {/* ==========================================
                Upload Area
            ========================================== */}

            <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="rounded-lg border-2 border-dashed p-4"
            >

                {/* ==========================================
                    File Input
                ========================================== */}

                <Input
                    id="image-upload"
                    type="file"
                    ref={inputRef}
                    accept="image/*"
                    onChange={handleImageFileChange}
                    disabled={isEditMode}
                />

                {/* ==========================================
                    No Image Selected
                ========================================== */}

                {!imageFile ? (
                    <Label
                        htmlFor="image-upload"
                        className={`flex h-32 flex-col items-center justify-center rounded-md border-2 border-dashed ${isEditMode
                                ? "cursor-not-allowed"
                                : "cursor-pointer"
                            }`}
                    >
                        <UploadCloudIcon className="mb-2 h-10 w-10 text-muted-foreground" />

                        <span className="text-sm text-center">
                            Drag & Drop or click to upload image
                        </span>
                    </Label>

                ) : imageLoadingState ? (

                    /* ==========================================
                        Uploading
                    ========================================== */

                    <div className="space-y-2">
                        <Skeleton className="h-10 w-full bg-gray-100" />
                        <p className="text-center text-sm text-muted-foreground">
                            Uploading image...
                        </p>
                    </div>

                ) : (

                    /* ==========================================
                        Uploaded File
                    ========================================== */

                    <div className="flex items-center justify-between gap-3">

                        <div className="flex min-w-0 items-center">

                            <FileIcon className="mr-2 h-8 w-8 shrink-0 text-primary" />

                            <p className="truncate text-sm font-medium">
                                {imageFile.name}
                            </p>

                        </div>

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="shrink-0 text-muted-foreground hover:text-foreground"
                            onClick={handleRemoveImage}
                        >
                            <XIcon className="h-4 w-4" />

                            <span className="sr-only">
                                Remove File
                            </span>
                        </Button>

                    </div>
                )}

            </div>

            {/* ==========================================
                Full Image Preview
            ========================================== */}

            {uploadedImageUrl && (
                <div className="mt-4 overflow-hidden rounded-lg border bg-gray-50">

                    <div className="flex aspect-[4/5] w-full items-center justify-center p-2">

                        <img
                            src={uploadedImageUrl}
                            alt="Uploaded product"
                            className="h-full w-full object-contain"
                        />

                    </div>

                </div>
            )}

        </div>
    );
}

export default ProductImageUpload;