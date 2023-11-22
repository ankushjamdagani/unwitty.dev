import { Ring } from "@react-three/drei";

function PlanetRings() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <Ring args={[20, 24, 64, 8, 0, Math.PI * 2]} />
        <meshStandardMaterial color={"red"} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <Ring args={[17.5, 19.5, 64, 8, 0, Math.PI * 2]} />
        <meshStandardMaterial color={"red"} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <Ring args={[24.5, 25.5, 64, 8, 0, Math.PI * 2]} />
        <meshStandardMaterial color={"red"} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <Ring args={[26, 26.2, 64, 8, 0, Math.PI * 2]} />
        <meshStandardMaterial color={"red"} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <Ring args={[26.5, 27, 64, 8, 0, Math.PI * 2]} />
        <meshStandardMaterial color={"red"} metalness={10} />
      </mesh>
    </>
  );
}

export default PlanetRings;
