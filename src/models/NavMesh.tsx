import { useNavStore } from "@/store/navStore";
import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useControls } from "leva";
import React, { useEffect } from "react";
import { Vector3 } from "three";
import * as THREE from "three";
import { Pathfinding, PathfindingHelper } from "three-pathfinding";

let pathfinding = new Pathfinding();
let phelper = new PathfindingHelper();

export default function NavMesh(props) {
    const {
        scene,
        nodes: { navmesh = null },
        materials,
    } = useGLTF("/assets/navmesh.glb");

    const { opacity } = useControls("NavMesh", {
        opacity: 0,
    });

    const ZONE = "level1";

    const _three = useThree();

    useEffect(() => {
        // apply scale
        const scaleMatrix = new THREE.Matrix4().makeScale(
            props.scale,
            props.scale,
            props.scale
        ); // 假设scale是作为prop传递的
        const scaledGeometry = navmesh.geometry
            .clone()
            .applyMatrix4(scaleMatrix);

        // apply position offset
        const positionMatrix = new THREE.Matrix4().makeTranslation(
            props.position[0],
            props.position[1],
            props.position[2]
        );
        const offsetGeometry = scaledGeometry
            .clone()
            .applyMatrix4(positionMatrix);

        // pathfinding.setZoneData(ZONE, Pathfinding.createZone(navmesh.geometry));
        pathfinding.setZoneData(ZONE, Pathfinding.createZone(offsetGeometry));

        _three.scene.add(phelper);
    }, []);

    const startPosition = useNavStore((state) => state.startPosition);
    const targetPosition = useNavStore((state) => state.targetPosition);

    useEffect(() => {
        if (!pathfinding) return;

        console.log("re-plan path")

        phelper.setPlayerPosition(startPosition);
        phelper.setTargetPosition(targetPosition);

        let targetGroupID = pathfinding.getGroup(ZONE, targetPosition);
        const closestTargetNode = pathfinding.getClosestNode(
            targetPosition,
            ZONE,
            targetGroupID,
            true
        );
        if (closestTargetNode)
            phelper.setNodePosition(closestTargetNode.centroid);

        let groupID = pathfinding.getGroup(ZONE, startPosition);
        let p = pathfinding.findPath(
            startPosition,
            targetPosition,
            ZONE,
            groupID
        );
        if (p && p.length) {
            phelper.setPath(p);
        } else {
            const closestPlayerNode = pathfinding.getClosestNode(
                startPosition,
                ZONE,
                groupID
            );
            const clamped = new Vector3();

            // TODO(donmccurdy): Don't clone targetPosition, fix the bug.
            pathfinding.clampStep(
                startPosition,
                targetPosition.clone(),
                closestPlayerNode,
                ZONE,
                groupID,
                clamped
            );

            phelper.setStepPosition(clamped);
        }
    }, [startPosition, targetPosition]);

    return (
        <group {...props}>
            <mesh
                geometry={navmesh.geometry}
                material={
                    new THREE.MeshBasicMaterial({
                        color: "red",
                        opacity: opacity,
                        transparent: true,
                    })
                }
            ></mesh>
        </group>
    );
}

useGLTF.preload("/assets/navmesh.glb");
