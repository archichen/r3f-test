import { useState } from "react";
import { useCameraStore, ORBIT_CAMERA, PLAYER_CAMERA } from "./store/cameraStore";
import { Button } from "@/components/ui/button";

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

    const [isFullScreen, setIsFullScreen] = useState(false);
    const handleSwitchFullScreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
            setIsFullScreen(false);
        } else {
            document.documentElement.requestFullscreen();
            setIsFullScreen(true);
        }
    };

    return (
        <div
            style={{
                zIndex: 1000,
                position: "absolute",
                bottom: "10px",
                left: "10px",
                display: "flex",
                gap: "10px",
            }}
        >
            <Button onClick={handleSwitchView}>Switch view</Button>
            <Button onClick={handleSwitchFullScreen}>{ isFullScreen ? "Exit full screen" : "Enter full screen" }</Button>
        </div>
    );
}
