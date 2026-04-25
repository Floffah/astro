"use client";

import { ArrowRightIcon, CalendarIcon } from "lucide-react";
import { motion } from "motion/react";
import { useId } from "react";
import { useSnapshot } from "valtio/react";
import { z } from "zod";

import { onboardingFormState } from "@/components/blocks/Onboarding/state";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAppForm } from "@/lib/hooks/form";

const MotionCard = motion.create(Card);

export default function OnboardingBirthday({ next }: { next: () => void }) {
    const data = useSnapshot(onboardingFormState);

    const formId = useId();
    const form = useAppForm({
        defaultValues: {
            birthday: data.birthday,
        },
        validators: {
            onSubmit: z.object({
                birthday: z.string().min(1, "Birthday is required"),
            }),
        },
        onSubmit: ({ value }) => {
            onboardingFormState.birthday = value.birthday;
            next();
        },
    });

    return (
        <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <CardHeader>
                <div className="flex gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center border border-border bg-background">
                        <CalendarIcon />
                    </div>
                    <div className="space-y-1.5">
                        <CardTitle>Your birthday</CardTitle>
                        <CardDescription>
                            Use the date and local time of your birth.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent asChild>
                <form
                    id={formId}
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}
                >
                    <form.AppField name="birthday">
                        {(field) => (
                            <Field>
                                <FieldLabel>Birth date and time</FieldLabel>
                                <Input
                                    type="datetime-local"
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                    aria-invalid={!field.state.meta.isValid}
                                />
                                <FieldDescription>
                                    Midnight is okay if you are unsure.
                                </FieldDescription>
                            </Field>
                        )}
                    </form.AppField>
                </form>
            </CardContent>

            <CardFooter className="justify-between gap-3">
                <div />

                <Button type="submit" form={formId}>
                    Continue
                    <ArrowRightIcon data-icon="inline-end" />
                </Button>
            </CardFooter>
        </MotionCard>
    );
}
