import { SoftShadows, useHelper } from "@react-three/drei";
import { useRef } from "react";
import { DirectionalLightHelper } from "three";

export default function Lighters() {
    const directLight = useRef()
    useHelper(directLight, DirectionalLightHelper, 1, "red")
  
  // TODO: Fix shadow problems
  return (
    <>
    {/* <SoftShadows /> */}
      <directionalLight
        ref={directLight}
        intensity={3}
        color={"#FFFFED"}
        castShadow
        shadow-bias={-0.0004}
        position={[-20, 20, 20]}
        shadow-camera-top={20}
        shadow-camera-right={20}
        shadow-camera-bottom={-20}
        shadow-camera-left={-20}
      />
      <ambientLight intensity={0.2}
      />
      <hemisphereLight 
      />
    </>
  );
}
