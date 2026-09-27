import { filterOptions } from "@/config";

import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

function ProductFilter({ filters, handleFilter }) {
    return (
        <div className="rounded-lg bg-background shadow-sm">

            {/* ==========================================
                Filter Header
            ========================================== */}

            <div className="border-b p-4">
                <h2 className="text-lg font-extrabold">
                    Filters
                </h2>
            </div>

            {/* ==========================================
                Filter Options
            ========================================== */}

            <div className="space-y-6 p-4">

                {Object.keys(filterOptions).map((keyItem) => (
                    <div key={keyItem}>

                        {/* Filter Title */}

                        <h3 className="text-base font-semibold capitalize">
                            {keyItem}
                        </h3>

                        {/* Filter Options */}

                        <div className="mt-2 grid gap-2">

                            {filterOptions[keyItem].map((option) => (
                                <Label
                                    key={option.id}
                                    className="flex cursor-pointer items-center gap-2 font-normal"
                                >

                                    <Checkbox
                                        checked={
                                            filters?.[keyItem]?.includes(
                                                option.id
                                            ) || false
                                        }
                                        onCheckedChange={() =>
                                            handleFilter(
                                                keyItem,
                                                option.id
                                            )
                                        }
                                    />

                                    <span>
                                        {option.label}
                                    </span>

                                </Label>
                            ))}

                            <Separator />

                        </div>

                    </div>
                ))}

            </div>

        </div>
    );
}

export default ProductFilter;