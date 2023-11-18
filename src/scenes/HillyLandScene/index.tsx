import { HeightfieldCollider, Physics, RigidBody } from "@react-three/rapier";
import { useLayoutEffect, useRef, useState } from "react";
import * as THREE from "three";

function HillyLandScene() {
  const planeRef = useRef();

  const [heightFieldArgs, setHeightFieldArgs] = useState();

  useLayoutEffect(() => {
    if (!planeRef.current) return;

    const planeMesh = planeRef.current as THREE.Mesh;
    const planeMeshGeometry = planeMesh.geometry;
    const uvAttributes = planeMeshGeometry.getAttribute("uv");
    const positionAttributes = planeMeshGeometry.getAttribute("position");

    for (let i = 0; i < uvAttributes.count; i++) {
      uvAttributes.setZ(i, Math.random());
    }

    console.log(planeMeshGeometry);

    for (let i = 0; i < positionAttributes.count; i++) {
      const posX = positionAttributes.getX(i);
      const posY = positionAttributes.getY(i);

      positionAttributes.setZ(i, Math.sin(posX) / 4 + Math.cos(posY) / 4);
      // positionAttributes.setZ(i, Math.sin(i) / 20);
    }

    const { width, height, widthSegments, heightSegments } =
      planeMeshGeometry.parameters;
    const heights = [];

    for (let i = 0; i < (widthSegments + 1) * (heightSegments + 1); i++) {
      heights.push(positionAttributes.getZ(i));
    }

    setHeightFieldArgs([
      widthSegments,
      heightSegments,
      heights,
      new THREE.Vector3(width + 1, 1, height + 1),
    ]);
  }, []);

  console.log(heightFieldArgs);

  return (
    <Physics debug>
      <RigidBody type="fixed" colliders={false} position={[0, -0.01, 0]}>
        <mesh
          ref={planeRef}
          rotation-x={-Math.PI * 0.5}
          receiveShadow
          castShadow
        >
          <planeGeometry args={[20, 20, 20, 20]} />
          <meshStandardMaterial color={"orange"} transparent />
        </mesh>
        {heightFieldArgs && <HeightfieldCollider args={heightFieldArgs} />}
      </RigidBody>
      <RigidBody colliders={"ball"}>
        <mesh rotation-x={-Math.PI * 0.5} position={[0, 4, 0]}>
          <sphereGeometry args={[0.5]} />
          <meshStandardMaterial color={"blue"} />
        </mesh>
      </RigidBody>
    </Physics>
  );
}

export default HillyLandScene;
