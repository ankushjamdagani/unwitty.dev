import { useFrame } from "@react-three/fiber";
import { HeightfieldCollider, Physics, RigidBody } from "@react-three/rapier";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
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

    // console.log(positionAttributes.array.length);

    // for (let i = 0; i < positionAttributes.array.length; i += 3) {
    //   const posX = positionAttributes.getX(i);
    //   const posY = positionAttributes.getY(i);

    //   positionAttributes.setZ(i, Math.sin(posX) / 4 + Math.cos(posY) / 4);
    //   // positionAttributes.setZ(i, Math.sin(i) / 20);
    // }

    // const { widthSegments, heightSegments } = planeMeshGeometry.parameters;
    // const heights = [];
    // for (let i = 0; i < widthSegments * heightSegments; i++) {
    //   heights.push(positionAttributes.getZ(i));
    // }

    // console.log(heights);

    // setHeightFieldArgs([
    //   widthSegments,
    //   heightSegments,
    //   heights,
    //   new THREE.Vector3(1, 1, 1),
    // ]);
  }, []);

  return (
    <Physics debug>
      <RigidBody type="fixed" colliders={false} position={[0, -0.01, 0]}>
        <mesh ref={planeRef} rotation-x={-Math.PI * 0.5} receiveShadow>
          <planeGeometry args={[20, 20, 200, 200]} />
          <meshStandardMaterial color={"orange"} transparent />
        </mesh>
        {/* <HeightfieldCollider args={heightFieldArgs} /> */}
        {/* {heightFieldArgs && <HeightfieldCollider args={heightFieldArgs} />} */}
      </RigidBody>
      <RigidBody type="fixed" colliders={"ball"}>
        <mesh rotation-x={-Math.PI * 0.5} position={[0, 4, 0]}>
          <sphereGeometry args={[0.5]} />
          <meshStandardMaterial color={"red"} />
        </mesh>
      </RigidBody>
    </Physics>
  );
}

export default HillyLandScene;
