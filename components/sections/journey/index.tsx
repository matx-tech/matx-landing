'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { Rocket, BarChart3, Pencil, BookOpen, Target, Trophy } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
}

const milestones = [
  { id: 'alusta', label: 'Alusta', Icon: Rocket, stat: 'Tasuta prooviperiood' },
  { id: 'diagnostika', label: 'Diagnostika', Icon: BarChart3, stat: 'BKT analüüs' },
  { id: 'harjuta', label: 'Harjuta', Icon: Pencil, stat: 'ZPD ülesanded' },
  { id: 'opi', label: 'Õpi', Icon: BookOpen, stat: 'Personaalsed õpihinnad' },
  { id: 'meisterda', label: 'Meisterda', Icon: Target, stat: '85% tasemele' },
  { id: 'edasi', label: 'Edasi', Icon: Trophy, stat: 'Uus teema' },
];

export function JourneySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const travelerRef = useRef<SVGCircleElement>(null);
  const milestoneRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current || !pathRef.current || !travelerRef.current) return;

    const path = pathRef.current;

    gsap.set(travelerRef.current, {
      motionPath: {
        path,
        align: path,
        alignOrigin: [0.5, 0.5],
      },
    });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 20%',
      end: 'bottom 80%',
      scrub: 1.5,
      onUpdate: (self) => {
        const progress = self.progress;

        gsap.to(travelerRef.current, {
          motionPath: {
            path,
            align: path,
            alignOrigin: [0.5, 0.5],
            start: 0,
            end: progress,
          },
          duration: 0,
        });

        milestoneRefs.current.forEach((milestone, i) => {
          if (!milestone) return;
          const threshold = (i + 1) / (milestones.length + 1);
          if (progress >= threshold) {
            milestone.classList.add('active');
          } else {
            milestone.classList.remove('active');
          }
        });
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} id="opitee" className="relative py-48 md:py-64 bg-canvas overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-surface via-transparent to-surface pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 md:px-8 lg:px-16">
        {/* Section Title */}
        <div className="text-center mb-16">
          <span className="inline-block text-primary text-sm uppercase tracking-widest mb-4 font-mono">
            Õpitee
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-text-primary mb-6">
            Sinu isiklik õpitee
          </h2>
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto">
            Kõigile õpilastele, olenemata algpunktist
          </p>
        </div>

        {/* Journey Path */}
        <div className="relative min-h-[600px] md:min-h-[700px]">
          <svg
            viewBox="0 0 1200 600"
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* CVI gradient: Public Service Blue → Learning Teal → amber */}
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1E5A8A" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#0E6F68" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#B45309" stopOpacity="0.3" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Path */}
            <path
              ref={pathRef}
              d="M 100 550 Q 250 450 350 400 T 550 300 T 750 200 T 950 120 L 1100 50"
              fill="none"
              stroke="url(#pathGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              className="opacity-50"
            />

            {/* Abstract traveler dot (replaces owl mascot per CVI) */}
            <circle
              ref={travelerRef}
              r="12"
              fill="#1E5A8A"
              filter="url(#glow)"
              className="will-change-transform"
            />

            {/* Milestone Markers */}
            {[100, 350, 550, 750, 950, 1100].map((x, i) => {
              const y = [550, 400, 300, 200, 120, 50][i];
              return (
                <g key={milestones[i].id}>
                  <circle
                    cx={x}
                    cy={y}
                    r={24}
                    fill="var(--color-bg-surface)"
                    stroke="#1E5A8A"
                    strokeWidth="2"
                    className="milestone-line"
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r={12}
                    fill="#1E5A8A"
                    opacity="0.3"
                    className="milestone-fill"
                  />
                </g>
              );
            })}
          </svg>

          {/* Milestone Labels */}
          <div className="absolute inset-0">
            {milestones.map((m, i) => {
              const positions = [
                { left: '5%', top: '80%' },
                { left: '25%', top: '58%' },
                { left: '42%', top: '40%' },
                { left: '58%', top: '23%' },
                { left: '75%', top: '10%' },
                { left: '90%', top: '2%' },
              ];

              return (
                <div
                  key={m.id}
                  ref={(el) => {
                    milestoneRefs.current[i] = el;
                  }}
                  className="milestone absolute transition-all duration-500"
                  style={{
                    left: positions[i].left,
                    top: positions[i].top,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div className="milestone-card bg-surface border border-border rounded-xl p-4 min-w-[140px] text-center">
                    <div className="flex justify-center mb-2">
                      <m.Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-lg font-display font-bold text-text-primary">
                      {m.label}
                    </div>
                    <div className="text-xs text-text-secondary mt-1">
                      {m.stat}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        .milestone-card {
          opacity: 0.4;
          transform: scale(0.9);
          transition: opacity 0.5s ease, transform 0.3s ease;
        }

        .milestone.active .milestone-card {
          opacity: 1;
          transform: scale(1);
          border-color: rgba(30, 90, 138, 0.5);
          box-shadow: 0 0 30px rgba(30, 90, 138, 0.15);
        }

        .milestone-line {
          transition: opacity 0.5s ease;
        }

        .milestone.active .milestone-line {
          stroke: #0E6F68;
          stroke-width: 3;
        }

        .milestone.active .milestone-fill {
          opacity: 1 !important;
        }
      `}</style>
    </section>
  );
}
