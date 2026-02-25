import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { useRef } from "react";

// Движение камеры для параллакса
function CameraMotion() {
  const t = useRef(0);
  const { camera } = useThree(); // <--- получаем камеру отсюда
  useFrame(() => {
    t.current += 0.002;
    camera.position.x = Math.sin(t.current) * 2;
    camera.position.y = Math.sin(t.current / 2) * 1.5;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function Background3D() {
  return (
    <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={0.3}
      />
      <CameraMotion />
    </Canvas>
  );
}