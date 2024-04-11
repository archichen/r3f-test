import { useCameraStore, ORBIT_CAMERA, PLAYER_CAMERA } from "./store/cameraStore";

export default function Interface() {
    const setCurrentCamera = useCameraStore((state) => state.setCurrentCamera);
    const currentCamera = useCameraStore((state) => state.currentCamera);

    // TODO: 点击后自动失焦，否则按下空格控制 Player 跳跃会再次触发按钮
    const handleSwitchView = (event) => {
        event.preventDefault();
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
