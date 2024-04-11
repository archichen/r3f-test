// * 该组建不由 gltf2jsx 脚本生成

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Edges,
  Instance,
  Instances,
  Merged,
  useGLTF,
} from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { Select } from "@react-three/postprocessing";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";

export function Model(props) {
  const { nodes } = useGLTF("/assets/seats.glb");
  const [selectedIndex, setSelectedIndex] = useState(-1);

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

  useEffect(() => {
    document.focusSeat = null;
  });

  const handlePointerOverSeat = (seat) => {
    document.focusSeat = seat;
    document.isFocusOnSeat = true;
    // console.log(document.focusSeat);
  };

  const handlePointerLeaveSeat = () => {
    document.focusSeat = null;
    document.isFocusOnSeat = false;
  };

  console.log('%cSEATS - heavy component re-render! \nOptimize your code!!!', 'color: red; font-size: 16px;')

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
                      onPointerOver={() => handlePointerOverSeat(seat)}
                      onPointerLeave={() => handlePointerLeaveSeat()}
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

  useFrame(() => {
    if (document.isFocusOnSeat) {
      highLightBox.current.visible = true;
      highLightBox.current.position.copy(document.focusSeat.position);
    } else {
      highLightBox.current.visible = false;
    }
  });
  return (
    <mesh ref={highLightBox} scale={0.4}>
      <boxGeometry />
      <meshStandardMaterial transparent={true} opacity={0} />
      <Edges scale={1} renderOrder={1000} lineWidth={2} color={"orange"} />
    </mesh>
  );
}

useGLTF.preload("/assets/seats.glb");
