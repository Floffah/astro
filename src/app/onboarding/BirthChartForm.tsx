"use client";

import { z } from "zod";

import { setBirthChart } from "@/actions/user/setBirthChart";
import { useAppForm } from "@/lib/useAppForm";

const formSchema = z.object({
    birthDate: z.custom<string>((v) => !Number.isNaN(Date.parse(v))),
    lat: z.number(),
    long: z.number(),
});

type FormValues = z.infer<typeof formSchema>;

export function BirthChartForm({ onSubmitted }: { onSubmitted: () => void }) {
    const form = useAppForm({
        defaultValues: {
            birthDate: "",
            lat: 0,
            long: 0,
        } as FormValues,
        validators: {
            onSubmit: formSchema,
        },
        onSubmit: async ({ value }) => {
            const result = await setBirthChart({
                ...value,
                birthDate: new Date(value.birthDate),
            });

            if (result.success || result.error === "Birth chart already set") {
                onSubmitted();
            }
        },
    });

    return (
        <form
            className="flex max-w-lg flex-col gap-2"
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
            }}
        >
            <form.AppForm>
                <form.AppField name="birthDate">
                    {(field) => (
                        <field.Input
                            label="Birth Date"
                            type="datetime-local"
                            description="If you don't know what time you were born, put midnight (00:00)"
                        />
                    )}
                </form.AppField>

                <div className="flex gap-2">
                    <form.AppField name="lat">
                        {(field) => (
                            <field.Input
                                label="Latitude"
                                type="number"
                                placeholder="37.7749"
                                fieldClassName="flex-1"
                            />
                        )}
                    </form.AppField>
                    <form.AppField name="long">
                        {(field) => (
                            <field.Input
                                label="Longitude"
                                type="number"
                                placeholder="-122.4194"
                                fieldClassName="flex-1"
                            />
                        )}
                    </form.AppField>
                </div>

                <p className="text-sm font-light text-white/70">
                    Find where you were born on google maps, click it outside of
                    a marked point and you will see the coordinates at the
                    bottom of your screen
                </p>

                <form.SubscribeButton color="primary" size="sm">
                    Save
                </form.SubscribeButton>
            </form.AppForm>
        </form>
    );
}
