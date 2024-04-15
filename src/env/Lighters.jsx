import { SoftShadows, useHelper } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { DirectionalLightHelper, Vector3 } from "three";

export default function Lighters() {
  const directLight = useRef();
  // useHelper(directLight, DirectionalLightHelper, 1, "red");

  // TODO: Fix shadow problems
  return (
    <>
      <SoftShadows />
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
      <ambientLight intensity={0.2} />
      <hemisphereLight />
      {/* <RoomLights /> */}
    </>
  );
}

// 根据模型大小，生成一条边的灯光测试效果
function RoomLights() {
  const vecs = useMemo(() => {
    const vecs = [];
    for (let index = -40; index < 26; index += 5) {
      vecs.push(new Vector3(index, 2.4, 25));
    }
    return vecs;
  }, []);

  return (
    <>
      {vecs.map((vec, index) => (
        <LightWithHelper position={vec}  key={index} target-position={[vec.x, -1, vec.z]} intensity={.3} scale={.1} />
      ))}
    </>
  );
}

function LightWithHelper(props) {
  const ref = useRef();
  useHelper(ref, DirectionalLightHelper, 1, "red");
  return (
    <>
      <spotLight ref={ref} {...props}  />
      {/* <rectAreaLight {...props} /> */}
    </>
  )
}
