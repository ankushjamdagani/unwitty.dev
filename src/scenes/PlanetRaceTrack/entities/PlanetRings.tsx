import { Plane, Ring } from "@react-three/drei";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import { useControls } from "leva";
import * as THREE from "three";

function GroundBasePolar() {
  const radius = 32;
  const sectors = 16;
  const rings = 8;
  const divisions = 64;
  return <polarGridHelper args={[radius, sectors, rings, divisions]} />;
}

function PlanetRings() {
  const { color } = useControls("Rings", { color: "#9c9edb" });

  const material = new THREE.MeshStandardMaterial({
    color: color,
    opacity: 0.5,
    transparent: true,
  });

  const mapSize = new THREE.Vector3(100, 1, 100);

  return (
    <>
      <RigidBody type="fixed" colliders={false}>
        <group>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <Ring args={[20, 24, 64, 8, 0, Math.PI * 2]} material={material} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <Ring
              args={[17.5, 19.5, 64, 8, 0, Math.PI * 2]}
              material={material}
            />
            <meshStandardMaterial color={"red"} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <Ring
              args={[24.5, 25.5, 64, 8, 0, Math.PI * 2]}
              material={material}
            />
            <meshStandardMaterial color={"red"} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <Ring
              args={[26, 26.2, 64, 8, 0, Math.PI * 2]}
              material={material}
            />
            <meshStandardMaterial color={"red"} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <Ring
              args={[26.5, 27, 64, 8, 0, Math.PI * 2]}
              material={material}
            />
          </mesh>
        </group>
        <CuboidCollider args={[...mapSize]} />
      </RigidBody>
      <GroundBasePolar />
    </>
  );
}

export default PlanetRings;
