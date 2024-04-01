import { Box, Detailed } from "@react-three/drei";
import React, { useState } from "react";
import { Model } from "./seats.glb";
import { Select } from "@react-three/postprocessing";

export default function SeatWapper({ seats }) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isPopAlert, setIsPopAlert] = useState(false);
  return (
    <group>
      {seats().props.children.map((child, index) => {
        return (
          <Select
            key={index}
            enabled={selectedIndex === index}
            onPointerOver={() => setSelectedIndex(index)}
            onPointerOut={() => setSelectedIndex(-1)}
            onClick={() => setSelectedIndex(index)}
          >
            {child}
          </Select>
        );
      })}
    </group>
  );
}
