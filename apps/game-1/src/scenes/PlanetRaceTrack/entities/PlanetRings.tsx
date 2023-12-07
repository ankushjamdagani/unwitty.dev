import { Ring } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useControls } from "leva";
import * as THREE from "three";

function GroundBasePolar() {
  const radius = 32;
  const sectors = 16;
  const rings = 8;
  const divisions = 64;
  return <polarGridHelper args={[radius, sectors, rings, divisions]} />;
}

function generateNumberPairs(startRange, endRange, numPairs) {
  // [50, 60, 70, 80, 90, 100]
  return [
    [52, 55],
    [57, 57.5],
    [60, 65],
    [67, 68],
    [70, 80],
    [82, 83],
    [85, 90],
    [92.5, 93],
    [95, 98],
    [99, 99.5],
  ];
}

function PlanetRings({ config }) {
  const { color } = useControls("Rings", { color: "#9c9edb" });

  const material = new THREE.MeshStandardMaterial({
    color: color,
    opacity: 0.5,
    transparent: true,
  });

  const mapScale = config.map.scale;
  const mapSize = config.map.size;
  const planetSize = config.entities.planet.size;
  const numberOfGrids = 5;

  const gridLinesRadius = generateNumberPairs(
    planetSize,
    mapScale,
    numberOfGrids
  );

  return (
    <>
      <RigidBody type="fixed" rotation={[-Math.PI / 2, 0, 0]} colliders={false}>
        {/* <group>
          <mesh>
            <Ring args={[20, 24, 64, 8, 0, Math.PI * 2]} material={material} />
          </mesh>
          <mesh>
            <Ring
              args={[17.5, 19.5, 64, 8, 0, Math.PI * 2]}
              material={material}
            />
            <meshStandardMaterial color={"red"} />
          </mesh>
          <mesh>
            <Ring
              args={[24.5, 25.5, 64, 8, 0, Math.PI * 2]}
              material={material}
            />
            <meshStandardMaterial color={"red"} />
          </mesh>
          <mesh>
            <Ring
              args={[26, 26.2, 64, 8, 0, Math.PI * 2]}
              material={material}
            />
            <meshStandardMaterial color={"red"} />
          </mesh>
          <mesh>
            <Ring
              args={[26.5, 27, 64, 8, 0, Math.PI * 2]}
              material={material}
            />
          </mesh>
        </group> */}

        <group>
          {gridLinesRadius.map((grid, index) => (
            <mesh key={index}>
              <Ring
                args={[grid[0], grid[1], 100, 20, 0, Math.PI * 2]}
                material={material}
              />
            </mesh>
          ))}
        </group>
        <CuboidCollider args={[...mapSize]} rotation={[-Math.PI / 2, 0, 0]} />
      </RigidBody>
      <GroundBasePolar />
    </>
  );
}

export default PlanetRings;
