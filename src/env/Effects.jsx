import { Sky } from "@react-three/drei";
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
import { useMemo } from "react";

export default function Effects() {
  console.log(document.focusSeat)
  return (
    <>
      <EffectComposer
        stencilBuffer
        disableNormalPass
        autoClear={false}
        multisampling={4}
      >
        {/* <N8AO
          halfRes
          aoSamples={100}
          aoRadius={0.4}
          distanceFalloff={0.75}
          intensity={2}
        /> */}
        {/* <TiltShift2 samples={5} blur={0.1} /> */}
        {/* <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} /> */}
        {/* <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} /> */}
        {/* <Noise opacity={0.02} /> */}
        {/* <Vignette eskil={false} offset={0.1} darkness={1.1} /> */}
        {/* <Outline 
          selection={[document.focusSeat ? <mesh></mesh>: document.focusSeat]}
        /> */}
        <ToneMapping />
      </EffectComposer>
    </>
  );
}
