import { Button, ButtonProps } from "@/components/Button";
import { useFormContext } from "@/lib/useAppForm";

export function FormSubscribeButton(props: ButtonProps) {
    const form = useFormContext();

    return (
        <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
                <Button {...props} loading={props.loading || isSubmitting} />
            )}
        </form.Subscribe>
    );
}
