import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════
   SCROLL PROGRESS HOOK
   ═══════════════════════════════════════════════════ */
function useScrollProgress() {
  const ref = useRef(0);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      ref.current = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return ref;
}

/* ═══════════════════════════════════════════════════
   MOUSE POSITION HOOK (desktop only)
   ═══════════════════════════════════════════════════ */
function useMousePosition() {
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mql = window.matchMedia('(pointer: fine)');
    if (!mql.matches) return;

    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return mouse;
}

/* ═══════════════════════════════════════════════════
   SMOOTH VALUE — spring-like lerp helper
   ═══════════════════════════════════════════════════ */
function smoothDamp(current, target, speed, dt) {
  return current + (target - current) * (1 - Math.pow(speed, dt));
}

/* ═══════════════════════════════════════════════════
   SCROLL-DRIVEN CAMERA
   ═══════════════════════════════════════════════════ */
function ScrollCamera({ scrollRef, mouse, reducedMotion }) {
  const { camera } = useThree();
  const state = useRef({
    z: 8, x: 0, y: 0,
    rx: 0, ry: 0,
    tiltX: 0,
  });

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const s = state.current;
    const sp = scrollRef.current;
    const dampRate = 0.04;

    // Camera z: travel from 8 (top) to -37 (bottom) — deep journey
    const targetZ = 8 - sp * 45;
    s.z = smoothDamp(s.z, targetZ, dampRate, dt);

    // Section-specific camera tilt
    // Hero (0-0.15): level. Skills (0.25-0.45): slight look-down. Projects (0.45-0.65): slight look-up. Contact (0.8+): centering
    let targetTiltX = 0;
    if (sp > 0.2 && sp < 0.45) {
      targetTiltX = -0.04 * Math.sin((sp - 0.2) / 0.25 * Math.PI);
    } else if (sp > 0.45 && sp < 0.65) {
      targetTiltX = 0.03 * Math.sin((sp - 0.45) / 0.2 * Math.PI);
    }
    s.tiltX = smoothDamp(s.tiltX, targetTiltX, dampRate, dt);

    // Subtle mouse parallax with spring damping (desktop only)
    if (!reducedMotion) {
      s.rx = smoothDamp(s.rx, mouse.current.y * 0.06, 0.06, dt);
      s.ry = smoothDamp(s.ry, mouse.current.x * 0.06, 0.06, dt);
    }

    camera.position.set(
      s.ry * 1.8,
      s.rx * 1.2,
      s.z
    );
    camera.rotation.set(
      s.rx * 0.2 + s.tiltX,
      s.ry * 0.15,
      0
    );
  });

  return null;
}

/* ═══════════════════════════════════════════════════
   CENTRAL AI CORE — hero focal point
   ═══════════════════════════════════════════════════ */
