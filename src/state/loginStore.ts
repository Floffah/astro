import { create } from "zustand/react";

interface LoginState {
    codeSent: boolean;
    email: string;

    setCodeSent: (codeSent: boolean) => void;
    setEmail: (email: string) => void;
}

export const useLoginStore = create<LoginState>((set) => ({
    codeSent: false,
    email: "",

    setCodeSent: (codeSent) => set({ codeSent }),
    setEmail: (email) => set({ email }),
}));
