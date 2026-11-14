import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ScentParticles({ count = 25, color = '#5ec4d4' }) {
  const mesh = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 2.5,
        Math.random() * 3.5 + 1,
        (Math.random() - 0.5) * 2.5,
      ],
      speed: 0.15 + Math.random() * 0.35,
      offset: Math.random() * Math.PI * 2,
      scale: 0.015 + Math.random() * 0.03,
    }));
  }, [count]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    particles.forEach((p, i) => {
      const y = ((p.position[1] + p.speed * t) % 4.5) - 0.5;
      dummy.position.set(
        p.position[0] + Math.sin(t * 0.4 + p.offset) * 0.25,
        y,
        p.position[2] + Math.cos(t * 0.35 + p.offset) * 0.25
      );
      dummy.scale.setScalar(p.scale * (0.6 + Math.sin(t * 1.8 + p.offset) * 0.4));
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.5}
        toneMapped={false}
        transparent
        opacity={0.5}
      />
    </instancedMesh>
  );
}

function BottleBody({ liquidColor = '#2ab5c4', capColor = '#c4a35a' }) {
  const glassRef = useRef();

  useFrame(({ clock }) => {
    if (glassRef.current) {
      glassRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.25) * 0.08;
    }
  });

  const bottleShape = useMemo(() => {
    const pts = [];
    pts.push(new THREE.Vector2(0, 0));
    pts.push(new THREE.Vector2(0.55, 0));
    pts.push(new THREE.Vector2(0.6, 0.05));
    pts.push(new THREE.Vector2(0.62, 0.15));
    pts.push(new THREE.Vector2(0.63, 0.4));
    pts.push(new THREE.Vector2(0.63, 1.2));
    pts.push(new THREE.Vector2(0.62, 1.4));
    pts.push(new THREE.Vector2(0.55, 1.55));
    pts.push(new THREE.Vector2(0.4, 1.65));
    pts.push(new THREE.Vector2(0.2, 1.75));
    pts.push(new THREE.Vector2(0.18, 1.85));
    pts.push(new THREE.Vector2(0.18, 2.0));
    pts.push(new THREE.Vector2(0.2, 2.05));
    pts.push(new THREE.Vector2(0.2, 2.1));
    pts.push(new THREE.Vector2(0, 2.1));
    return pts;
  }, []);

  const liquidShape = useMemo(() => {
    const pts = [];
    pts.push(new THREE.Vector2(0, 0.06));
    pts.push(new THREE.Vector2(0.54, 0.06));
    pts.push(new THREE.Vector2(0.56, 0.1));
    pts.push(new THREE.Vector2(0.57, 0.18));
    pts.push(new THREE.Vector2(0.58, 0.4));
    pts.push(new THREE.Vector2(0.58, 1.0));
    pts.push(new THREE.Vector2(0.57, 1.05));
    pts.push(new THREE.Vector2(0, 1.05));
    return pts;
  }, []);

  return (
    <group ref={glassRef} position={[0, -1.2, 0]}>
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
          color={liquidColor}
          chromaticAberration={0.02}
        />
      </mesh>

      <mesh position={[0, 2.25, 0]}>
        <cylinderGeometry args={[0.25, 0.28, 0.35, 32]} />
        <meshStandardMaterial color={capColor} metalness={1} roughness={0.15} envMapIntensity={1.5} />
      </mesh>

      <mesh position={[0, 2.45, 0]}>
        <cylinderGeometry args={[0.22, 0.25, 0.05, 32]} />
        <meshStandardMaterial color={capColor} metalness={1} roughness={0.1} envMapIntensity={2} />
      </mesh>

      <mesh position={[0, 2.12, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.1, 16]} />
        <meshStandardMaterial color="#e0e0e5" metalness={0.9} roughness={0.05} />
      </mesh>

      <mesh position={[0, 1.72, 0]}>
        <torusGeometry args={[0.19, 0.015, 16, 48]} />
        <meshStandardMaterial color={capColor} metalness={1} roughness={0.2} />
      </mesh>
    </group>
  );
}

function Scene({ liquidColor, capColor, particleColor }) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#f0f8ff" />
      <directionalLight position={[-3, 3, -2]} intensity={0.3} color="#7ac4d4" />
      <spotLight position={[0, -3, 2]} intensity={0.5} color={liquidColor} angle={0.6} penumbra={1} />
      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.5} floatingRange={[-0.08, 0.08]}>
        <BottleBody liquidColor={liquidColor} capColor={capColor} />
      </Float>
      <ScentParticles count={20} color={particleColor} />
      <Environment preset="city" />
    </>
  );
}

const FAMILY_COLORS = {
  woody:    { liquid: '#8B6914', cap: '#c4a35a', particle: '#A08030' },
  floral:   { liquid: '#DB7093', cap: '#d4b36a', particle: '#E090A8' },
  oriental: { liquid: '#B8860B', cap: '#c4a35a', particle: '#D4A040' },
  fresh:    { liquid: '#20B2AA', cap: '#d4b36a', particle: '#40C8C0' },
  citrus:   { liquid: '#FFA500', cap: '#d4b36a', particle: '#FFB840' },
  gourmand: { liquid: '#D2691E', cap: '#c4a35a', particle: '#E08030' },
  aromatic: { liquid: '#6B8E23', cap: '#c4a35a', particle: '#80A830' },
  aquatic:  { liquid: '#4682B4', cap: '#d4b36a', particle: '#5898C8' },
};

export default function DetailBottle3D({ familyId, className, style }) {
  const colors = FAMILY_COLORS[familyId] || FAMILY_COLORS.fresh;

  return (
    <div className={className} style={{ width: '100%', height: '100%', ...style }}>
      <Canvas
        camera={{ position: [0, 0.5, 4.5], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        style={{ display: 'block', width: '100%', height: '100%' }}
        dpr={[1, 1.5]}
      >
        <Scene
          liquidColor={colors.liquid}
          capColor={colors.cap}
          particleColor={colors.particle}
        />
      </Canvas>
    </div>
  );
}
