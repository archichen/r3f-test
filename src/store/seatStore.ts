import { create } from "zustand";

export const useSeatStore = create((set) => ({
    currentSeat: null,
    setCurrentSeat: (seat) => set({ currentSeat: seat }),
    seats: [] as string[],
    setSeats: (seats: string[]) => set({ seats: seats }),
    addSeat: (seat: string) => set((state) => ({ seats: [...state.seats, seat] })),
}));
