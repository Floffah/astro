import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

import { FormInput } from "@/components/forms/FormInput";
import { FormSubmitError } from "@/components/forms/FormSubmitError";
import { FormSubscribeButton } from "@/components/forms/FormSubscribeButton";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
    createFormHookContexts();

export const { useAppForm } = createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
        Input: FormInput,
    },
    formComponents: {
        SubscribeButton: FormSubscribeButton,
        SubmitError: FormSubmitError,
    },
});
