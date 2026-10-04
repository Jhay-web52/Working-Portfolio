"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, Sphere, Stars, useTexture } from "@react-three/drei";
import * as THREE from "three";

// Decorative version of the OrbitTrack globe. It uses the same Earth
// textures and atmosphere shader, but has no live data, so the portfolio
// does not depend on OrbitTrack's backend.

const RADIUS = 1;

const ATMOSPHERE_VERTEX_SHADER = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ATMOSPHERE_FRAGMENT_SHADER = /* glsl */ `
  varying vec3 vNormal;
  uniform vec3 glowColor;
  void main() {
    float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.5);
    gl_FragColor = vec4(glowColor, 1.0) * intensity;
  }
`;

function Atmosphere() {
  const uniforms = useMemo(
    () => ({ glowColor: { value: new THREE.Color("#7dd3fc") } }),
    [],
  );

  return (
    <Sphere args={[RADIUS * 1.15, 64, 64]}>
      <shaderMaterial
        vertexShader={ATMOSPHERE_VERTEX_SHADER}
        fragmentShader={ATMOSPHERE_FRAGMENT_SHADER}
        uniforms={uniforms}
        transparent
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </Sphere>
  );
}

function Earth({ progress }) {
  const meshRef = useRef(null);
  const cloudsRef = useRef(null);
  const { map, normalMap, specularMap, cloudsMap } = useTexture({
    map: "/textures/earth.jpg",
    normalMap: "/textures/earth_normal.jpg",
    specularMap: "/textures/earth_specular.jpg",
    cloudsMap: "/textures/earth_clouds.png",
  });

  // Idle spin, plus extra rotation driven by how far the user has scrolled.
  useFrame((_, delta) => {
    const spin = delta * 0.05 + progress.get() * 0.002;
    if (meshRef.current) meshRef.current.rotation.y += spin;
    if (cloudsRef.current) cloudsRef.current.rotation.y += spin * 1.3;
  });

  return (
    <>
      <Sphere ref={meshRef} args={[RADIUS, 64, 64]}>
        <meshPhongMaterial
          map={map}
          normalMap={normalMap}
          specularMap={specularMap}
          specular={new THREE.Color("#8899aa")}
          shininess={18}
        />
      </Sphere>
      <Sphere ref={cloudsRef} args={[RADIUS * 1.008, 64, 64]}>
        <meshStandardMaterial
          map={cloudsMap}
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </Sphere>
      <Atmosphere />
    </>
  );
}

// Each orbit is a tilted circle. Points are sampled once and a dot is moved
// along the same circle every frame.
function Orbit({ radius, tilt, rotation, speed, color, phase }) {
  const dotRef = useRef(null);

  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      pts.push(
        new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius),
      );
    }
    return pts;
  }, [radius]);

  useFrame(({ clock }) => {
    if (!dotRef.current) return;
    const a = clock.getElapsedTime() * speed + phase;
    dotRef.current.position.set(Math.cos(a) * radius, 0, Math.sin(a) * radius);
  });

  return (
    <group rotation={[tilt, rotation, 0]}>
      <Line
        points={points}
        color={color}
        transparent
        opacity={0.25}
        lineWidth={1}
      />
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.025, 12, 12]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>
    </group>
  );
}

function Orbits() {
  return (
    <>
      <Orbit
        radius={1.45}
        tilt={0.35}
        rotation={0.2}
        speed={0.35}
        color="#7dd3fc"
        phase={0}
      />
      <Orbit
        radius={1.7}
        tilt={-0.6}
        rotation={1.1}
        speed={0.25}
        color="#a78bfa"
        phase={2}
      />
      <Orbit
        radius={1.95}
        tilt={1.1}
        rotation={2.3}
        speed={0.18}
        color="#7dd3fc"
        phase={4}
      />
    </>
  );
}

export default function HeroGlobe({ progress }) {
  return (
    <Canvas
      camera={{ position: [0, 0.6, 5], fov: 40 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 1.5]}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.7} />
      <hemisphereLight args={["#bfdbfe", "#0a0a1a", 0.6]} />
      <pointLight position={[3, 2, 6]} intensity={2.2} />
      <Stars
        radius={60}
        depth={40}
        count={1200}
        factor={2.5}
        saturation={0}
        fade
      />
      <Earth progress={progress} />
      <Orbits />
    </Canvas>
  );
}
