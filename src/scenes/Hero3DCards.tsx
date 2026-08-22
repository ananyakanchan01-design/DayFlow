import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Task } from '@/types/task';
import { Code, BookOpen, Dumbbell, Flame, Heart, Clock, Check } from 'lucide-react';

// --- 3D DESK ORGANIZER STATION COMPONENT ---
function DeskOrganizerStation({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    const sp = scrollProgress.current;

    // Subtle, calm motion
    const mouseX = state.pointer.x * 0.03;
    const mouseY = state.pointer.y * 0.03;

    groupRef.current.rotation.y = -0.08 + Math.sin(t * 0.18) * 0.02 + mouseX + sp * 0.15;
    groupRef.current.rotation.x = 0.05 + Math.cos(t * 0.15) * 0.015 + mouseY;
    groupRef.current.position.y = -0.45 - sp * 0.5;
  });

  return (
    <group ref={groupRef} position={[0, -0.45, -0.15]} scale={[1.1, 1.1, 1.1]}>
      {/* GLOWING BASE TRAY */}
      <mesh position={[0, -0.22, 0]} receiveShadow>
        <cylinderGeometry args={[1.9, 2.1, 0.18, 64]} />
        <meshStandardMaterial color="#FFEBD3" roughness={0.35} metalness={0.05} />
      </mesh>

      {/* INNER ACCENT PLATFORM */}
      <mesh position={[0, -0.11, 0]}>
        <cylinderGeometry args={[1.65, 1.65, 0.06, 64]} />
        <meshStandardMaterial color="#FFF9F3" roughness={0.2} />
      </mesh>

      {/* MINI POTTED PLANT */}
      <group position={[-0.85, 0.22, 0.25]}>
        <mesh receiveShadow castShadow>
          <cylinderGeometry args={[0.38, 0.28, 0.52, 32]} />
          <meshStandardMaterial color="#FFB6A6" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.26, 0]}>
          <cylinderGeometry args={[0.36, 0.36, 0.06, 32]} />
          <meshStandardMaterial color="#4A3525" roughness={0.9} />
        </mesh>
        {[0, 1.2, 2.4, 3.6, 4.8].map((angle, idx) => (
          <group key={idx} rotation={[0.4, angle, 0.2]}>
            <mesh position={[0.2, 0.32, 0]} rotation={[0, 0, -0.3]}>
              <sphereGeometry args={[0.16, 16, 8]} />
              <meshStandardMaterial color="#8FA58A" roughness={0.3} />
            </mesh>
          </group>
        ))}
      </group>

      {/* CENTER CLIPBOARD - FOCUS ON WHAT MATTERS */}
      <group position={[0.0, 0.45, -0.2]} rotation={[-0.08, 0.04, -0.02]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.25, 1.55, 0.06]} />
          <meshStandardMaterial color="#E7DFD2" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.72, 0.04]}>
          <boxGeometry args={[0.34, 0.09, 0.04]} />
          <meshStandardMaterial color="#FFB6A6" metalness={0.5} roughness={0.2} />
        </mesh>
        <Html
          transform
          distanceFactor={5.2}
          position={[0, 0, 0.05]}
          className="pointer-events-none select-none w-[135px] p-3 rounded-2xl bg-white/95 text-center shadow-sm border border-[#EFE7DC]"
        >
          <div className="flex items-center justify-center text-dayflow-coral mb-1">
            <Heart className="w-3.5 h-3.5 fill-current animate-pulse" />
          </div>
          <p className="font-serif font-bold text-xs text-[#24313A] leading-tight">
            Focus on what matters.
          </p>
          <span className="inline-block mt-1 text-[9px] font-semibold text-dayflow-text-muted">
            Daily Rhythm ✨
          </span>
        </Html>
      </group>

      {/* PENCIL CUP WITH PENS */}
      <group position={[0.95, 0.3, 0.1]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.32, 0.25, 0.54, 32]} />
          <meshStandardMaterial color="#9BCEC1" roughness={0.3} />
        </mesh>
        <mesh position={[-0.05, 0.44, 0]} rotation={[0.1, 0, 0.12]}>
          <cylinderGeometry args={[0.022, 0.022, 0.58, 16]} />
          <meshStandardMaterial color="#67A2C5" />
        </mesh>
        <mesh position={[0.05, 0.48, -0.04]} rotation={[-0.12, 0, -0.08]}>
          <cylinderGeometry args={[0.022, 0.022, 0.62, 16]} />
          <meshStandardMaterial color="#FFB6A6" />
        </mesh>
        <mesh position={[0, 0.4, 0.05]} rotation={[0.15, 0, 0]}>
          <cylinderGeometry args={[0.022, 0.022, 0.52, 16]} />
          <meshStandardMaterial color="#24313A" />
        </mesh>
      </group>

      {/* PASTEL ACCENT SPHERES */}
      <mesh position={[0.72, 0.02, 0.72]} castShadow>
        <sphereGeometry args={[0.14, 32, 32]} />
        <meshStandardMaterial color="#FFB6A6" roughness={0.2} />
      </mesh>
      <mesh position={[-0.58, 0.02, 0.78]} castShadow>
        <sphereGeometry args={[0.11, 32, 32]} />
        <meshStandardMaterial color="#67A2C5" roughness={0.2} />
      </mesh>
    </group>
  );
}

