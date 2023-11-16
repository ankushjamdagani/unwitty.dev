import {
  Environment,
  OrbitControls,
  useMatcapTexture,
  useTexture,
} from "@react-three/drei";
import { Perf } from "r3f-perf";
import * as THREE from "three";
import Box from "../components/Box";

function DefaultScene() {
  // const landRockTexture = useTexture({ map: "./textures/Material_2077.jpg" });
  const [matcapTexture] = useMatcapTexture("7B5254_E9DCC7_B19986_C8AC91", 256);

  return (
    <>
      <color args={["#edf7fc"]} attach="background" />
      {/* <Environment preset="city" /> */}
      <Environment preset="city" resolution={256} background blur={1} />
      <Perf position="top-left" />

      <OrbitControls makeDefault />
      <Box />
      <mesh rotation-x={-Math.PI / 2}>
        <boxGeometry args={[8, 8, 0.2, 10, 10, 2]} />
        <meshMatcapMaterial matcap={matcapTexture} />
        {/* <meshStandardMaterial
          color={"#d9b7a5"}
          map={matcapTexture}
          // {...landRockTexture}
        /> */}
        {/* <shaderMaterial
          uniforms={{
            uTime: { value: 0 },
            uColorStart: { value: new THREE.Color("#ffffff") },
            uColorEnd: { value: new THREE.Color("#000000") },
          }}
          vertexShader={"portalVertexShader"}
          fragmentShader={"portalFragmentShader"}
        /> */}
      </mesh>

      <axesHelper args={[5]} />

      <gridHelper args={[10, 10, "#84cdee", "#84cdee"]} />
    </>
  );
}

export default DefaultScene;
