// * 该组建不由 gltf2jsx 脚本生成

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Box,
    Edges,
    Html,
    Instance,
    Instances,
    Merged,
    useGLTF,
} from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { Select } from "@react-three/postprocessing";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { useSeatStore } from "../store/seatStore";
import { Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Model(props) {
    const { nodes } = useGLTF("/assets/seats.glb");
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const setCurrentSeat = useSeatStore((state) => state.setCurrentSeat);
    const setSeats = useSeatStore((state) => state.setSeats);

    // TODO: 1. 加入高模支持
    // TODO: 2. 加入 Detail 组件，根据相机距离自动切换高低模
    const meshs = useMemo(
        () => ({
            M1: nodes.平面002,
            M2: nodes.平面002_1,
            M3: nodes.平面002_2,
            M4: nodes.平面002_3,
            M5: nodes.平面002_4,
            M6: nodes.平面002_5,
            M7: nodes.平面002_6,
            M8: nodes.平面002_7,
            M9: nodes.平面002_8,
            M10: nodes.平面002_9,
            M11: nodes.平面002_10,
            M12: nodes.平面002_11,
        }),
        [
            nodes.平面002,
            nodes.平面002_1,
            nodes.平面002_2,
            nodes.平面002_3,
            nodes.平面002_4,
            nodes.平面002_5,
            nodes.平面002_6,
            nodes.平面002_7,
            nodes.平面002_8,
            nodes.平面002_9,
            nodes.平面002_10,
            nodes.平面002_11,
        ]
    );

    const seats = useMemo(
        () =>
            Object.keys(nodes)
                .filter((name) => name.includes("seat"))
                .map((name) => nodes[name]),
        [nodes]
    );

    setSeats(seats);

    useEffect(() => {
        document.isFocusOnSeat = false;
    });

    const handlePointerOverSeat = (seat) => {
        // document.isFocusOnSeat = false;
        setCurrentSeat(seat);
    };

    const handlePointerLeaveSeat = () => {
        if (!document.isFocusOnSeat) setCurrentSeat(null);
    };

    console.log(
        "%cSEATS - heavy component re-render! \nOptimize your code!!!",
        "color: red; font-size: 16px;"
    );

    return (
        <>
            <Merged meshes={meshs} castShadow={true} receiveShadow={true}>
                {(models) => {
                    return (
                        <group position={[0, 0, 0]} scale={5}>
                            {seats.map((seat, index) => {
                                return (
                                    <RigidBody key={index} type="fixed">
                                        <group
                                            key={index}
                                            position={seat.position}
                                            scale={seat.scale}
                                            quaternion={seat.quaternion}
                                            rotation={seat.rotation}
                                            onPointerOver={() =>
                                                handlePointerOverSeat(seat)
                                            }
                                            onPointerLeave={() =>
                                                handlePointerLeaveSeat()
                                            }
                                            onClick={() =>
                                                (document.isFocusOnSeat = true)
                                            }
                                        >
                                            <models.M1 />
                                            <models.M2 />
                                            <models.M3 />
                                            <models.M4 />
                                            <models.M5 />
                                            <models.M6 />
                                            <models.M7 />
                                            <models.M8 />
                                            <models.M9 />
                                            <models.M10 />
                                            <models.M11 />
                                            <models.M12 />
                                        </group>

                                        <CuboidCollider
                                            args={[1, 1, 1]}
                                            position={seat.position}
                                            scale={0.2}
                                        />
                                    </RigidBody>
                                );
                            })}
                            <HightLightBox />
                        </group>
                    );
                }}
            </Merged>
        </>
    );
}

function HightLightBox(props) {
    const highLightBox = useRef();

    const currentSeat = useSeatStore((state) => state.currentSeat);
    useFrame(({ camera }, delta) => {
        if (currentSeat) {
            highLightBox.current.visible = true;
            highLightBox.current.position.lerp(
                currentSeat.position,
                delta * 20
            );
        } else {
            highLightBox.current.visible = false;
        }
    });

    const handlePinTips = () => {};
    return (
        <group ref={highLightBox}>
            <mesh scale={0.4} onClick={handlePinTips}>
                <boxGeometry />
                <meshStandardMaterial transparent={true} opacity={0} />
                <Edges
                    scale={1}
                    renderOrder={1000}
                    lineWidth={2}
                    color={"orange"}
                />
            </mesh>
            <Html
                className="w-80 h-36"
            >
                {currentSeat && (
                    <div className="bg-white rounded-lg drop-shadow-lg">
                        <div className="font-bold text-xs bg-blue-900 text-white text-center pt-1 pb-1">
                            Seat no: {currentSeat.name}
                        </div>
                        <div
                            className="
                                flex items-center justify-center
                                p-2
                            "
                        >
                            <img
                                className="w-24 h-24 rounded-full bg-cover bg-center"
                                src="https://p9-pc-sign.douyinpic.com/tos-cn-i-0813/okPDfA2A9IkAtDobDAEAVgnlAlteDAa6CgArqD~noop.jpeg?biz_tag=pcweb_cover&from=327834062&s=PackSourceEnum_SEARCH&se=false&x-expires=1715738400&x-signature=lfihm76eEhJ0%2BPq1nwE2PbqZGvU%3D"
                            />

                            <div className="ml-2 flex flex-col ">
                                <p className="font-bold w-32 truncate">
                                    PENG, YU YAN
                                </p>
                                <p className="text-xs pb-1 font-light w-32 truncate">
                                    Email: test@pyy.com
                                </p>
                                <p className="text-xs pb-1 font-light w-32 truncate">
                                    Title: Super star
                                </p>
                                <p className="text-xs font-light w-32 truncate">
                                    Location: Build 5, Lujiazui XXX Park
                                </p>
                            </div>
                            <Button
                                radius="full"
                                className="rounded-full w-14 h-14"
                            >
                                <Navigation />
                            </Button>
                        </div>
                    </div>
                )}
            </Html>
        </group>
    );
}

useGLTF.preload("/assets/seats.glb");
