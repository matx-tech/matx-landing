'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { usePrefersReducedMotion } from '@/lib/hooks/use-prefers-reduced-motion';

function MathParticleField() {
  const meshRef = useRef<THREE.Points>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { size, viewport } = useThree();

  const count = useMemo(() => {
    if (typeof window === 'undefined') return 800;
    return window.innerWidth < 768 ? 400 : 1200;
  }, []);

  const [positions, scales] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;

      scales[i] = Math.random() * 0.5 + 0.3;
    }

    return [positions, scales];
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
      const distSq = distX * distX + distY * distY;

      if (distSq < 9) { // radius² = 3²
        positions[i3] += distX * 0.015;
        positions[i3 + 1] += distY * 0.015;
      }

      positions[i3 + 2] = Math.sin(time * 0.5 + i * 0.1) * 2;
    }

    positionAttribute.needsUpdate = true;

    meshRef.current.rotation.z = time * 0.02;
  });

  // CVI colors: Public Service Blue (#1E5A8A) and Learning Teal (#0E6F68)
  const vertexShader = `
    attribute float scale;
    varying float vScale;
    varying float vAlpha;

    void main() {
      vScale = scale;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = scale * (200.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;

      float dist = length(position.xy);
      vAlpha = smoothstep(10.0, 2.0, dist) * 0.6;
    }
  `;

  const fragmentShader = `
    varying float vScale;
    varying float vAlpha;

    void main() {
      float dist = length(gl_PointCoord - vec2(0.5));
      if (dist > 0.5) discard;

      // CVI: Public Service Blue (#1E5A8A) to Learning Teal (#0E6F68)
      vec3 blue = vec3(0.118, 0.353, 0.541);
      vec3 teal = vec3(0.055, 0.435, 0.408);
      vec3 color = mix(blue, teal, vScale);

      float alpha = (1.0 - smoothstep(0.0, 0.5, dist)) * vAlpha;

      gl_FragColor = vec4(color, alpha);
    }
  `;

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-scale" args={[scales, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export function MathParticleCanvas() {
  const [isMobile, setIsMobile] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Don't render particle field for mobile or reduced-motion users
  if (isMobile || prefersReducedMotion) {
    return null;
  }

  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <MathParticleField />
      </Canvas>
    </div>
  );
}
