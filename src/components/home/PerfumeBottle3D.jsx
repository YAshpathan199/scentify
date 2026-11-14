import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ScentParticles({ count = 40 }) {
  const mesh = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 3,
        Math.random() * 4 + 1,
        (Math.random() - 0.5) * 3,
      ],
      speed: 0.2 + Math.random() * 0.5,
      offset: Math.random() * Math.PI * 2,
      scale: 0.02 + Math.random() * 0.04,
    }));
  }, [count]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    particles.forEach((p, i) => {
      const y = ((p.position[1] + p.speed * t) % 5) - 0.5;
      dummy.position.set(
        p.position[0] + Math.sin(t * 0.5 + p.offset) * 0.3,
        y,
        p.position[2] + Math.cos(t * 0.4 + p.offset) * 0.3
      );
      dummy.scale.setScalar(p.scale * (0.7 + Math.sin(t * 2 + p.offset) * 0.3));
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        color="#5ec4d4"
        emissive="#3A8FA8"
        emissiveIntensity={2}
        toneMapped={false}
        transparent
        opacity={0.6}
      />
    </instancedMesh>
  );
}

function BottleBody() {
  const glassRef = useRef();

  useFrame(({ clock }) => {
    if (glassRef.current) {
      glassRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.1;
    }
  });

  const bottleShape = useMemo(() => {
    const points = [];
    // Bottom curve
    points.push(new THREE.Vector2(0, 0));
    points.push(new THREE.Vector2(0.55, 0));
    points.push(new THREE.Vector2(0.6, 0.05));
    points.push(new THREE.Vector2(0.62, 0.15));
    // Body
    points.push(new THREE.Vector2(0.63, 0.4));
    points.push(new THREE.Vector2(0.63, 1.2));
    points.push(new THREE.Vector2(0.62, 1.4));
    // Shoulder
    points.push(new THREE.Vector2(0.55, 1.55));
    points.push(new THREE.Vector2(0.4, 1.65));
    // Neck
    points.push(new THREE.Vector2(0.2, 1.75));
    points.push(new THREE.Vector2(0.18, 1.85));
    points.push(new THREE.Vector2(0.18, 2.0));
    points.push(new THREE.Vector2(0.2, 2.05));
    points.push(new THREE.Vector2(0.2, 2.1));
    points.push(new THREE.Vector2(0, 2.1));
    return points;
  }, []);

  const liquidShape = useMemo(() => {
    const points = [];
    points.push(new THREE.Vector2(0, 0.06));
    points.push(new THREE.Vector2(0.54, 0.06));
    points.push(new THREE.Vector2(0.56, 0.1));
    points.push(new THREE.Vector2(0.57, 0.18));
    points.push(new THREE.Vector2(0.58, 0.4));
    points.push(new THREE.Vector2(0.58, 1.0));
    points.push(new THREE.Vector2(0.57, 1.05));
    points.push(new THREE.Vector2(0, 1.05));
    return points;
  }, []);

  return (
    <group ref={glassRef} position={[0, -1.2, 0]}>
      {/* Glass bottle */}
      <mesh>
        <latheGeometry args={[bottleShape, 64]} />
        <MeshTransmissionMaterial
          backside
          samples={8}
          resolution={256}
          transmission={0.95}
          roughness={0.05}
          thickness={0.3}
          ior={1.5}
          chromaticAberration={0.06}
          anisotropy={0.1}
          distortion={0.1}
          distortionScale={0.3}
          color="#c8f0f5"
        />
      </mesh>

      {/* Perfume liquid */}
      <mesh>
        <latheGeometry args={[liquidShape, 64]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          resolution={128}
          transmission={0.8}
          roughness={0}
          thickness={0.5}
          ior={1.36}
          color="#2ab5c4"
          chromaticAberration={0.02}
        />
      </mesh>

      {/* Gold cap */}
      <mesh position={[0, 2.25, 0]}>
        <cylinderGeometry args={[0.25, 0.28, 0.35, 32]} />
        <meshStandardMaterial
          color="#c4a35a"
          metalness={1}
          roughness={0.15}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Cap bevel top */}
      <mesh position={[0, 2.45, 0]}>
        <cylinderGeometry args={[0.22, 0.25, 0.05, 32]} />
        <meshStandardMaterial
          color="#d4b36a"
          metalness={1}
          roughness={0.1}
          envMapIntensity={2}
        />
      </mesh>

      {/* Nozzle */}
      <mesh position={[0, 2.12, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.1, 16]} />
        <meshStandardMaterial
          color="#e0e0e5"
          metalness={0.9}
          roughness={0.05}
        />
      </mesh>

      {/* Decorative ring at neck */}
      <mesh position={[0, 1.72, 0]}>
        <torusGeometry args={[0.19, 0.015, 16, 48]} />
        <meshStandardMaterial
          color="#c4a35a"
          metalness={1}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#f0f8ff" />
      <directionalLight position={[-3, 3, -2]} intensity={0.4} color="#7ac4d4" />
      <spotLight
        position={[0, -3, 2]}
        intensity={0.6}
        color="#3A8FA8"
        angle={0.6}
        penumbra={1}
      />

      <Float
        speed={1.5}
        rotationIntensity={0.4}
        floatIntensity={0.6}
        floatingRange={[-0.1, 0.1]}
      >
        <BottleBody />
      </Float>

      <ScentParticles />
      <Environment preset="city" />
    </>
  );
}

export default function PerfumeBottle3D({ className, style }) {
  return (
    <div className={className} style={{ width: '100%', height: '100%', ...style }}>
      <Canvas
        camera={{ position: [0, 0.5, 4.5], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        style={{ display: 'block', width: '100%', height: '100%' }}
        dpr={[1, 1.5]}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
