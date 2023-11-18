import { useControls } from "leva";

function GrassLandScene() {
  const { color: planeColor } = useControls("Plane", {
    color: "#ffcf6c",
  });
  return (
    <>
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[10, 0.2, 10]} />
        <meshStandardMaterial color={planeColor} />
      </mesh>
    </>
  );
}

export default GrassLandScene;
