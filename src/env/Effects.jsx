import {
  AccumulativeShadows,
  Environment,
  Float,
  Lightformer,
  RandomizedLight,
  Sky,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  N8AO,
  Noise,
  Outline,
  TiltShift2,
  ToneMapping,
  Vignette,
} from "@react-three/postprocessing";
import { useMemo, useRef } from "react";

export default function Effects() {
  return (
    <>
      <EffectComposer
        stencilBuffer
        disableNormalPass
        autoClear={false}
        multisampling={4}
      >
        <N8AO
          halfRes
          aoSamples={10}
          aoRadius={.5}
          distanceFalloff={.75}
          intensity={2}
        />
        {/* <TiltShift2 samples={5} blur={0.1} /> */}
        <ToneMapping />
      </EffectComposer>

      <AccumulativeShadows
        position={[0, -1.16, 0]}
        frames={100}
        alphaTest={0.9}
        scale={10}
      >
        <RandomizedLight
          amount={8}
          radius={10}
          ambient={0.5}
          position={[1, 5, -1]}
        />
      </AccumulativeShadows>
    </>
  );
}
