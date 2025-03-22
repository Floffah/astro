import { create } from "zustand/react";

interface HoroscopeState {
    dateSelected: Date;

    setDateSelected: (dateSelected: Date) => void;
}

export const useHoroscopeStore = create<HoroscopeState>((set) => ({
    dateSelected: new Date(),

    setDateSelected: (dateSelected) => set({ dateSelected }),
}));
