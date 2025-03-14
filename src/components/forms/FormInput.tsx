import { useMemo } from "react";

import { Input, InputProps } from "@/components/Input";
import { FormField, FormFieldProps } from "@/components/forms/FormField";
import { useFieldContext, useFormContext } from "@/lib/useAppForm";

export function FormInput({
    label,
    description,
    warning,
    disabled,
    fieldClassName,
    ...props
}: FormFieldProps & InputProps & { fieldClassName?: string }) {
    const form = useFormContext();
    const field = useFieldContext();

    const hasError = useMemo(() => {
        return field.state.meta.errors.length > 0;
    }, [field.state.meta.errors]);

    return (
        <FormField
            label={label}
            description={description}
            warning={warning}
            className={fieldClassName}
        >
            <form.Subscribe selector={(state) => state.isSubmitting}>
                {(isSubmitting) => (
                    <Input
                        value={field.state.value as any}
                        onChange={(e) => {
                            if (e.target.type === "number") {
                                field.handleChange(e.target.valueAsNumber);
                            } else {
                                field.handleChange(e.target.value);
                            }
                        }}
                        hasError={hasError}
                        disabled={isSubmitting || disabled}
                        {...props}
                    />
                )}
            </form.Subscribe>
        </FormField>
    );
}