// --- CINEMATIC 3D ORBITAL TASK CARD COMPONENT ---
interface OrbitalCardProps {
  id: string;
  targetPos: [number, number, number];
  targetRot: [number, number, number];
  title: string;
  category: string;
  due: string;
  badge?: string;
  badgeColor?: string;
  progressPercent?: number;
  isCompleted?: boolean;
  color: string;
  glowColor: string;
  icon: React.ReactNode;
  motionType: 'vertical' | 'tilt' | 'diagonal' | 'orbital';
  depthFactor: number;
  entranceProgress: React.MutableRefObject<number>;
  scrollProgress: React.MutableRefObject<number>;
  isReducedMotion: boolean;
  onToggleTask?: (id: string) => void;
}

function OrbitalCard({
  id,
  targetPos,
  targetRot,
  title,
  category,
  due,
  badge,
  badgeColor = 'bg-[#FFB6A6]/20 text-[#D96B52]',
  progressPercent,
  isCompleted = false,
  color,
  glowColor,
  icon,
  motionType,
  depthFactor,
  entranceProgress,
  scrollProgress,
  isReducedMotion,
  onToggleTask,
}: OrbitalCardProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    const ep = isReducedMotion ? 1 : entranceProgress.current;
    const sp = isReducedMotion ? 0 : scrollProgress.current;

    // 1. Smooth entrance from center
    const currentBaseX = THREE.MathUtils.lerp(0, targetPos[0], ep);
    const currentBaseY = THREE.MathUtils.lerp(0, targetPos[1], ep);
    const currentBaseZ = THREE.MathUtils.lerp(0, targetPos[2], ep);

    // 2. Calm, gentle micro-motions
    let customX = 0;
    let customY = 0;
    let customRotY = 0;

    if (!isReducedMotion) {
      switch (motionType) {
        case 'vertical':
          customY = Math.sin(t * 0.25) * 0.03;
          break;
        case 'tilt':
          customRotY = Math.cos(t * 0.2) * 0.02;
          break;
        case 'diagonal':
          customX = Math.sin(t * 0.2 + 1.2) * 0.025;
          customY = Math.cos(t * 0.2 + 1.2) * 0.02;
          break;
        case 'orbital':
        default:
          customX = Math.cos(t * 0.18) * 0.03;
          customY = Math.sin(t * 0.18) * 0.025;
          break;
      }
    }

    // 3. Calm Mouse Parallax
    const mouseX = state.pointer.x * (0.08 + depthFactor * 0.04);
    const mouseY = state.pointer.y * (0.08 + depthFactor * 0.04);

    // 4. Smooth Scroll Drift
    const scrollOutwardY = -sp * 1.2;

    // 5. Hover Boost (+0.25 Z offset)
    const hoverZ = isHovered ? 0.25 : 0;
    const hoverScale = isHovered ? 1.04 : 1.0;

    const finalX = currentBaseX + customX + mouseX;
    const finalY = currentBaseY + customY + mouseY + scrollOutwardY;
    const finalZ = currentBaseZ + hoverZ;

    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, finalX, 0.1);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, finalY, 0.1);
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, finalZ, 0.1);

    meshRef.current.scale.lerp(new THREE.Vector3(hoverScale, hoverScale, hoverScale), 0.1);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRot[1] + customRotY, 0.1);
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRot[0], 0.1);
    meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, targetRot[2], 0.1);
  });

  return (
    <group
      ref={meshRef}
      position={[0, 0, 0]}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
    >
      {/* 3D Soft Clay Mesh Backing */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.1, 1.3, 0.07]} />
        <meshStandardMaterial
          color={color}
          roughness={0.2}
          metalness={0.05}
        />
      </mesh>

      {/* Rich Interactive HTML Overlay - Sized w-[205px] */}
      <Html
        transform
        distanceFactor={4.8}
        position={[0, 0, 0.05]}
        className={`pointer-events-auto select-none w-[205px] p-3 rounded-2xl bg-white/95 dark:bg-[#202B31]/95 border transition-all duration-300 ${
          isHovered
            ? `shadow-soft-lg border-opacity-100 cursor-pointer`
            : `shadow-clay border-[#EFE7DC] dark:border-[#2F3D47]`
        }`}
        style={{
          borderColor: isHovered ? glowColor : undefined,
          boxShadow: isHovered ? `0 14px 30px -6px ${glowColor}35` : undefined,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-[#FFF9F3] dark:bg-[#25323A] border border-[#EFE7DC] dark:border-[#2F3D47] flex items-center justify-center text-dayflow-text shrink-0 shadow-sm">
              {icon}
            </div>
            <span className="text-[8.5px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#FFEBD3] text-[#24313A] dark:bg-[#2C3942] dark:text-[#F7F3EC]">
              {category}
            </span>
          </div>

          {badge && (
            <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded-full ${badgeColor}`}>
              {badge}
            </span>
          )}
        </div>

        {/* Title & Checkbox */}
        <div className="flex items-start gap-1.5 mb-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleTask) onToggleTask(id);
            }}
            className="group relative focus:outline-none shrink-0 mt-0.5"
          >
            {isCompleted ? (
              <div className="w-3.5 h-3.5 rounded-full bg-[#9BCEC1] text-white flex items-center justify-center shadow-sm transition-transform group-hover:scale-110">
                <Check className="w-2 h-2 stroke-[3]" />
              </div>
            ) : (
              <div className="w-3.5 h-3.5 rounded-full border-2 border-dayflow-coral transition-transform group-hover:scale-110 group-hover:bg-dayflow-coral/20" />
            )}
          </button>
          <h4
            className={`text-[11.5px] font-bold leading-tight line-clamp-2 ${
              isCompleted
                ? 'line-through text-dayflow-text-muted dark:text-dayflow-text-muted-dark'
                : 'text-[#24313A] dark:text-[#F7F3EC]'
            }`}
          >
            {title}
          </h4>
        </div>

        {/* Progress Bar */}
        {typeof progressPercent === 'number' && (
          <div className="mb-1.5 space-y-1">
            <div className="w-full h-1.5 rounded-full bg-dayflow-cream dark:bg-dayflow-surface-muted-dark overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-dayflow-mint to-dayflow-coral rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-[9px] font-semibold text-[#6B7A85] dark:text-[#9CAAB5] pt-1 border-t border-[#EFE7DC]/60 dark:border-[#2F3D47]/60">
          <div className="flex items-center gap-1">
            <Clock className="w-2.5 h-2.5 text-dayflow-coral" />
            <span>{due}</span>
          </div>

          <span className="w-1.5 h-1.5 rounded-full bg-dayflow-mint animate-pulse" />
        </div>
      </Html>
    </group>
  );
}