function AICoreStructure({ isDark, scrollRef, reducedMotion }) {
  const outerRef = useRef();
  const innerRef = useRef();
  const torusRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const sp = scrollRef.current;

    // Fade out as user scrolls past hero
    const visibility = Math.max(0, 1 - sp * 3.5);
    const scale = 0.8 + visibility * 0.7;

    if (outerRef.current) {
      outerRef.current.material.opacity = visibility * (isDark ? 0.25 : 0.12);
      outerRef.current.scale.setScalar(scale);
      if (!reducedMotion) {
        outerRef.current.rotation.x = t * 0.08;
        outerRef.current.rotation.y = t * 0.12;
      }
    }

    if (innerRef.current) {
      innerRef.current.material.opacity = visibility * (isDark ? 0.35 : 0.15);
      innerRef.current.scale.setScalar(scale * 0.6);
      if (!reducedMotion) {
        innerRef.current.rotation.x = -t * 0.1;
        innerRef.current.rotation.z = t * 0.15;
      }
    }

    if (torusRef.current) {
      torusRef.current.material.opacity = visibility * (isDark ? 0.15 : 0.08);
      torusRef.current.scale.setScalar(scale * 1.3);
      if (!reducedMotion) {
        torusRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.3) * 0.1;
        torusRef.current.rotation.z = t * 0.05;
      }
    }
  });

  const color1 = isDark ? '#8B5CF6' : '#7C3AED';
  const color2 = isDark ? '#3B82F6' : '#2563EB';
  const blending = isDark ? THREE.AdditiveBlending : THREE.NormalBlending;

  return (
    <group position={[0, 0, 1]}>
      {/* Outer icosahedron */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[2.2, 1]} />
        <meshBasicMaterial
          color={color1}
          transparent
          opacity={0.25}
          wireframe
          blending={blending}
          depthWrite={false}
        />
      </mesh>

      {/* Inner octahedron */}
      <mesh ref={innerRef}>
        <octahedronGeometry args={[1.3, 0]} />
        <meshBasicMaterial
          color={color2}
          transparent
          opacity={0.35}
          wireframe
          blending={blending}
          depthWrite={false}
        />
      </mesh>

      {/* Orbiting torus */}
      <mesh ref={torusRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.8, 0.015, 8, 64]} />
        <meshBasicMaterial
          color={color1}
          transparent
          opacity={0.15}
          blending={blending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════
   NEURAL NETWORK CORE — layered shells
   ═══════════════════════════════════════════════════ */
function NeuralNetworkCore({ isDark, scrollRef, reducedMotion }) {
  const groupRef = useRef();
  const pointsMatRef = useRef();
  const linesMatRef = useRef();

  const { nodePositions, connectionPositions, nodeCount } = useMemo(() => {
    const count = 150;
    const pos = [];

    // Create nodes in layered shells for better spatial distribution
    for (let i = 0; i < count; i++) {
      const shell = Math.floor(i / 30); // 5 shells
      const radius = 3 + shell * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos.push(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi) + (Math.random() - 0.5) * 4
      );
    }

    const conn = [];
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 3.5 && conn.length / 6 < 300) {
          conn.push(
            pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2],
            pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]
          );
        }
      }
    }

    return {
      nodePositions: new Float32Array(pos),
      connectionPositions: new Float32Array(conn),
      nodeCount: count,
    };
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const sp = scrollRef.current;

    if (!reducedMotion) {
      groupRef.current.rotation.y = t * 0.03;
      groupRef.current.rotation.x = Math.sin(t * 0.02) * 0.08;
    }

    // Neural network is strongest at hero + skills (0-0.5), then fades
    const visibility = sp < 0.5
      ? 1.0 - sp * 0.3
      : Math.max(0.3, 1.0 - sp * 0.8);

    if (pointsMatRef.current) {
      pointsMatRef.current.opacity = (isDark ? 0.8 : 0.4) * visibility;
      // Pulse size
      pointsMatRef.current.size = 0.06 + Math.sin(t * 1.5) * 0.015;
    }
    if (linesMatRef.current) {
      linesMatRef.current.opacity = (isDark ? 0.1 : 0.05) * visibility;
    }
  });

  const nodeColor = isDark ? '#8B5CF6' : '#7C3AED';
  const lineColor = isDark ? '#3B82F6' : '#2563EB';
  const blending = isDark ? THREE.AdditiveBlending : THREE.NormalBlending;

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={nodePositions.length / 3}
            array={nodePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          ref={pointsMatRef}
          size={0.06}
          color={nodeColor}
          transparent
          opacity={isDark ? 0.8 : 0.4}
          sizeAttenuation
          blending={blending}
          depthWrite={false}
        />
      </points>

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={connectionPositions.length / 3}
            array={connectionPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          ref={linesMatRef}
          color={lineColor}
          transparent
          opacity={isDark ? 0.1 : 0.05}
          blending={blending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

/* ═══════════════════════════════════════════════════
   PARTICLE LAYER — foreground or background
   ═══════════════════════════════════════════════════ */
function ParticleLayer({ isDark, count, spread, size, speed, color, baseOpacity, reducedMotion }) {
  const ref = useRef();

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * spread;
      arr[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.6;
      arr[i * 3 + 2] = (Math.random() - 0.5) * spread * 1.5;
    }
    return arr;
  }, [count, spread]);

  useFrame(({ clock }) => {
    if (!ref.current || reducedMotion) return;
    ref.current.rotation.y = clock.getElapsedTime() * speed;
    ref.current.rotation.x = Math.sin(clock.getElapsedTime() * speed * 0.6) * 0.03;
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
        size={size}
        color={color}
        transparent
        opacity={baseOpacity}
        sizeAttenuation
        blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ═══════════════════════════════════════════════════
   DATA STREAMS — flowing energy lines
   ═══════════════════════════════════════════════════ */
function DataStreams({ isDark, scrollRef, reducedMotion }) {
  const groupRef = useRef();
  const matsRef = useRef([]);

  const { streams, streamPositions } = useMemo(() => {
    const streamCount = 10;
    const pointsPerStream = 40;
    const result = [];
    const allPositions = [];

    for (let s = 0; s < streamCount; s++) {
      const baseX = (Math.random() - 0.5) * 24;
      const baseY = (Math.random() - 0.5) * 12;
      const baseZ = -3 - s * 4;
      const arr = new Float32Array(pointsPerStream * 3);

      for (let p = 0; p < pointsPerStream; p++) {
        const t = p / pointsPerStream;
        arr[p * 3] = baseX + Math.sin(t * Math.PI * 2 + s * 0.7) * 3;
        arr[p * 3 + 1] = baseY + Math.cos(t * Math.PI * 3 + s * 1.1) * 2;
        arr[p * 3 + 2] = baseZ + t * 10;
      }

      result.push(arr);
      allPositions.push(arr);
    }

    return { streams: result, streamPositions: allPositions };
  }, []);

  useFrame(({ clock }) => {
    if (reducedMotion) return;
    const t = clock.getElapsedTime() * 0.25;
    const sp = scrollRef.current;

    // Visible 0.15-0.85 scroll range, peak at 0.3-0.6
    const baseOpacity = Math.max(0, Math.sin(Math.max(0, (sp - 0.1)) * Math.PI * 1.1)) * 0.12;

    matsRef.current.forEach((mat) => {
      if (mat) mat.opacity = baseOpacity;
    });

    if (groupRef.current) {
      // Subtle flowing motion
      groupRef.current.children.forEach((child) => {
        if (child.geometry?.attributes?.position) {
          const pos = child.geometry.attributes.position;
          for (let i = 0; i < pos.count; i++) {
            const y = pos.getY(i);
            pos.setY(i, y + Math.sin(t + i * 0.12) * 0.0015);
          }
          pos.needsUpdate = true;
        }
      });
    }
  });

  const color = isDark ? '#8B5CF6' : '#7C3AED';
  const blending = isDark ? THREE.AdditiveBlending : THREE.NormalBlending;

  return (
    <group ref={groupRef}>
      {streams.map((posArr, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={posArr.length / 3}
              array={posArr}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            ref={(el) => { matsRef.current[i] = el; }}
            color={color}
            transparent
            opacity={0}
            blending={blending}
            depthWrite={false}
          />
        </line>
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════════════
   GEOMETRIC STRUCTURES — varied floating shapes
   ═══════════════════════════════════════════════════ */
function GeometricStructures({ isDark, scrollRef, reducedMotion }) {
  const groupRef = useRef();

  const shapes = useMemo(() => [
    { pos: [7, 3, -6], scale: 0.4, type: 'dodeca', speed: 0.2, scrollWindow: [0.1, 0.5] },
    { pos: [-8, -2, -12], scale: 0.5, type: 'torusKnot', speed: 0.15, scrollWindow: [0.2, 0.6] },
    { pos: [5, -4, -18], scale: 0.35, type: 'octa', speed: 0.25, scrollWindow: [0.3, 0.7] },
    { pos: [-6, 5, -8], scale: 0.3, type: 'dodeca', speed: 0.18, scrollWindow: [0.05, 0.4] },
    { pos: [9, 1, -24], scale: 0.45, type: 'octa', speed: 0.22, scrollWindow: [0.4, 0.8] },
    { pos: [-4, -6, -30], scale: 0.38, type: 'torusKnot', speed: 0.12, scrollWindow: [0.5, 0.9] },
    { pos: [3, 4, -34], scale: 0.42, type: 'dodeca', speed: 0.2, scrollWindow: [0.6, 1.0] },
  ], []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const sp = scrollRef.current;

    groupRef.current.children.forEach((child, i) => {
      const shape = shapes[i];
      if (!shape) return;

      // Scroll-driven visibility window
      const [start, end] = shape.scrollWindow;
      const mid = (start + end) / 2;
      const halfWidth = (end - start) / 2;
      const visibility = Math.max(0, 1 - Math.abs(sp - mid) / halfWidth) * 0.2;

      child.material.opacity = visibility;

      if (!reducedMotion) {
        child.rotation.x = t * shape.speed;
        child.rotation.y = t * shape.speed * 0.7;
        child.position.y = shape.pos[1] + Math.sin(t * 0.4 + i) * 0.3;
      }
    });
  });

  const color = isDark ? '#3B82F6' : '#818CF8';
  const blending = isDark ? THREE.AdditiveBlending : THREE.NormalBlending;

  return (
    <group ref={groupRef}>
      {shapes.map((s, i) => (
        <mesh key={i} position={s.pos} scale={s.scale}>
          {s.type === 'dodeca' ? (
            <dodecahedronGeometry args={[1, 0]} />
          ) : s.type === 'torusKnot' ? (
            <torusKnotGeometry args={[0.8, 0.25, 32, 8]} />
          ) : (
            <octahedronGeometry args={[1, 0]} />
          )}
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0}
            wireframe
            blending={blending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════════════
   GRID PLANE — subtle digital horizon
   ═══════════════════════════════════════════════════ */
function GridPlane({ isDark, scrollRef }) {
  const ref = useRef();

  useFrame(() => {
    if (!ref.current) return;
    const sp = scrollRef.current;
    // Visible primarily in projects zone (0.35–0.65)
    const opacity = Math.max(0, Math.sin(Math.max(0, (sp - 0.25)) * Math.PI * 1.0)) * (isDark ? 0.06 : 0.025);
    ref.current.material.opacity = opacity;
  });

  return (
    <gridHelper
      ref={ref}
      args={[80, 50, isDark ? '#8B5CF6' : '#C4B5FD', isDark ? '#1E1B4B' : '#E0E7FF']}
      position={[0, -9, -14]}
      material-transparent
      material-opacity={0}
      material-depthWrite={false}
    />
  );
}

/* ═══════════════════════════════════════════════════
   FINAL GLOW — compound nested structure
   ═══════════════════════════════════════════════════ */
function FinalGlow({ isDark, scrollRef, reducedMotion }) {
  const outerRef = useRef();
  const innerRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const sp = scrollRef.current;

    // Visible from 0.7 to 1.0
    const visibility = Math.max(0, (sp - 0.65) * 2.85) * 0.3;
    const pulse = 1 + Math.sin(t * 0.8) * 0.05;

    if (outerRef.current) {
      outerRef.current.material.opacity = visibility;
      outerRef.current.scale.setScalar(2 * pulse);
      if (!reducedMotion) {
        outerRef.current.rotation.y = t * 0.12;
        outerRef.current.rotation.z = t * 0.08;
      }
    }
    if (innerRef.current) {
      innerRef.current.material.opacity = visibility * 0.7;
      innerRef.current.scale.setScalar(1.3 * pulse);
      if (!reducedMotion) {
        innerRef.current.rotation.y = -t * 0.1;
        innerRef.current.rotation.x = t * 0.14;
      }
    }
  });

  const color1 = isDark ? '#8B5CF6' : '#7C3AED';
  const color2 = isDark ? '#3B82F6' : '#2563EB';
  const blending = isDark ? THREE.AdditiveBlending : THREE.NormalBlending;

  return (
    <group position={[0, 0, -38]}>
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial
          color={color1}
          transparent
          opacity={0}
          wireframe
          blending={blending}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={innerRef}>
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial
          color={color2}
          transparent
          opacity={0}
          wireframe
          blending={blending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════
   SCENE LIGHTING — cinematic, scroll-responsive
   ═══════════════════════════════════════════════════ */
function SceneLighting({ isDark, scrollRef }) {
  const light1Ref = useRef();
  const light2Ref = useRef();
  const light3Ref = useRef();

  useFrame(() => {
    const sp = scrollRef.current;

    // Light 1 follows scroll — brightest at hero, dimmer mid-page
    if (light1Ref.current) {
      light1Ref.current.intensity = isDark
        ? 0.3 * (1 - sp * 0.4)
        : 0.2 * (1 - sp * 0.3);
    }

    // Light 3 follows camera depth
    if (light3Ref.current) {
      light3Ref.current.position.z = 5 - sp * 40;
      light3Ref.current.intensity = isDark ? 0.15 : 0.08;
    }
  });

  return (
    <>
      <ambientLight intensity={isDark ? 0.12 : 0.35} color={isDark ? '#8B5CF6' : '#C4B5FD'} />
      <pointLight
        ref={light1Ref}
        position={[5, 5, 5]}
        intensity={isDark ? 0.3 : 0.2}
        color={isDark ? '#3B82F6' : '#818CF8'}
        distance={25}
        decay={2}
      />
      <pointLight
        ref={light2Ref}
        position={[-5, -3, -10]}
        intensity={isDark ? 0.2 : 0.1}
        color={isDark ? '#8B5CF6' : '#A78BFA'}
        distance={20}
        decay={2}
      />
      <pointLight
        ref={light3Ref}
        position={[0, 2, 5]}
        intensity={isDark ? 0.15 : 0.08}
        color={isDark ? '#60A5FA' : '#93C5FD'}
        distance={18}
        decay={2}
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════
   FOG MANAGER — atmospheric depth
   ═══════════════════════════════════════════════════ */
function FogManager({ isDark }) {
  const { scene } = useThree();

  useEffect(() => {
    if (isDark) {
      scene.fog = new THREE.FogExp2('#050510', 0.012);
    } else {
      scene.fog = new THREE.FogExp2('#F0F0F8', 0.008);
    }
    return () => {
      scene.fog = null;
    };
  }, [isDark, scene]);

  return null;
}

/* ═══════════════════════════════════════════════════
   SCENE CONTENTS — all objects inside one Canvas
   ═══════════════════════════════════════════════════ */
function SceneContents({ theme, scrollRef, mouse, reducedMotion, isMobile }) {
  const isDark = theme === 'dark';

  const bgParticleCount = isMobile ? 120 : 500;
  const fgParticleCount = isMobile ? 60 : 200;

  return (
    <>
      <ScrollCamera
        scrollRef={scrollRef}
        mouse={mouse}
        reducedMotion={reducedMotion}
      />
      <FogManager isDark={isDark} />
      <SceneLighting isDark={isDark} scrollRef={scrollRef} />

      {/* Central AI Core — hero focal point */}
      <AICoreStructure
        isDark={isDark}
        scrollRef={scrollRef}
        reducedMotion={reducedMotion}
      />

      {/* Neural Network */}
      <NeuralNetworkCore
        isDark={isDark}
        scrollRef={scrollRef}
        reducedMotion={reducedMotion}
      />

      {/* Background particles — large spread, slow */}
      <ParticleLayer
        isDark={isDark}
        count={bgParticleCount}
        spread={60}
        size={0.022}
        speed={0.006}
        color={isDark ? '#60A5FA' : '#818CF8'}
        baseOpacity={isDark ? 0.2 : 0.1}
        reducedMotion={reducedMotion}
      />

      {/* Foreground particles — tighter, slightly faster */}
      <ParticleLayer
        isDark={isDark}
        count={fgParticleCount}
        spread={30}
        size={0.035}
        speed={0.012}
        color={isDark ? '#A78BFA' : '#C4B5FD'}
        baseOpacity={isDark ? 0.3 : 0.15}
        reducedMotion={reducedMotion}
      />

      {/* Data Streams */}
      <DataStreams
        isDark={isDark}
        scrollRef={scrollRef}
        reducedMotion={reducedMotion}
      />

      {/* Geometric Structures */}
      <GeometricStructures
        isDark={isDark}
        scrollRef={scrollRef}
        reducedMotion={reducedMotion}
      />

      {/* Grid Plane */}
      <GridPlane isDark={isDark} scrollRef={scrollRef} />

      {/* Final Glow */}
      <FinalGlow
        isDark={isDark}
        scrollRef={scrollRef}
        reducedMotion={reducedMotion}
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN EXPORT — Continuous3DWorld
   ═══════════════════════════════════════════════════ */
export default function Continuous3DWorld({ theme = 'dark' }) {
  const scrollRef = useScrollProgress();
  const mouse = useMousePosition();

  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    setIsMobile(window.matchMedia('(max-width: 768px)').matches);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
      dpr={isMobile ? [1, 1] : [1, 1.5]}
      gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
    >
      <SceneContents
        theme={theme}
        scrollRef={scrollRef}
        mouse={mouse}
        reducedMotion={reducedMotion}
        isMobile={isMobile}
      />
    </Canvas>
  );
}
