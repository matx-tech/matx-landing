'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

function ParticleField() {
  const meshRef = useRef<THREE.Points>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { size, viewport } = useThree();

  const [count] = useState(() => {
    if (typeof window === 'undefined') return 1000;
    return window.innerWidth < 768 ? 500 : 1500;
  });

  const [positions, colors, scales] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      positions[i3] = (Math.random() - 0.5) * 10;
      positions[i3 + 1] = (Math.random() - 0.5) * 10;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;

      const intensity = Math.random() * 0.5 + 0.5;
      // CVI: Public Service Blue hue (~0.58) with varying lightness
      color.setHSL(0.58, 0.65, 0.45 * intensity);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      scales[i] = Math.random();
    }

    return [positions, colors, scales];
  }, [count]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / size.width) * 2 - 1;
      mouseRef.current.y = -(event.clientY / size.height) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [size]);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;
    const geometry = meshRef.current.geometry;
    const positionAttribute = geometry.attributes.position as THREE.BufferAttribute;
    const positions = positionAttribute.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      const x = positions[i3];
      const y = positions[i3 + 1];

      const distX = (mouseRef.current.x * viewport.width) / 2 - x;
      const distY = (mouseRef.current.y * viewport.height) / 2 - y;
      const dist = Math.sqrt(distX * distX + distY * distY);

      if (dist < 2) {
        positions[i3] += distX * 0.02;
        positions[i3 + 1] += distY * 0.02;
      }

      positions[i3 + 2] = Math.sin(time + i * 0.01) * 0.5;
    }

    positionAttribute.needsUpdate = true;

    meshRef.current.rotation.y = time * 0.05;
  });

  const vertexShader = `
    attribute float scale;
    varying vec3 vColor;

    void main() {
      vColor = color;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = scale * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    varying vec3 vColor;

    void main() {
      float dist = length(gl_PointCoord - vec2(0.5));
      if (dist > 0.5) discard;

      float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
      gl_FragColor = vec4(vColor, alpha * 0.8);
    }
  `;

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-scale" count={count} array={scales} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        vertexColors
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function BloomEffect() {
  const { gl, scene, camera } = useThree();
  const renderTargetRef = useRef<THREE.WebGLRenderTarget>();

  useFrame(() => {
    if (!renderTargetRef.current) {
      renderTargetRef.current = new THREE.WebGLRenderTarget(512, 512, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
      });
    }
  });

  return null;
}

export function ParticleCanvas() {
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    const checkReducedMotion = () => {
      setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    };

    checkMobile();
    checkReducedMotion();

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Don't render particle field for mobile or reduced motion users
  if (isMobile || prefersReducedMotion) {
    return null;
  }

  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <ParticleField />
        <BloomEffect />
      </Canvas>
    </div>
  );
}
