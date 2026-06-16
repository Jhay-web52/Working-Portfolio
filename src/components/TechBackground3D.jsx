"use client";
import { useEffect, useRef } from "react";

const COLORS = [
  0x3b82f6,
  0xa855f7,
  0x06b6d4,
  0x6366f1,
  0x0ea5e9,
  0x8b5cf6,
];

const N = 16;

export default function TechBackground3D() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let THREE, RoundedBoxGeometry;

    const boot = async () => {
      THREE = await import("three");
      const addon = await import("three/examples/jsm/geometries/RoundedBoxGeometry.js");
      RoundedBoxGeometry = addon.RoundedBoxGeometry;
      setup();
    };

    let raf;
    const cleanup = () => cancelAnimationFrame(raf);

    const setup = () => {
      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        55,
        window.innerWidth / window.innerHeight,
        0.1,
        100
      );
      camera.position.z = 11;

      scene.add(new THREE.AmbientLight(0x080818, 4));

      const blueLight = new THREE.PointLight(0x3b82f6, 80, 30);
      blueLight.position.set(7, 5, 5);
      scene.add(blueLight);

      const purpleLight = new THREE.PointLight(0xa855f7, 70, 30);
      purpleLight.position.set(-7, -5, 4);
      scene.add(purpleLight);

      const cyanLight = new THREE.PointLight(0x06b6d4, 40, 20);
      cyanLight.position.set(0, 7, -3);
      scene.add(cyanLight);

      const geoPool = [
        new RoundedBoxGeometry(1.1, 1.1, 1.1, 3, 0.15),
        new RoundedBoxGeometry(1.4, 0.75, 0.75, 3, 0.1),
        new RoundedBoxGeometry(0.75, 1.4, 0.75, 3, 0.1),
        new THREE.SphereGeometry(0.55, 24, 16),
        new THREE.TorusGeometry(0.52, 0.16, 12, 36),
        new THREE.OctahedronGeometry(0.6, 0),
        new THREE.IcosahedronGeometry(0.5, 0),
        new THREE.TorusGeometry(0.35, 0.1, 8, 24),
      ];

      const phi = Math.PI * (3 - Math.sqrt(5));
      const assembledPositions = Array.from({ length: N }, (_, i) => {
        const y = 1 - (i / (N - 1)) * 2;
        const r = Math.sqrt(Math.max(0, 1 - y * y));
        const theta = phi * i;
        return new THREE.Vector3(
          Math.cos(theta) * r * 4.5,
          y * 3.5,
          Math.sin(theta) * r * 4.5 - 1.5
        );
      });

      const shapes = [];
      for (let i = 0; i < N; i++) {
        const color = new THREE.Color(COLORS[i % COLORS.length]);
        const geo = geoPool[i % geoPool.length];

        const mat = new THREE.MeshPhongMaterial({
          color,
          emissive: color,
          emissiveIntensity: 0.07,
          specular: new THREE.Color(0xffffff),
          shininess: 160,
          transparent: true,
          opacity: 0.22 + (i % 3) * 0.07,
          side: THREE.DoubleSide,
          depthWrite: false,
        });
        const mesh = new THREE.Mesh(geo, mat);

        const glowMat = new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.07,
          blending: THREE.AdditiveBlending,
          side: THREE.BackSide,
          depthWrite: false,
        });
        const glow = new THREE.Mesh(geo, glowMat);
        glow.scale.setScalar(1.45);
        mesh.add(glow);

        if (i % 2 === 0) {
          const wireMat = new THREE.MeshBasicMaterial({
            color,
            wireframe: true,
            transparent: true,
            opacity: 0.1,
            depthWrite: false,
          });
          mesh.add(new THREE.Mesh(geo, wireMat));
        }

        const scattered = new THREE.Vector3(
          (Math.random() - 0.5) * 22,
          (Math.random() - 0.5) * 14,
          Math.random() * 3 - 7
        );

        mesh.position.copy(scattered);
        mesh.rotation.set(
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        );
        mesh.scale.setScalar(0.38 + Math.random() * 0.58);

        scene.add(mesh);
        shapes.push({
          mesh,
          scattered,
          assembled: assembledPositions[i],
          rotX: (Math.random() - 0.5) * 0.007,
          rotY: (Math.random() - 0.5) * 0.007,
          floatA: 0.12 + Math.random() * 0.2,
          floatF: 0.28 + Math.random() * 0.35,
          floatP: Math.random() * Math.PI * 2,
        });
      }

      let mx = 0, my = 0;
      const onMouse = (e) => {
        mx = e.clientX / window.innerWidth - 0.5;
        my = e.clientY / window.innerHeight - 0.5;
      };
      window.addEventListener("mousemove", onMouse);

      let scrollT = 0;
      const onScroll = () => {
        const h = document.body.scrollHeight - window.innerHeight;
        scrollT = h > 0 ? Math.min(window.scrollY / h, 1) : 0;
      };
      window.addEventListener("scroll", onScroll, { passive: true });

      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", onResize);

      let t = 0;
      let camX = 0, camY = 0;
      let lastTime = 0;

      const tick = (now) => {
        raf = requestAnimationFrame(tick);
        if (now - lastTime < 32) return;
        lastTime = now;
        t += 0.032;

        camX += (mx * 1.0 - camX) * 0.04;
        camY += (-my * 0.7 - camY) * 0.04;
        camera.position.x = camX;
        camera.position.y = camY;
        camera.lookAt(0, 0, 0);

        blueLight.position.x = Math.sin(t * 0.22) * 7;
        blueLight.position.y = Math.cos(t * 0.16) * 5;
        purpleLight.position.x = -Math.cos(t * 0.18) * 7;
        purpleLight.position.y = Math.sin(t * 0.13) * 5;

        const st = scrollT;

        shapes.forEach(({ mesh, scattered, assembled, rotX, rotY, floatA, floatF, floatP }) => {
          mesh.rotation.x += rotX * (1 - st * 0.8);
          mesh.rotation.y += rotY * (1 - st * 0.8);

          const fy = Math.sin(t * floatF + floatP) * floatA * (1 - st * 0.7);

          const tx = THREE.MathUtils.lerp(scattered.x, assembled.x, st);
          const ty = THREE.MathUtils.lerp(scattered.y, assembled.y, st) + fy;
          const tz = THREE.MathUtils.lerp(scattered.z, assembled.z, st);

          mesh.position.x += (tx - mesh.position.x) * 0.045;
          mesh.position.y += (ty - mesh.position.y) * 0.045;
          mesh.position.z += (tz - mesh.position.z) * 0.045;
        });

        renderer.render(scene, camera);
      };

      tick(0);

      const teardown = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("mousemove", onMouse);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
        renderer.dispose();
        geoPool.forEach((g) => g.dispose());
      };

      cleanupFnRef.current = teardown;
    };

    const cleanupFnRef = { current: null };
    boot().catch(console.error);

    return () => {
      cleanup();
      cleanupFnRef.current?.();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
