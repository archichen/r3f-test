import { useCameraStore, ORBIT_CAMERA, PLAYER_CAMERA } from "./store/cameraStore";

export default function Interface() {
    const setCurrentCamera = useCameraStore((state) => state.setCurrentCamera);
    const currentCamera = useCameraStore((state) => state.currentCamera);

    const handleSwitchView = () => {
        if (currentCamera === ORBIT_CAMERA) {
            setCurrentCamera(PLAYER_CAMERA);
        } else {
            setCurrentCamera(ORBIT_CAMERA);
        }
    };

    return (
        <div
            style={{
                zIndex: 1000,
                position: "absolute",
                bottom: "10px",
                left: "10px",
            }}
        >
            <button onClick={handleSwitchView}>Switch view</button>
        </div>
    );
}
