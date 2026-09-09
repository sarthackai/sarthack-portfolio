import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function NeuralNetworkMesh({ theme }) {
  const groupRef = useRef();
  const pointsRef = useRef();
  const linesRef = useRef();

  const isDark = theme === 'dark';

  const { positions, connections } = useMemo(() => {
    const nodeCount = 120;
    const pos = [];
    const conn = [];

    for (let i = 0; i < nodeCount; i++) {
      pos.push(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6
      );
    }

    // Create connections between nearby nodes
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 2.5) {
          conn.push(
            pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2],
            pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]
          );
        }
      }
    }

    return {
      positions: new Float32Array(pos),
      connections: new Float32Array(conn),
    };
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.08;
      groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.05) * 0.15;
    }

    // Pulse node sizes
    if (pointsRef.current) {
      const sizes = pointsRef.current.geometry.attributes.size;
      if (sizes) {
        const time = clock.getElapsedTime();
        for (let i = 0; i < sizes.count; i++) {
          sizes.array[i] = 0.04 + Math.sin(time * 2 + i * 0.5) * 0.015;
        }
        sizes.needsUpdate = true;
      }
    }
  });

  const sizes = useMemo(() => {
    const s = new Float32Array(positions.length / 3);
    for (let i = 0; i < s.length; i++) s[i] = 0.04;
    return s;
  }, [positions]);

  // Theme-aware colors and opacities
  const nodeColor = isDark ? '#8B5CF6' : '#E85D04';
  const nodeOpacity = isDark ? 0.9 : 0.55;
  const lineColor = isDark ? '#3B82F6' : '#C94D00';
  const lineOpacity = isDark ? 0.12 : 0.08;
  const blending = isDark ? THREE.AdditiveBlending : THREE.NormalBlending;

  return (
    <group ref={groupRef}>
      {/* Neural network nodes */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={sizes.length}
            array={sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color={nodeColor}
          transparent
          opacity={nodeOpacity}
          sizeAttenuation
          blending={blending}
          depthWrite={false}
        />
      </points>

      {/* Connection lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={connections.length / 3}
            array={connections}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={lineColor}
          transparent
          opacity={lineOpacity}
          blending={blending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

// Floating ambient particles
function AmbientParticles({ theme }) {
  const ref = useRef();
  const isDark = theme === 'dark';

  const positions = useMemo(() => {
    const arr = new Float32Array(600);
    for (let i = 0; i < 600; i++) {
      arr[i] = (Math.random() - 0.5) * 20;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color={isDark ? '#60A5FA' : '#C94D00'}
        transparent
        opacity={isDark ? 0.35 : 0.2}
        sizeAttenuation
        blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function NeuralNetwork({ theme = 'dark' }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 60 }}
      style={{ background: 'transparent' }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.3} />
      <NeuralNetworkMesh theme={theme} />
      <AmbientParticles theme={theme} />
    </Canvas>
  );
}
