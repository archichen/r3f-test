import { generateUUID } from "three/src/math/MathUtils";
import { create } from "zustand";

export const ORBIT_CAMERA = generateUUID();
export const PLAYER_CAMERA = generateUUID();

export const useCameraStore = create((set) => ({
    currentCamera: ORBIT_CAMERA,
    setCurrentCamera: (camera) => set({ currentCamera: camera }),
}));
