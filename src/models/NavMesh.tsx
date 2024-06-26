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
        opacity: 1,
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

        const point = pathfinding.getClosestNode(targetPosition, ZONE, groupID)
        console.log("closestNode: ", point);

        let p = pathfinding.findPath(
            startPosition,
            point.centroid,
            ZONE,
            groupID
        );
        if (p && p.length) {
            phelper.setPath(p);
            console.log("validate path: ", p)
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

            console.log("validate clampStep: ", clamped)

            phelper.setStepPosition(clamped);


        }
    }, [startPosition, targetPosition]);

    const handleClick = (e) => {
        console.log("Clicked point: ", e.point)
    }

    return (
        <group {...props}>
            <mesh
                geometry={navmesh.geometry}
                onClick={handleClick}
                material={
                    new THREE.MeshBasicMaterial({
                        color: "white",
                        opacity: opacity,
                        transparent: true,
                    })
                }
            ></mesh>
            <boxGeometry args={[10, 10]}  />
        </group>
    );
}

useGLTF.preload("/assets/navmesh.glb");
