import { Box, Detailed } from "@react-three/drei";
import React, { useState } from "react";
import { Model } from "./seats.glb";
// import { Model } from "./seats-conbined.glb";
import { Select } from "@react-three/postprocessing";
import { CuboidCollider, RigidBody } from "@react-three/rapier";

export default function SeatWapper({ seats }) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isPopAlert, setIsPopAlert] = useState(false);
  return (
    <group>
      {seats().props.children.map((child, index) => {
        return (
          <RigidBody type="fixed" scale={5} key={index}>
            <Select
              key={index}
              enabled={selectedIndex === index}
              onPointerOver={() => setSelectedIndex(index)}
              onPointerOut={() => setSelectedIndex(-1)}
              onClick={() => setSelectedIndex(index)}
            >
              {child}
            </Select>
            <CuboidCollider args={[0.1, 0.1, 0.1]} />
          </RigidBody>
        );
      })}
    </group>
  );
}
