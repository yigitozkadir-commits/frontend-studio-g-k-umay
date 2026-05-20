// ============================================================
// AI Frontend Studio — Snippet Kütüphanesi
// Araç: pmndrs/react-three-fiber (id: 13) + drei (id: 42)
// Kaynak: https://github.com/pmndrs/react-three-fiber
// ============================================================
"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Float,
  Text3D,
  useGLTF,
  MeshDistortMaterial,
} from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from "three";

// ----------------------------------------------------------
// 1. TEMEL SAHNE ŞABLONU
// ----------------------------------------------------------
export function BasicScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      style={{ width: "100%", height: "100vh" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      <Environment preset="studio" />
      <ContactShadows position={[0, -1.5, 0]} opacity={0.4} blur={2} />
      <Suspense fallback={null}>
        <RotatingBox />
      </Suspense>
    </Canvas>
  );
}

// ----------------------------------------------------------
// 2. DÖNEN KÜRE (distort materyal ile)
// ----------------------------------------------------------
export function RotatingBox() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} castShadow>
        <icosahedronGeometry args={[1.2, 4]} />
        <MeshDistortMaterial
          color="#6366f1"
          distort={0.3}
          speed={2}
          roughness={0}
          metalness={0.1}
        />
      </mesh>
    </Float>
  );
}

// ----------------------------------------------------------
// 3. GLTF MODEL YÜKLEME
// ----------------------------------------------------------
export function GLTFModel({ url, scale = 1 }: { url: string; scale?: number }) {
  const { scene } = useGLTF(url);
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.3;
  });

  return <primitive ref={ref} object={scene} scale={scale} dispose={null} />;
}

// ----------------------------------------------------------
// 4. 3D METİN
// ----------------------------------------------------------
export function Heading3D({ text, color = "#ffffff" }: { text: string; color?: string }) {
  return (
    <Text3D
      font="/fonts/inter_bold.json"
      size={0.5}
      height={0.1}
      curveSegments={12}
      bevelEnabled
      bevelThickness={0.02}
      bevelSize={0.01}
    >
      {text}
      <meshStandardMaterial color={color} metalness={0.5} roughness={0.2} />
    </Text3D>
  );
}

// ----------------------------------------------------------
// 5. FARE PARALLAKSİ
// ----------------------------------------------------------
export function useMouseParallax(strength = 0.3) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = THREE.MathUtils.lerp(
      ref.current.rotation.y,
      state.pointer.x * strength,
      0.05
    );
    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      -state.pointer.y * strength,
      0.05
    );
  });

  return ref;
}
