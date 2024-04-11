import { PLAYER_CAMERA, useCameraStore } from "../store/cameraStore";
import { Model } from "./wall-roof.glb";
import { RigidBody } from "@react-three/rapier";

export default function Roof(props) {
    const currentCamera = useCameraStore((state) => state.currentCamera);

    return (
        <>
            <Model visible={currentCamera === PLAYER_CAMERA} { ...props}/>
        </>
        
        // <RigidBody
        //     type="fixed"
        //     ccd
        //     visible={currentCamera === PLAYER_CAMERA}
        //     {...props}
        // >
        //     <Model  />
        // </RigidBody>
    );
}
