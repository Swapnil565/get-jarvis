'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

const ParticleSwarm = ({ count = 300 }) => {
  const mesh = useRef<THREE.Points>(null!);
  
  // Generate random positions using useMemo to avoid recalculation
  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        // Sphere distribution
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 2 + Math.random() * 2; // Radius 2 to 4

        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

        temp[i * 3] = x;
        temp[i * 3 + 1] = y;
        temp[i * 3 + 2] = z;
    }
    return temp;
  }, [count]);

  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.05;
      mesh.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#00D9FF"
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Connections between close particles
const NeuralConnections = ({ count = 200, maxDist = 2.5 }) => {
    const linesMesh = useRef<THREE.LineSegments>(null!);
    
    const [positions, particles] = useMemo(() => {
        // Create nodes
        const nodes = [];
        for(let i=0; i<count; i++) {
            nodes.push(new THREE.Vector3(
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 8
            ));
        }

        // Create initial connections
        // We will update this in useFrame properly if we want dynamic keys, 
        // but for high performance static topology rotating is better.
        // Let's make a static topology that rotates.

        const linePositions : number[] = [];
        for (let i = 0; i < count; i++) {
            for (let j = i + 1; j < count; j++) {
                if (nodes[i].distanceTo(nodes[j]) < maxDist) {
                    linePositions.push(nodes[i].x, nodes[i].y, nodes[i].z);
                    linePositions.push(nodes[j].x, nodes[j].y, nodes[j].z);
                }
            }
        }
        return [new Float32Array(linePositions), nodes];
    }, [count, maxDist]);

    useFrame((state, delta) => {
        if (linesMesh.current) {
            linesMesh.current.rotation.y -= delta * 0.03;
        }
    });

    return (
        <lineSegments ref={linesMesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <lineBasicMaterial
                color="#00D9FF"
                transparent
                opacity={0.15}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </lineSegments>
    )

}

const CoreModel = () => {
    return (
     <group>
        <ParticleSwarm count={400} />
        <NeuralConnections count={150} maxDist={3} />
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} color="#00D9FF" intensity={1} />
     </group>
    )
}

export default function NeuralCortex({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-full h-full min-h-[400px] ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <CoreModel />
        <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            autoRotate 
            autoRotateSpeed={0.5} 
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
      
      {/* Overlay Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_20%,#0A1929_100%)]" />
    </div>
  );
}
