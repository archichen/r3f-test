import { Canvas, extend } from "@react-three/fiber";
import {
  Box,
  Bvh,
  GizmoHelper,
  KeyboardControls,
  OrbitControls,
  PointerLockControls,
  ScrollControls,
  Sky,
  Stage,
  useHelper,
} from "@react-three/drei";
import { Perf } from "r3f-perf";
import { Model as Wall } from "./components/wall.glb";
// import { Model as Seats } from "./components/seats.glb";
// import { Model as Seats } from "./components/seats-conbined.glb";
import { Model as Seats } from "./components/Seats";
import { Model as Misc } from "./components/misc.glb";
import { Model as CharacterModel } from "./components/Demon.glb";
import { Suspense, useEffect, useRef } from "react";
import {
  EffectComposer,
  Selection,
  Outline,
  N8AO,
  TiltShift2,
  ToneMapping,
} from "@react-three/postprocessing";
import { Physics, RigidBody } from "@react-three/rapier";
import Ecctrl, { EcctrlAnimation, EcctrlJoystick } from "ecctrl";
import SeatWapper from "./components/SeatWapper";
import { DirectionalLightHelper } from "three";
import Lighters from "./env/Lighters";
import Effects from "./env/Effects";
import { isMobile } from "react-device-detect";

function App() {
  const keyboardMap = [
    { name: "forward", keys: ["ArrowUp", "KeyW"] },
    { name: "backward", keys: ["ArrowDown", "KeyS"] },
    { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
    { name: "rightward", keys: ["ArrowRight", "KeyD"] },
    { name: "jump", keys: ["Space"] },
    { name: "run", keys: ["Shift"] },
    { name: "action1", keys: ["1"] },
    { name: "action2", keys: ["2"] },
    { name: "action3", keys: ["3"] },
    { name: "action4", keys: ["KeyF"] },
  ];

  /**
   * Character url preset
   */
  const characterURL = "./assets/Demon.glb";

  /**
   * Character animation set preset
   */
  const animationSet = {
    idle: "CharacterArmature|Idle",
    walk: "CharacterArmature|Walk",
    run: "CharacterArmature|Run",
    jump: "CharacterArmature|Jump",
    jumpIdle: "CharacterArmature|Jump_Idle",
    jumpLand: "CharacterArmature|Jump_Land",
    fall: "CharacterArmature|Duck", // This is for falling from high sky
    action1: "CharacterArmature|Wave",
    action2: "CharacterArmature|Death",
    action3: "CharacterArmature|HitReact",
    action4: "CharacterArmature|Punch",
  };

  const player = useRef();

  const reset = () => {
    player.current.setTranslation({ x: 15, y: 10, z: 0 });
    player.current.setLinvel({ x: 0, y: 0, z: 0 });
    player.current.setAngvel({ x: 0, y: 0, z: 0 });
  };

  useEffect(() => {
    setTimeout(() => {
      // player.current.s
    }, 2000);
  });

  return (
    <div id="canvas-container">
      <button
        style={{
          zIndex: 1000,
          position: "absolute",
          bottom: "10px",
          right: "10px",
        }}
        onClick={reset}
      >
        Reset
      </button>

      {isMobile && <EcctrlJoystick />}

      <Canvas
        style={{ height: "100vh", width: "100vw" }}
        camera={
          {
            // near: 0.1,
            // far: 20
          }
        }
        shadows
      >
        <Sky />
        <Perf position="top-left" />
        <Lighters />
        <Effects />

        <Suspense fallback={null}>
          <Bvh firstHitOnly>
            <Physics timeStep={"vary"}>
              <KeyboardControls map={keyboardMap}>
                <Ecctrl
                  ref={player}
                  debug
                  animated
                  position={[15, 20, 0]}
                  capsuleRadius={0.5}
                  capsuleHalfHeight={0.3}
                  // type="fixed"
                >
                  <EcctrlAnimation
                    characterURL={characterURL}
                    animationSet={animationSet}
                  >
                    <CharacterModel scale={0.4} position={[0, -0.6, 0]} />
                  </EcctrlAnimation>
                </Ecctrl>
              </KeyboardControls>

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

              {/* <RigidBody type="fixed" ccd scale={5}>
                <Misc />
              </RigidBody> */}
            </Physics>
          </Bvh>
        </Suspense>
        {/* <PointerLockControls /> */}
        {/* <OrbitControls /> */}
      </Canvas>
    </div>
  );
}

export default App;