interface Hero3DCardsProps {
  tasks?: Task[];
  onToggleTask?: (id: string) => void;
}

export function Hero3DCards({ tasks = [], onToggleTask }: Hero3DCardsProps) {
  const entranceProgress = useRef(0);
  const scrollProgress = useRef(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const heroEl = document.getElementById('hero');
      if (!heroEl) return;
      const scrollY = window.scrollY;
      const maxScroll = heroEl.offsetHeight || 600;
      const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
      scrollProgress.current = progress;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;

    const animateEntrance = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;
      const duration = 1.2;

      const progress = Math.min(1, elapsed / duration);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      entranceProgress.current = eased;

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateEntrance);
      }
    };

    animationFrameId = requestAnimationFrame(animateEntrance);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const orbitalCardsData = useMemo(() => {
    const taskMap = new Map(tasks.map((t) => [t.id, t]));
    const findTask = (id: string, fallbackTitle: string, fallbackCat: string) => {
      const real = taskMap.get(id) || tasks.find((t) => t.title.toLowerCase().includes(fallbackTitle.toLowerCase().split(' ')[0]));
      return {
        id: real ? real.id : id,
        title: real ? real.title : fallbackTitle,
        category: real ? real.category : fallbackCat,
        completed: real ? real.completed : false,
        due: real ? (real.dueTime ? `Today, ${real.dueTime}` : real.dueDate) : 'Today, 5:00 PM',
      };
    };

    const reactTask = findTask('1', 'Complete React Website', 'Personal Project');
    const dbmsTask = findTask('2', 'Study DBMS', 'College');
    const leetcodeTask = findTask('3', 'Solve 3 LeetCode Problems', 'Coding');
    const workoutTask = findTask('5', 'Workout & Stretch', 'Fitness');

    return [
      {
        // 1. Top Left Corner (x = -1.95) - Fills top-left space inside right part
        id: dbmsTask.id,
        targetPos: [-1.95, 1.25, 0.1] as [number, number, number],
        targetRot: [-0.02, 0.05, -0.01] as [number, number, number],
        title: dbmsTask.title,
        category: dbmsTask.category,
        due: dbmsTask.due,
        badge: '⏱️ 45m',
        badgeColor: 'bg-[#67A2C5]/20 text-[#2B6080] dark:text-[#91CBEB]',
        progressPercent: 60,
        isCompleted: dbmsTask.completed,
        color: '#9BCEC1',
        glowColor: '#67A2C5',
        icon: <BookOpen className="w-3 h-3 text-[#24313A]" />,
        motionType: 'vertical' as const,
        depthFactor: 0.2,
      },
      {
        // 2. Top Right Corner (x = +1.95) - Fills top-right space inside right part
        id: reactTask.id,
        targetPos: [1.95, 1.25, 0.1] as [number, number, number],
        targetRot: [0.02, -0.05, 0.01] as [number, number, number],
        title: reactTask.title,
        category: reactTask.category,
        due: reactTask.due,
        badge: '🔥 High Priority',
        badgeColor: 'bg-[#FFB6A6]/30 text-[#B8422A] dark:bg-[#FFB6A6]/20 dark:text-[#FFB6A6]',
        progressPercent: 75,
        isCompleted: reactTask.completed,
        color: '#FFEBD3',
        glowColor: '#FFB6A6',
        icon: <Code className="w-3 h-3 text-[#67A2C5]" />,
        motionType: 'tilt' as const,
        depthFactor: 0.5,
      },
      {
        // 3. Bottom Left Corner (x = -1.95) - Fills bottom-left space inside right part
        id: workoutTask.id,
        targetPos: [-1.95, -1.25, 0.1] as [number, number, number],
        targetRot: [-0.01, 0.04, 0.01] as [number, number, number],
        title: workoutTask.title,
        category: workoutTask.category,
        due: workoutTask.due,
        badge: '✓ 30 mins',
        badgeColor: 'bg-[#8FA58A]/30 text-[#2C4D26] dark:text-[#8FA58A]',
        isCompleted: workoutTask.completed,
        color: '#E7DFD2',
        glowColor: '#9BCEC1',
        icon: <Dumbbell className="w-3 h-3 text-[#67A2C5]" />,
        motionType: 'diagonal' as const,
        depthFactor: 0.3,
      },
      {
        // 4. Bottom Right Corner (x = +1.95) - Fills bottom-right space inside right part
        id: leetcodeTask.id,
        targetPos: [1.95, -1.25, 0.1] as [number, number, number],
        targetRot: [0.02, -0.04, -0.01] as [number, number, number],
        title: leetcodeTask.title,
        category: leetcodeTask.category,
        due: leetcodeTask.due,
        badge: '⚡ Streak +1',
        badgeColor: 'bg-[#9BCEC1]/30 text-[#1F6956] dark:text-[#9BCEC1]',
        progressPercent: 66,
        isCompleted: leetcodeTask.completed,
        color: '#FFB6A6',
        glowColor: '#FFEBD3',
        icon: <Flame className="w-3 h-3 text-[#24313A]" />,
        motionType: 'orbital' as const,
        depthFactor: 0.6,
      },
    ];
  }, [tasks]);

  return (
    <div className="w-full h-full min-h-[520px] sm:min-h-[560px] relative flex items-center justify-center overflow-visible pointer-events-none">
      <Canvas
        camera={{ position: [0, 0.1, 7.8], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={1.8} />
        <directionalLight position={[8, 10, 6]} intensity={1.8} />
        <directionalLight position={[-8, -5, -4]} intensity={0.6} color="#9BCEC1" />

        {/* Central 3D Desk Organizer Station */}
        <DeskOrganizerStation scrollProgress={scrollProgress} />

        {/* 4 Corner Orbital Task Cards */}
        {orbitalCardsData.map((card) => (
          <OrbitalCard
            key={card.id}
            {...card}
            entranceProgress={entranceProgress}
            scrollProgress={scrollProgress}
            isReducedMotion={isReducedMotion}
            onToggleTask={onToggleTask}
          />
        ))}
      </Canvas>
    </div>
  );
}
