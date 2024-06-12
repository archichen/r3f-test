import { Vector3 } from "three";
import { create } from "zustand";

interface NavState {
  startPosition: Vector3;
  targetPosition: Vector3;
  setStartPosition: (position: Vector3) => void;
  setTargetPosition: (position: Vector3) => void;
}

export const useNavStore = create<NavState>((set) => ({
  startPosition: new Vector3() as Vector3,
  targetPosition: new Vector3() as Vector3,
  setStartPosition: (position: Vector3) =>
    set(() => ({ startPosition: position })),
  setTargetPosition: (position: Vector3) =>
    set(() => ({ targetPosition: position })),
}));