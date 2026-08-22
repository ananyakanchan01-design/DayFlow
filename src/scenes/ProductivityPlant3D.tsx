import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { PlantStage } from '@/types/task';
import { Sparkles, Trophy } from 'lucide-react';

interface PlantMeshProps {
  stage: PlantStage;
  completedCount: number;
}

function ProceduralPlant({ stage, completedCount }: PlantMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t * 0.4) * 0.12;
    if (hovered) {
      groupRef.current.rotation.x = Math.sin(t * 1.5) * 0.05;
    } else {
      groupRef.current.rotation.x = 0;
    }
  });

  // Calculate parameters according to stage
  const getStageParams = () => {
    switch (stage) {
      case 'Seed':
        return { height: 0.3, leafCount: 0, flowerCount: 0, leafScale: 0 };
      case 'Sprout':
        return { height: 0.8, leafCount: 2, flowerCount: 0, leafScale: 0.3 };
      case 'Plant':
        return { height: 1.5, leafCount: 6, flowerCount: 0, leafScale: 0.5 };
      case 'Flower':
        return { height: 2.0, leafCount: 10, flowerCount: 3, leafScale: 0.6 };
      case 'Tree':
        return { height: 2.6, leafCount: 16, flowerCount: 5, leafScale: 0.75 };
    }
  };

  const { height, leafCount, flowerCount, leafScale } = getStageParams();

  return (
    <group
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      position={[0, -0.6, 0]}
    >
      {/* Ceramic / Wooden Stand Base */}
      <mesh position={[0, -0.3, 0]} receiveShadow>
        <cylinderGeometry args={[1.6, 1.8, 0.4, 32]} />
        <meshStandardMaterial color="#FFEBD3" roughness={0.4} />
      </mesh>

      {/* Soil Bed */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[1.45, 1.45, 0.2, 32]} />
        <meshStandardMaterial color="#5C4033" roughness={0.9} />
      </mesh>

      {/* Pebbles around the soil */}
      <group position={[0, 0.06, 0]}>
        <mesh position={[0.6, 0, 0.4]}>
          <dodecahedronGeometry args={[0.12, 1]} />
          <meshStandardMaterial color="#E7DFD2" />
        </mesh>
        <mesh position={[-0.5, 0, -0.6]}>
          <dodecahedronGeometry args={[0.15, 1]} />
          <meshStandardMaterial color="#D9CBB7" />
        </mesh>
        <mesh position={[0.4, 0, -0.5]}>
          <dodecahedronGeometry args={[0.1, 1]} />
          <meshStandardMaterial color="#E7DFD2" />
        </mesh>
      </group>

      {/* SEED STAGE */}
      {stage === 'Seed' && (
        <group position={[0, 0.2, 0]}>
          <mesh>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color="#8FA58A" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.15, 0]}>
            <coneGeometry args={[0.06, 0.2, 16]} />
            <meshStandardMaterial color="#9BCEC1" />
          </mesh>
        </group>
      )}

      {/* MAIN STEM */}
      {stage !== 'Seed' && (
        <group>
          {/* Main Stem Trunk */}
          <mesh position={[0, height / 2, 0]}>
            <cylinderGeometry args={[0.08, 0.12, height, 16]} />
            <meshStandardMaterial
              color={stage === 'Tree' ? '#8B5A2B' : '#7CB5A6'}
              roughness={0.5}
            />
          </mesh>

          {/* Leaves Array */}
          {Array.from({ length: leafCount }).map((_, idx) => {
            const angle = (idx * Math.PI * 2) / 5 + idx * 0.4;
            const yPos = 0.3 + (idx * (height - 0.4)) / Math.max(1, leafCount);
            const sideScale = leafScale * (1 - idx * 0.03);

            return (
              <group
                key={idx}
                position={[0, yPos, 0]}
                rotation={[0.3 * Math.sin(idx), angle, 0.4 * Math.cos(idx)]}
              >
                <mesh position={[sideScale * 0.8, 0, 0]} rotation={[0, 0, -0.4]}>
                  <sphereGeometry args={[sideScale * 0.9, 16, 8]} />
                  <meshStandardMaterial
                    color={idx % 2 === 0 ? '#9BCEC1' : '#8FA58A'}
                    roughness={0.3}
                  />
                </mesh>
              </group>
            );
          })}

          {/* Flowers Array */}
          {Array.from({ length: flowerCount }).map((_, idx) => {
            const angle = (idx * Math.PI * 2) / Math.max(1, flowerCount);
            const yPos = height - 0.2 + idx * 0.1;
            return (
              <group
                key={`flower-${idx}`}
                position={[
                  Math.cos(angle) * 0.4,
                  yPos,
                  Math.sin(angle) * 0.4,
                ]}
              >
                <mesh>
                  <sphereGeometry args={[0.2, 16, 16]} />
                  <meshStandardMaterial color="#FFB6A6" roughness={0.2} />
                </mesh>
                <mesh position={[0, 0, 0.12]}>
                  <sphereGeometry args={[0.08, 16, 16]} />
                  <meshStandardMaterial color="#FFEBD3" />
                </mesh>
              </group>
            );
          })}
        </group>
      )}
    </group>
  );
}

