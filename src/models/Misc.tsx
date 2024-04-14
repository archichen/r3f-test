import React, { useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Object3D, Object3DEventMap } from "three";
import { CuboidCollider, RigidBody } from "@react-three/rapier";

export default function Misc(props) {
    const { scene, nodes } = useGLTF("/assets/misc.glb");

    useEffect(() => {
    }, [nodes])

    useFrame((_, delta) => {
        door_animation(nodes, delta);
    });

    const handleDoorSensorEnter = () => {
        doorAnimationProps.isAnyoneThere = true;
    }
    const handleDoorSensorExit = () => {
        doorAnimationProps.isAnyoneThere = false;
    }

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
                <primitive material-opacity={0} material-transparent={true} object={nodes.door_sensor} />
            </RigidBody>
        </>
    )
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
    animationSpeedCoefficient: .8,
    doorDistance: .9
}
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
        door_left.position.lerp({
            x: doorAnimationProps.left_door_initial_x - doorAnimationProps.doorDistance,
            y: door_left.position.y,
            z: door_left.position.z
        }, delta * doorAnimationProps.animationSpeedCoefficient);
        door_right.position.lerp({
            x: doorAnimationProps.right_door_initial_x + doorAnimationProps.doorDistance,
            y: door_right.position.y,
            z: door_right.position.z
        }, delta * doorAnimationProps.animationSpeedCoefficient);
    } {
        door_left.position.lerp({
            x: doorAnimationProps.left_door_initial_x,
            y: door_left.position.y,
            z: door_left.position.z
        }, delta * doorAnimationProps.animationSpeedCoefficient);
        door_right.position.lerp({
            x: doorAnimationProps.right_door_initial_x,
            y: door_right.position.y,
            z: door_right.position.z
        }, delta * doorAnimationProps.animationSpeedCoefficient);
    }
}

useGLTF.preload("/assets/misc.glb")