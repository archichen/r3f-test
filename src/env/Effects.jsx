import { Sky } from "@react-three/drei";
import {
  EffectComposer,
  N8AO,
  Outline,
  TiltShift2,
  ToneMapping,
} from "@react-three/postprocessing";

export default function Effects() {
  return (
    <>
      <EffectComposer
        stencilBuffer
        // disableNormalPass
        autoClear={false}
        // multisampling={4}
      >
        {/* <N8AO
          halfRes
          aoSamples={5}
          aoRadius={0.4}
          distanceFalloff={0.75}
          intensity={2}
        /> */}
        <Outline
          visibleEdgeColor="white"
          hiddenEdgeColor="white"
          blur
        //   width={0}
          edgeStrength={10}
        />
        {/* <TiltShift2 samples={5} blur={0.1} /> */}
        <ToneMapping />
      </EffectComposer>
    </>
  );
}
