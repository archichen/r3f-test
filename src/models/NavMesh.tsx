import { useNavStore } from "@/store/navStore";
import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useControls } from "leva";
import React, { useEffect, useRef } from "react";
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

    const { opacity, navPos, navRot, navScale } = useControls("NavMesh", {
        opacity: 0,
        navPos: [0, 0, 0],
        navRot: [1, 1, 1],
        navScale: [1, 1, 1],
    });

    const ZONE = "level1";

    const _three = useThree();

    useEffect(() => {
        // apply scale
        const scaleMatrix = new THREE.Matrix4().makeScale(
            props.nav_mesh_scale,
            props.nav_mesh_scale,
            props.nav_mesh_scale
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
            drawPathMesh(p);
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

    const group = useRef();

    const drawPathMesh = (path: Vector3[]) => {
        if (path.length == 1) {
            console.log("draw 1 point");
        } else if (path.length > 1) {
            group.current.clear();

            let startPoint = path[0];
            for (let i = 1; i < path.length - 1; i++) {
                let targetPoint = path[i];

                const geo = drawLine(startPoint, targetPoint);;

                const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
                    color: "red"
                }));
                mesh.rotation.x = -Math.PI / 2;
                mesh.rotation.z = Math.PI / 2;
                // mesh.rotation.y = Math.PI / 2;
                // mesh.rotation.y = 10;
                group.current.add(mesh)

                startPoint = targetPoint;
            }
        }
    }

    const drawLine = (start: THREE.Vector3, end: THREE.Vector3) => {
        const shape = new THREE.Shape();

          // Calculate the direction and normal vector
        const direction = new THREE.Vector3().subVectors(end, start).normalize();
        const normal = new THREE.Vector3(0, 1, 0);
        const widthVector = new THREE.Vector3().crossVectors(direction, normal).multiplyScalar(0.5);

        // Calculate the corners of the rectangle
        const p1 = new THREE.Vector3().copy(start).add(widthVector);
        const p2 = new THREE.Vector3().copy(start).sub(widthVector);
        const p3 = new THREE.Vector3().copy(end).sub(widthVector);
        const p4 = new THREE.Vector3().copy(end).add(widthVector);

        // Create a custom shape
        shape.moveTo(p1.x, p1.z);
        shape.lineTo(p2.x, p2.z);
        shape.lineTo(p3.x, p3.z);
        shape.lineTo(p4.x, p4.z);
        shape.lineTo(p1.x, p1.z);

        return new THREE.ShapeGeometry(shape);
    }

    // Create geometry from the shape
  
    return (
        <group {...props} >

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
            >            <group ref={group} position={navPos} rotation={[Math.PI / navRot[0], Math.PI /navRot[1], Math.PI /navRot[2]]} scale={navScale} />

            </mesh>
        </group>
    );
}

useGLTF.preload("/assets/navmesh.glb");
