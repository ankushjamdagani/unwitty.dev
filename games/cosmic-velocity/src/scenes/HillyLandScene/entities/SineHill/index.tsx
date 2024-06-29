import {
  HeightfieldArgs,
  HeightfieldCollider,
  RigidBody,
} from "@react-three/rapier";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

function SineHill() {
  const planeRef = useRef();

  // ! For some reason collider formed is rotated on y-axis.
  // ! Hence, un-rotating it again by 90deg
  const colliderRotation = useMemo(() => {
    const rotateDeg = new THREE.Vector3(0, Math.PI / 2, 0);
    const rotateEuler = new THREE.Euler();
    rotateEuler.setFromVector3(rotateDeg);
    return rotateEuler;
  }, []);
  const [heightFieldArgs, setHeightFieldArgs] = useState<HeightfieldArgs>();

  useLayoutEffect(() => {
    if (!planeRef.current) return;

    const planeMesh = planeRef.current as THREE.Mesh;
    const planeMeshGeometry = planeMesh.geometry;
    const uvAttributes = planeMeshGeometry.getAttribute("uv");
    const positionAttributes = planeMeshGeometry.getAttribute("position");

    for (let i = 0; i < uvAttributes.count; i++) {
      uvAttributes.setZ(i, Math.random());
    }

    for (let i = 0; i < positionAttributes.count; i++) {
      const posX = positionAttributes.getX(i);
      const posY = positionAttributes.getY(i);

      const heightOfVertex = Math.sin(posX) / 4 + Math.cos(posY) / 4;
      positionAttributes.setZ(i, heightOfVertex);
    }

    // effects lighting
    planeMeshGeometry.computeVertexNormals();

    const { width, height, widthSegments, heightSegments } =
      planeMeshGeometry.parameters;

    const heights = [];
    for (let i = 0; i < positionAttributes.count; i++) {
      heights.push(positionAttributes.getZ(i));
    }

    setHeightFieldArgs([
      widthSegments,
      heightSegments,
      heights,
      new THREE.Vector3(width, 1, height),
    ]);
  }, []);

  return (
    <>
      <RigidBody type="fixed" colliders={false}>
        <mesh
          ref={planeRef}
          receiveShadow
          castShadow
          // position={[0, -0.01, 0]}
          rotation-x={-Math.PI * 0.5}
        >
          <planeGeometry args={[64, 64, 64, 64]} />
          <meshStandardMaterial color={"red"} />
        </mesh>
        {heightFieldArgs && (
          <HeightfieldCollider
            rotation={colliderRotation}
            args={heightFieldArgs}
          />
        )}
      </RigidBody>
    </>
  );
}

export default SineHill;
