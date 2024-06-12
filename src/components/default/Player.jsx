import { KeyboardControls } from "@react-three/drei";
import Ecctrl, { EcctrlAnimation } from "ecctrl";
import { useEffect, useRef } from "react";
import { Model as CharacterModel } from "../../models/Demon.glb";
import {
    ORBIT_CAMERA,
    PLAYER_CAMERA,
    useCameraStore,
} from "../../store/cameraStore";
import {useNavStore} from "../../store/navStore";
import { useRafInterval } from "ahooks";
import { Vector3 } from "three";

export default function Player() {
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

    const currentCamera = useCameraStore((state) => state.currentCamera);
    const setPlayerPosition = useCameraStore(
        (state) => state.setPlayerPosition
    );
    useEffect(() => {
        const { x, y, z } = player.current.translation();
        setPlayerPosition([x, y, z]);
    }, [currentCamera]);


    // TODO: optimize code and logic
    const setStartPosition = useNavStore(state => state.setStartPosition);

    useRafInterval(() => {
        const { x, z } = player.current.translation();
        setStartPosition(new Vector3(x, -2.5, z));
    }, 1000);

    return (
        <KeyboardControls
            map={currentCamera === PLAYER_CAMERA ? keyboardMap : []}
        >
            {/* TODO: 调整Ecctrl 组件参数，解决 Player 漂浮问题 */}
            {/* BUG: 在某些设备上，全屏状态切换时会导致 Player 碰撞异常然后掉下去。该问题和帧率有关。 */}
            <Ecctrl
                ref={player}
                // debug
                animated
                position={[-6, 10, -5.5]}
                capsuleRadius={0.5}
                capsuleHalfHeight={0.3}
                castShadow={true}
                receiveShadow={true}
                // type="fixed"
                disableFollowCam={currentCamera === ORBIT_CAMERA}
                disableFollowCamPos={{ x: 0, y: 5, z: -5 }}
                CamTarget={{ x: 0, y: 0, z: 0 }}
            >
                <EcctrlAnimation
                    characterURL={characterURL}
                    animationSet={animationSet}
                >
                    <CharacterModel
                        castShadow={true}
                        receiveShadow={true}
                        scale={0.4}
                        position={[0, -0.6, 0]}
                    />
                </EcctrlAnimation>
            </Ecctrl>
        </KeyboardControls>
    );
}
