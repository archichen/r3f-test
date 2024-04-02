import React, { useMemo, useRef, useState } from "react";
import { Box, Instance, Instances, Merged, useGLTF } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { Select } from "@react-three/postprocessing";

export function Model(props) {
  const { nodes } = useGLTF("/assets/seats.glb");
  const [selectedIndex, setSelectedIndex] = useState(-1);

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

  return (
    <>
      <Merged meshes={meshs}>
        {(models) => {
          return (
            <group position={[0, 0, 0]} scale={5}>
              {seats.map((seat, index) => {
                // console.log(seat.position);
                return (
                  <RigidBody key={index} type="fixed">
                    <group
                      key={index}
                      position={seat.position}
                      scale={seat.scale}
                      quaternion={seat.quaternion}
                      rotation={seat.rotation}
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
                    {console.log('Merged re-render')}
                    <CuboidCollider
                      args={[1, 1, 1]}
                      position={seat.position}
                      scale={0.2}
                    />
                  </RigidBody>
                );
              })}
            </group>
          );
        }}
      </Merged>
      {/* TODO: 优化渲染效率问题 */}
      <Select
        enabled={selectedIndex === 1}
        onPointerOver={() => setSelectedIndex(1)}
        onPointerLeave={() => setSelectedIndex(-1)}
      >
        <Box position={seats[0].position} scale={5} />
      </Select>
    </>
  );
}

// function SelectableBox(props) {
//   const [selectedIndex, setSelectedIndex] = useState(-1);

//   return (
//     <group {...props}>
//       <Select
//         enabled={selectedIndex === props.index}

//       >
//         <Box />
//       </Select>
//     </group>
//   );
// }
useGLTF.preload("/assets/seats.glb");
