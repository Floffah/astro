"use client";

import clsx from "clsx";
import { addDays } from "date-fns";
import { LockKeyholeIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePostHog } from "posthog-js/react";

import { Icon } from "@/components/Icon";
import { EventName } from "@/lib/analytics/EventName";
import { useDialogs } from "@/providers/DialogProvider";
import { useHoroscopeStore } from "@/state/horoscopeStore";

export function DateSelector({ isPremium }: { isPremium: boolean }) {
    const posthog = usePostHog();
    const router = useRouter();
    const dialogs = useDialogs();
    const horoscopeState = useHoroscopeStore();

    return (
        <div className="flex items-center justify-center gap-1">
            {[-2, -1, 0, 1, 2].map((dayOffset) => (
                <button
                    key={dayOffset}
                    className={clsx(
                        "relative cursor-pointer rounded-xl px-2 py-1 transition-colors hover:bg-gray-800",
                        {
                            "text-2xl text-white": dayOffset === 0,
                            "text-xl text-gray-300": Math.abs(dayOffset) === 1,
                            "text-lg text-gray-400": Math.abs(dayOffset) === 2,

                            "bg-gray-800":
                                horoscopeState.dateSelected.getDate() ===
                                addDays(new Date(), dayOffset).getDate(),
                        },
                    )}
                    onClick={async () => {
                        if (!isPremium && dayOffset !== 0) {
                            router.prefetch("/upgrade");

                            posthog.capture(EventName.CLICKED_DATE_NOT_PREMIUM);

                            const doUpgrade = await dialogs.showConfirmation({
                                title: "Upgrade to Premium",
                                description:
                                    "Unlock this feature by upgrading to Premium.",
                                confirmText: "Upgrade",
                                cancelText: "Cancel",
                            });

                            if (doUpgrade) {
                                posthog.capture(EventName.CLICKED_UPGRADE_LINK);
                                router.push("/upgrade");
                            }

                            return;
                        }

                        posthog.capture(EventName.HOROSCOPE_DATE_CHANGED, {
                            date: addDays(new Date(), dayOffset).toISOString(),
                        });

                        horoscopeState.setDateSelected(
                            addDays(new Date(), dayOffset),
                        );
                    }}
                >
                    {addDays(new Date(), dayOffset).getDate()}

                    {!isPremium && dayOffset !== 0 && (
                        <Icon>
                            <LockKeyholeIcon className="absolute right-0 bottom-0 h-3 w-3 text-yellow-500" />
                        </Icon>
                    )}
                </button>
            ))}
        </div>
    );
}
