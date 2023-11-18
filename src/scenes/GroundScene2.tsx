import { useControls } from "leva";

function GroundScene2() {
  const { color: planeColor } = useControls("Plane", {
    color: "lightgreen",
  });
  return (
    <>
      <mesh>
        <boxGeometry args={[10, 0.2, 10]} />
        <meshStandardMaterial color={planeColor} />
      </mesh>
    </>
  );
}

export default GroundScene2;
