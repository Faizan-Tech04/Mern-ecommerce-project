import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectValue,
    SelectTrigger,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

function CommonForm({
    formControls,
    formData,
    setFormData,
    onSubmit,
    buttonText,
    isBtnDisabled,
}) {
    // ==========================================
    // Render Input By Component Type
    // ==========================================

    function renderInputByComponentType(getControlItem) {
        let element = null;

        const value = formData[getControlItem.name] || "";

        switch (getControlItem.componentType) {
            // ==========================================
            // Input
            // ==========================================

            case "input":
                element = (
                    <Input
                        name={getControlItem.name}
                        placeholder={
                            getControlItem.placeholder
                        }
                        id={getControlItem.name}
                        type={getControlItem.type}
                        autoComplete={
                            getControlItem.autoComplete
                        }
                        value={value}
                        onChange={(event) =>
                            setFormData({
                                ...formData,
                                [event.target.name]:
                                    event.target.value,
                            })
                        }
                    />
                );
                break;

            // ==========================================
            // Select
            // ==========================================

            case "select":
                element = (
                    <Select
                        value={value}
                        onValueChange={(value) =>
                            setFormData({
                                ...formData,
                                [getControlItem.name]:
                                    value,
                            })
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue
                                placeholder={
                                    getControlItem.placeholder
                                }
                            />
                        </SelectTrigger>

                        <SelectContent>
                            {getControlItem.options?.map(
                                (optionItem) => (
                                    <SelectItem
                                        key={optionItem.id}
                                        value={optionItem.id}
                                    >
                                        {optionItem.label}
                                    </SelectItem>
                                )
                            )}
                        </SelectContent>
                    </Select>
                );
                break;

            // ==========================================
            // Textarea
            // ==========================================

            case "textarea":
                element = (
                    <Textarea
                        name={getControlItem.name}
                        placeholder={
                            getControlItem.placeholder
                        }
                        id={getControlItem.name}
                        value={value}
                        onChange={(event) =>
                            setFormData({
                                ...formData,
                                [event.target.name]:
                                    event.target.value,
                            })
                        }
                        className="min-h-28 resize-none"
                    />
                );
                break;

            // ==========================================
            // Default
            // ==========================================

            default:
                element = null;
        }

        return element;
    }

    // ==========================================
    // JSX
    // ==========================================

    return (
        <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
                {formControls.map((controlItem) => (
                    <div
                        key={controlItem.name}
                        className="flex w-full flex-col gap-3"
                    >
                        <Label
                            htmlFor={controlItem.name}
                        >
                            {controlItem.label}
                        </Label>

                        {renderInputByComponentType(
                            controlItem
                        )}
                    </div>
                ))}
            </div>

            {/* ==========================================
                Submit Button
            ========================================== */}

            <Button
                type="submit"
                className="mt-6 w-full"
                disabled={isBtnDisabled}
            >
                {buttonText || "Submit"}
            </Button>
        </form>
    );
}

export default CommonForm;