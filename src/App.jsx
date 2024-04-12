import { Canvas } from "@react-three/fiber";
import {
    Bvh,
    Effects,
    Sky,
} from "@react-three/drei";
import { Perf } from "r3f-perf";
import { Model as Wall } from "./models/wall.glb";
// import { Model as Seats } from "./components/seats.glb";
// import { Model as Seats } from "./components/seats-conbined.glb";
import { Model as Seats } from "./models/Seats";
import { Suspense, useEffect, useRef } from "react";
import { Physics, RigidBody } from "@react-three/rapier";
import { EcctrlJoystick } from "ecctrl";
import Lighters from "./env/Lighters";
import { isMobile } from "react-device-detect";
import Interface from "./Interface";
import Player from "./components/Player";
import GlobalCamera from "./components/GlobalCamera";
import Roof from "./models/Roof";
import { PLAYER_CAMERA } from "./store/cameraStore";
import { isEmpty } from "lodash";

document.canvas = null;
document.camera = null;

document.addEventListener("mousedown", (e) => {
    if (e.button === 2) {
        document.exitPointerLock();
    }
})

function App() {
    const canvasRef = useRef();
    
    useEffect(() => {
        if(!isEmpty(canvasRef)) document.canvas = canvasRef.current;
    }, [canvasRef]);

    const handleCanvasClick = async () => {
        if (!isEmpty(document.canvas) && document.camera === PLAYER_CAMERA) {
            await document.canvas.requestPointerLock();
        }
    }

    return (
        <div id="canvas-container">

            <Interface />

            {isMobile && <EcctrlJoystick />}

            <Canvas
                ref={canvasRef}
                style={{ height: "100vh", width: "100vw" }}
                performance={{ min: 0.1 }}
                frameloop="always"
                shadows
                flat={true}
                dpr={[1, 2]}
                gl={{
                    antialias: false,
                }}
                onClick={handleCanvasClick}
                // camera={{
                //     manual: true
                // }}
            >
                <Sky />
                <Perf position="top-left" />
                <Lighters />
                {/* <Effects /> */}
                <GlobalCamera />

                <Suspense fallback={null}>
                    <Bvh firstHitOnly>
                        <Physics timeStep={"vary"}>
                            <Player />    

                            <Roof scale={5} />

                            <RigidBody
                                type="fixed"
                                colliders="trimesh"
                                ccd
                                rotation={[0, 0, 0]}
                                scale={5}
                            >
                                <Wall />
                            </RigidBody>

                            <Seats />

                            {/* TODO: 优化杂七杂八组件的碰撞和渲染，默认碰撞太吃性能 */}
                            {/* <RigidBody type="fixed" ccd scale={5}>
                                    <Misc />
                                </RigidBody> */}
                        </Physics>
                    </Bvh>
                </Suspense>
            </Canvas>
        </div>
    );
}

export default App;
