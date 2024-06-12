import React, { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
    Color,
    DoubleSide,
    Mesh,
    MeshPhysicalMaterial,
    MeshPhysicalMaterialParameters,
    Object3D,
    Object3DEventMap,
} from "three";
import { CuboidCollider, RigidBody } from "@react-three/rapier";

export default function Misc(props) {
    let { scene, nodes, materials } = useGLTF("/assets/misc.glb");

    useMemo(() => {
        const params: MeshPhysicalMaterialParameters = {
            color: 0xffffff,
            transmission: 0.9063505503810331,
            opacity: 0.9713801862828112,
            metalness: 0,
            roughness: 0.45114309906858596,
            ior: 1.52,
            thickness: 0.8,
            specularIntensity: 1,
            transparent: true,
        };

        const glassMaterial = new MeshPhysicalMaterial({
            side: DoubleSide,
            specularColor: new Color("#ffffff"),
            ...params,
        });
        glassMaterial.needsUpdate = true;

        materials["磨砂玻璃门-中间不透"] = glassMaterial;

        materials["玻璃门"] = glassMaterial;

        scene.traverse((obj) => {
            obj.traverse((obj: Mesh) => {
                if (obj.material &&  (obj.material.name === "玻璃门" || obj.material.name === "磨砂玻璃门-中间不透") ) {
                    obj.material = glassMaterial;
                }
            })
        });

    }, [materials]);

    useFrame((_, delta) => {
        door_animation(nodes, delta);
    });

    const handleDoorSensorEnter = () => {
        doorAnimationProps.isAnyoneThere = true;
    };
    const handleDoorSensorExit = () => {
        doorAnimationProps.isAnyoneThere = false;
    };

    return (
        <>
            <primitive object={scene} {...props} />
            <RigidBody
                {...props}
                type="fixed"
                sensor={true}
                onIntersectionEnter={handleDoorSensorEnter}
                onIntersectionExit={handleDoorSensorExit}
            >
                <primitive
                    material-opacity={0}
                    material-transparent={true}
                    object={nodes.door_sensor}
                />
            </RigidBody>
        </>
    );
}

interface Nodes {
    [name: string]: Object3D<Object3DEventMap>;
}
const doorAnimationProps = {
    left_door_initial_x: 0,
    right_door_initial_x: 0,
    left_door_initialed: false,
    right_door_initialed: false,
    isAnyoneThere: false,
    animationSpeedCoefficient: 0.8,
    doorDistance: 0.9,
};
function door_animation(nodes: Nodes, delta: number) {
    const { door_left, door_right } = nodes;
    if (!doorAnimationProps.left_door_initialed) {
        doorAnimationProps.left_door_initial_x = door_left.position.x;
        doorAnimationProps.left_door_initialed = true;
    }
    if (!doorAnimationProps.right_door_initialed) {
        doorAnimationProps.right_door_initial_x = door_right.position.x;
        doorAnimationProps.right_door_initialed = true;
    }

    if (doorAnimationProps.isAnyoneThere) {
        door_left.position.lerp(
            {
                x:
                    doorAnimationProps.left_door_initial_x -
                    doorAnimationProps.doorDistance,
                y: door_left.position.y,
                z: door_left.position.z,
            },
            delta * doorAnimationProps.animationSpeedCoefficient
        );
        door_right.position.lerp(
            {
                x:
                    doorAnimationProps.right_door_initial_x +
                    doorAnimationProps.doorDistance,
                y: door_right.position.y,
                z: door_right.position.z,
            },
            delta * doorAnimationProps.animationSpeedCoefficient
        );
    }
    {
        door_left.position.lerp(
            {
                x: doorAnimationProps.left_door_initial_x,
                y: door_left.position.y,
                z: door_left.position.z,
            },
            delta * doorAnimationProps.animationSpeedCoefficient
        );
        door_right.position.lerp(
            {
                x: doorAnimationProps.right_door_initial_x,
                y: door_right.position.y,
                z: door_right.position.z,
            },
            delta * doorAnimationProps.animationSpeedCoefficient
        );
    }
}

useGLTF.preload("/assets/misc.glb");
