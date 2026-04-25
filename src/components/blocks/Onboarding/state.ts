import { proxy } from "valtio/vanilla";
import { createMachine } from "xstate";

export const onboardingMachine = createMachine({
    id: "onboarding",
    initial: "birthday",
    states: {
        birthday: {
            on: {
                NEXT: "birthplace",
            },
        },
        birthplace: {
            tags: ["birthday-complete"],
            on: {
                NEXT: "confirm",
                BACK: "birthday",
            },
        },
        confirm: {
            tags: ["birthday-complete", "birthplace-complete"],
            on: {
                BACK: "birthday",
            },
        },
    },
});

export const onboardingFormState = proxy({
    birthday: "",
    birthPlaceLat: 0,
    birthPlaceLng: 0,
});
