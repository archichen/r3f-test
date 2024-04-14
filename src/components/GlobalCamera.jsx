import {
    CameraControls,
    Html,
    OrbitControls,
    PointerLockControls,
} from "@react-three/drei";
import {
    ORBIT_CAMERA,
    PLAYER_CAMERA,
    useCameraStore,
} from "../store/cameraStore";
import { useEffect, useRef, useState } from "react";
import { useControls, button, buttonGroup, folder } from "leva";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { isEmpty } from "lodash";

let isPointerLock = false;
const cameraStat = {
    from: new THREE.Vector3(),
    to: new THREE.Vector3(),
    isAnimationDone: true,
};

export default function GlobalCamera() {
    const currentCamera = useCameraStore((state) => state.currentCamera);
    const { playerPosition, overLookPosition } = useCameraStore((state) => ({
        playerPosition: state.playerPosition,
        overLookPosition: state.overLookPosition,
    }));

    const pointerLockCamRef = useRef();

    // 相机切换：位置管理
    useEffect(() => {
        if (currentCamera === ORBIT_CAMERA) {
            cameraStat.from = new THREE.Vector3(
                playerPosition[0],
                playerPosition[1],
                playerPosition[2]
            );
            cameraStat.to = new THREE.Vector3(
                overLookPosition[0],
                overLookPosition[1],
                overLookPosition[2]
            );
            isPointerLock = false;
        }
        if (currentCamera === PLAYER_CAMERA) {
            cameraStat.from = new THREE.Vector3(
                overLookPosition[0],
                overLookPosition[1],
                overLookPosition[2]
            );
            cameraStat.to = new THREE.Vector3(
                playerPosition[0],
                playerPosition[1],
                playerPosition[2]
            );
            if (!isEmpty(document.canvas)) {
                document.canvas.requestPointerLock();
            }
        }
        cameraStat.isAnimationDone = false;

        document.camera = currentCamera;
    }, [currentCamera]);

    // 相机切换：动画实现
    // BUG: 相机动画与 Ecctrl 相机管理冲突，导致切换到 PLAYER CAMERA 后视角无法正确归位
    // 目前暂时当切换到 PLAYER CAMERA 时不播放动画
    useFrame(({ camera }, delta) => {
        const { to, isAnimationDone } = cameraStat;

        if (isAnimationDone) return;

        if (currentCamera === ORBIT_CAMERA) {
            camera.position.lerp(to, 2 * delta);
            if (camera.position.distanceTo(to) < 0.1) {
                cameraStat.isAnimationDone = true;

                console.log("相机到位");
            }
            camera.lookAt(new THREE.Vector3(0, 0, 0));
        }
    });

    // 相机初始化，默认为 orbit 相机
    useEffect(() => {
        setInterval(() => {
            if (
                !isPointerLock &&
                pointerLockCamRef &&
                pointerLockCamRef?.current
            ) {
                pointerLockCamRef?.current.unlock();
            }
        }, 10);
    });

    return (
        <>
            <OrbitControls
                enabled={currentCamera === ORBIT_CAMERA}
                makeDefault={currentCamera === ORBIT_CAMERA}
            />
        </>
    );
}
