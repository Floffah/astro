import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

export const { fieldContext, useFieldContext, formContext, useFormContext } =
    createFormHookContexts();

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
    fieldComponents: {},
    formComponents: {},
    fieldContext,
    formContext,
});
