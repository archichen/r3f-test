import { PivotControls, SoftShadows, useHelper } from "@react-three/drei";
import { useControls } from "leva";
import { useMemo, useRef } from "react";
import { BoxGeometry, DirectionalLightHelper, Vector3 } from "three";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";

export default function Lighters() {
    const directLight1 = useRef();
    const directLight2 = useRef();
    const directLight3 = useRef();
    useHelper(directLight1, DirectionalLightHelper, 1, "red");
    useHelper(directLight2, DirectionalLightHelper, 1, "red");
    useHelper(directLight3, DirectionalLightHelper, 1, "red");

    const { 
      light1_pos, 
      light2_pos, 
      light3_pos
      
    } = useControls("Light", {
        light1_pos: [-20, 55, 50],
        light2_pos: [38, 55, -66],
        light3_pos: [-70, 55, -40],
    });

    // TODO: Fix shadow problems
    return (
        <>
            <SoftShadows />
            <directionalLight
                ref={directLight1}
                intensity={2}
                color={"#FFFFFF"}
                castShadow
                scale={5}
                shadow-bias={-0.0004}
                position={light1_pos}
                shadow-camera-top={20}
                shadow-camera-right={20}
                shadow-camera-bottom={-20}
                shadow-camera-left={-20}
            />
            <directionalLight
                ref={directLight2}
                intensity={1}
                color={"#FFFFFF"}
                castShadow
                scale={5}
                shadow-bias={-0.0004}
                position={light2_pos}
                shadow-camera-top={20}
                shadow-camera-right={20}
                shadow-camera-bottom={-20}
                shadow-camera-left={-20}
            />
            <directionalLight
                ref={directLight3}
                intensity={1}
                color={"#FFFFFF"}
                castShadow
                scale={5}
                shadow-bias={-0.0004}
                position={light3_pos}
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
                <LightWithHelper
                    position={vec}
                    key={index}
                    target-position={[vec.x, -1, vec.z]}
                    intensity={1}
                    scale={0.1}
                />
            ))}
        </>
    );
}

function LightWithHelper(props) {
    const ref = useRef();
    useHelper(ref, RectAreaLightHelper, 1, "red");
    return (
        <>
            {/* <spotLight 
            ref={ref} 
            {...props} 
            /> */}
            <rectAreaLight ref={ref} castShadow={true} position={[1, 1, 1]} />
        </>
    );
}