interface ProductivityPlant3DProps {
  stage: PlantStage;
  completedCount: number;
  progressPercentage: number;
  streakDays: number;
}

export function ProductivityPlant3D({
  stage,
  completedCount,
  progressPercentage,
  streakDays,
}: ProductivityPlant3DProps) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 3000);
  };

  return (
    <div className="w-full relative flex flex-col items-center">
      {/* Click Toast */}
      {clicked && (
        <div className="absolute top-2 z-20 px-4 py-2 rounded-full bg-dayflow-text text-dayflow-bg dark:bg-dayflow-bg-dark dark:text-dayflow-text-dark text-xs font-semibold shadow-lg animate-bounce flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-dayflow-coral" />
          <span>You&apos;re growing consistently 🌱 Keep going!</span>
        </div>
      )}

      {/* 3D Canvas */}
      <div
        className="w-full h-[260px] cursor-pointer relative"
        onClick={handleClick}
        title="Click to interact with your Focus Plant!"
      >
        <Canvas camera={{ position: [0, 1.2, 4.2], fov: 42 }} gl={{ antialias: true, alpha: true }}>
          <ambientLight intensity={1.4} />
          <directionalLight position={[5, 8, 5]} intensity={1.6} />
          <directionalLight position={[-5, -5, -3]} intensity={0.4} color="#FFB6A6" />
          <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.3}>
            <ProceduralPlant stage={stage} completedCount={completedCount} />
          </Float>
        </Canvas>

        {/* Streak Badge */}
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-dayflow-surface-dark/90 border border-dayflow-border dark:border-dayflow-border-dark px-3 py-1.5 rounded-2xl shadow-soft flex items-center gap-1.5 backdrop-blur-md">
          <Trophy className="w-4 h-4 text-dayflow-coral" />
          <div className="text-right">
            <div className="text-xs font-bold text-dayflow-text dark:text-dayflow-text-dark">
              {streakDays} DAY
            </div>
            <div className="text-[9px] font-semibold tracking-widest uppercase text-dayflow-text-muted dark:text-dayflow-text-muted-dark">
              STREAK
            </div>
          </div>
        </div>
      </div>

      {/* Plant Stage Progression Navigation Bar */}
      <div className="w-full mt-2 px-2">
        <div className="flex items-center justify-between text-xs font-semibold text-dayflow-text-muted dark:text-dayflow-text-muted-dark mb-2">
          <span className={stage === 'Seed' ? 'text-dayflow-coral font-bold' : ''}>Seed</span>
          <span>→</span>
          <span className={stage === 'Sprout' ? 'text-dayflow-coral font-bold' : ''}>Sprout</span>
          <span>→</span>
          <span className={stage === 'Plant' ? 'text-dayflow-coral font-bold' : ''}>Plant</span>
          <span>→</span>
          <span className={stage === 'Flower' ? 'text-dayflow-coral font-bold' : ''}>Flower</span>
          <span>→</span>
          <span className={stage === 'Tree' ? 'text-dayflow-coral font-bold' : ''}>Tree</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-dayflow-cream dark:bg-dayflow-surface-muted-dark overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-dayflow-mint to-dayflow-coral transition-all duration-500 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="mt-1.5 text-center text-[11px] font-medium text-dayflow-text-muted dark:text-dayflow-text-muted-dark">
          Stage: <span className="font-bold text-dayflow-text dark:text-dayflow-text-dark">{stage}</span> ({completedCount} tasks completed)
        </div>
      </div>
    </div>
  );
}
