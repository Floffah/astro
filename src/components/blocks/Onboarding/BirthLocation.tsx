"use client";

import { ArrowLeftIcon, ArrowRightIcon, MapPinIcon } from "lucide-react";
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

export default function OnboardingBirthLocation({
    back,
    next,
}: {
    back: () => void;
    next: () => void;
}) {
    const data = useSnapshot(onboardingFormState);

    const formId = useId();
    const form = useAppForm({
        defaultValues: {
            birthPlaceLat: data.birthPlaceLat,
            birthPlaceLng: data.birthPlaceLng,
        },
        validators: {
            onSubmit: z.object({
                birthPlaceLat: z
                    .number()
                    .min(-90, "Latitude must be at least -90")
                    .max(90, "Latitude must be at most 90"),
                birthPlaceLng: z
                    .number()
                    .min(-180, "Longitude must be at least -180")
                    .max(180, "Longitude must be at most 180"),
            }),
        },
        onSubmit: ({ value }) => {
            onboardingFormState.birthPlaceLat = value.birthPlaceLat;
            onboardingFormState.birthPlaceLng = value.birthPlaceLng;
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
                        <MapPinIcon />
                    </div>
                    <div className="space-y-1.5">
                        <CardTitle>Your birthplace</CardTitle>
                        <CardDescription>
                            Use decimal coordinates for the place you were born.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent asChild>
                <form
                    id={formId}
                    className="grid gap-6 sm:grid-cols-2"
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}
                >
                    <form.AppField name="birthPlaceLat">
                        {(field) => (
                            <Field>
                                <FieldLabel>Latitude</FieldLabel>
                                <Input
                                    type="number"
                                    name={field.name}
                                    value={field.state.value}
                                    inputMode="decimal"
                                    placeholder="37.7749"
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                        field.handleChange(
                                            Number(e.target.value),
                                        )
                                    }
                                    aria-invalid={!field.state.meta.isValid}
                                />
                                <FieldDescription>
                                    North is positive, south is negative.
                                </FieldDescription>
                            </Field>
                        )}
                    </form.AppField>

                    <form.AppField name="birthPlaceLng">
                        {(field) => (
                            <Field>
                                <FieldLabel>Longitude</FieldLabel>
                                <Input
                                    type="number"
                                    name={field.name}
                                    value={field.state.value}
                                    inputMode="decimal"
                                    placeholder="-122.4194"
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                        field.handleChange(
                                            Number(e.target.value),
                                        )
                                    }
                                    aria-invalid={!field.state.meta.isValid}
                                />
                                <FieldDescription>
                                    East is positive, west is negative.
                                </FieldDescription>
                            </Field>
                        )}
                    </form.AppField>
                </form>
            </CardContent>

            <CardFooter className="justify-between gap-3">
                <Button type="button" variant="outline" onClick={back}>
                    <ArrowLeftIcon data-icon="inline-start" />
                    Back
                </Button>

                <Button type="submit" form={formId}>
                    Continue
                    <ArrowRightIcon data-icon="inline-end" />
                </Button>
            </CardFooter>
        </MotionCard>
    );
}
