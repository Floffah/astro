import { create } from "zustand/react";

interface HoroscopeState {
    dateSelected: Date;
    horoscopeExpanded: boolean;

    setDateSelected: (dateSelected: Date) => void;
    setHoroscopeExpanded: (horoscopeExpanded: boolean) => void;
}

export const useHoroscopeStore = create<HoroscopeState>((set) => ({
    dateSelected: new Date(),
    horoscopeExpanded: false,

    setDateSelected: (dateSelected) =>
        set({ dateSelected, horoscopeExpanded: true }),
    setHoroscopeExpanded: (horoscopeExpanded) => set({ horoscopeExpanded }),
}));
