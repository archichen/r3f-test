import { Box, OrbitControls, Plane, useHelper } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { DirectionalLightHelper } from "three";

export default function App2() {
  return (
    <Canvas style={{ width: "100vw", height: "100vh" }} shadows shadowMap>
      <Lights />
      <Box position={[0, 5, 0]} scale={3} castShadow={true}>
        <meshStandardMaterial attach={"material"} color={"white"} />
        </Box>
      <Plane
        position={[0, 3, 0]}
        scale={10}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow={true}
        castShadow={true}
      >
        <meshStandardMaterial attach={"material"} color={"white"} />
        </Plane>

      <OrbitControls />
    </Canvas>
  );
}

function Lights() {
  const dl = useRef();
  useHelper(dl, DirectionalLightHelper, 10, "red");
  return (
    <>
      <directionalLight ref={dl} position={[0, 10, 0]} castShadow={true}/>
    </>
  );
}

export function Untitled() {
    return (
      <>
        <mesh castShadow={true} position={[0, 0.7, 0]}>
          <boxGeometry />
          <meshStandardMaterial />
        </mesh>
        <mesh
          position={[0, 0.04, -1.1]}
          scale={[3.14, 2.98, 1]}
          receiveShadow={true}
        >
          <meshStandardMaterial />
          <planeGeometry></planeGeometry>
        </mesh>
        <directionalLight position={[0, 1.88, 3.04]} castShadow={true} />
      </>
    );
  }
  
