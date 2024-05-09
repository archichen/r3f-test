import { OrbitControls } from "@react-three/drei";
import {
    ORBIT_CAMERA,
    PLAYER_CAMERA,
    useCameraStore,
} from "../../store/cameraStore";
import { useEffect, useRef } from "react";
import { RootState, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { isEmpty } from "lodash";
import { useSeatStore } from "../../store/seatStore";
import React from "react";
import PriorityCameraAnimation, {
    usePriorityCameraAnimation,
} from "@/hooks/usePriorityCameraAnimation";

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
    // useFrame(({ camera }, delta) => {
    //     const { to, isAnimationDone } = cameraStat;

    //     if (document.isFocusOnSeat) {
    //         if (currentSeat) {
    //             currentSeat.updateMatrixWorld(true);
    //             let pos = new THREE.Vector3().setFromMatrixPosition(
    //                 currentSeat.matrixWorld
    //             );

    //             pos = pos.multiply(
    //                 new THREE.Vector3(scaleCoef, scaleCoef, scaleCoef)
    //             );

    //             camera.position.lerp(
    //                 {
    //                     x: pos.x + 3,
    //                     z: pos.z + 3,
    //                     y: pos.y + 5,
    //                 },
    //                 2 * delta
    //             );
    //             camera.lookAt(pos);
    //         }
    //     } else {
    //         if (isAnimationDone) return;

    //         if (currentCamera === ORBIT_CAMERA) {
    //             camera.position.lerp(to, 2 * delta);
    //             if (camera.position.distanceTo(to) < 0.1) {
    //                 cameraStat.isAnimationDone = true;

    //                 console.log("相机到位");
    //             }
    //             camera.lookAt(new THREE.Vector3(0, 0, 0));
    //         }
    //     }
    // });

    usePriorityCameraAnimation(({ camera }, delta, { toLatest }) => {
        console.log('Camera animation')
        const { to, isAnimationDone } = cameraStat;
        if (isAnimationDone) return;

        if (currentCamera === ORBIT_CAMERA) {
            camera.position.lerp(to, 2 * delta);
            if (camera.position.distanceTo(to) < 0.1) {
                cameraStat.isAnimationDone = true;

                toLatest();
                console.log("相机到位");
                
            }
            camera.lookAt(new THREE.Vector3(0, 0, 0));
        }
    });

    const currentSeat = useSeatStore((state) => state.currentSeat);
    useEffect(() => {
        document.currentSeat = currentSeat;
    }, [currentSeat]) 

    // const scaleCoef = 5;
    // usePriorityCameraAnimation(({ camera }, delta) => {
    //     if (document.isFocusOnSeat) {
    //         if (document.currentSeat) {
    //             document.currentSeat.updateMatrixWorld(true);
    //             let pos = new THREE.Vector3().setFromMatrixPosition(
    //                 document.currentSeat.matrixWorld
    //             );

    //             pos = pos.multiply(
    //                 new THREE.Vector3(scaleCoef, scaleCoef, scaleCoef)
    //             );

    //             camera.position.lerp(
    //                 {
    //                     x: pos.x + 3,
    //                     z: pos.z + 3,
    //                     y: pos.y + 5,
    //                 },
    //                 2 * delta
    //             );
    //             camera.lookAt(pos);
    //         }
    //     }
    // });

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
            <PriorityCameraAnimation />
        </>
    );
}
