import React from 'react';
import { motion } from 'motion/react';
import { ErgonomicsInfo } from '../types';

interface DeskLayoutPreviewProps {
  ergonomics: ErgonomicsInfo;
  height: number;
}

export default function DeskLayoutPreview({ ergonomics, height }: DeskLayoutPreviewProps) {
  return (
    <div className="bg-[#0f0f0f] p-6 border-4 border-white h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-black text-[#CCFF00] uppercase tracking-widest font-mono">
            ERGONOMIC POSITION SCHEMATIC
          </h3>
          <span className="text-[10px] bg-[#CCFF00] text-black px-3 py-1 font-black uppercase tracking-wider border border-black">
            신장 {height}cm 맞춤
          </span>
        </div>
        <p className="text-xs text-white/70 mb-6 font-mono uppercase tracking-wide">
          이 비율적 다이어그램은 권장되는 책상 및 의자 높이를 원근감 인체 비율 디자인으로 시각화한 수치입니다.
        </p>
      </div>

      {/* Posture Vector Diagram with High Contrast Cyberpunk Vibe */}
      <div className="relative w-full h-64 bg-black border-2 border-white/30 overflow-hidden p-4 flex items-center justify-center">
        <svg viewBox="0 0 400 240" className="w-full h-full text-white">
          {/* Floor Grid Line */}
          <line x1="10" y1="210" x2="390" y2="210" stroke="#CCFF00" strokeWidth="2" strokeDasharray="3 3" opacity="0.4" />
          <text x="320" y="225" className="text-[9px] fill-[#CCFF00] font-mono tracking-widest uppercase font-bold">FLOOR_LEVEL</text>

          {/* Chair Representation */}
          {/* Base */}
          <line x1="120" y1="160" x2="120" y2="210" stroke="#ffffff" strokeWidth="4" />
          <circle cx="120" cy="210" r="4" fill="#CCFF00" />
          <line x1="100" y1="210" x2="140" y2="210" stroke="#ffffff" strokeWidth="3" />
          
          {/* Cushion */}
          <rect x="90" y="152" width="60" height="8" rx="0" fill="#ffffff" />
          {/* Back support */}
          <line x1="95" y1="152" x2="95" y2="80" stroke="#ffffff" strokeWidth="5" strokeLinecap="square" />
          <rect x="87" y="80" width="12" height="40" rx="0" fill="#CCFF00" stroke="#000000" strokeWidth="1" />

          {/* Desk Representation */}
          {/* Desktop Surface */}
          <rect x="180" y="105" width="190" height="10" rx="0" fill="#ffffff" />
          {/* Desk Leg */}
          <line x1="330" y1="115" x2="330" y2="210" stroke="#ffffff" strokeWidth="5" />
          <line x1="300" y1="210" x2="360" y2="210" stroke="#ffffff" strokeWidth="3" />

          {/* Ergonomic Dimensions Labels with leader lines in Neon Lime */}
          {/* Chair height leader line */}
          <path d="M 165 156 L 175 156 L 175 210 L 165 210" fill="none" stroke="#CCFF00" strokeWidth="2" />
          <text x="182" y="188" className="text-[11px] font-black fill-[#CCFF00] font-mono">{ergonomics.chairHeight}cm</text>
          
          {/* Desk height leader line */}
          <path d="M 378 110 L 388 110 L 388 210 L 378 210" fill="none" stroke="#CCFF00" strokeWidth="2" />
          <text x="345" y="160" className="text-[11px] font-black fill-[#CCFF00] font-mono" textAnchor="end">{ergonomics.deskHeight}cm</text>

          {/* Posture Outline Model Sketch - Rendered in Neon Lime to symbolize the live state */}
          {/* Foot */}
          <line x1="140" y1="210" x2="155" y2="210" stroke="#CCFF00" strokeWidth="3" strokeLinecap="square" />
          {/* Shin */}
          <line x1="140" y1="156" x2="140" y2="210" stroke="#CCFF00" strokeWidth="3.5" strokeLinecap="square" />
          {/* Thigh (horizontal) */}
          <line x1="110" y1="154" x2="140" y2="154" stroke="#CCFF00" strokeWidth="4.5" strokeLinecap="square" />
          {/* Spine (vertical/neutral) */}
          <line x1="110" y1="154" x2="115" y2="75" stroke="#CCFF00" strokeWidth="5" strokeLinecap="square" />
          {/* Head (neutral ear-lobe-to-shoulder alignment) */}
          <circle cx="118" cy="55" r="12" fill="#000000" stroke="#CCFF00" strokeWidth="3" />
          {/* Neck */}
          <line x1="115" y1="75" x2="117" y2="67" stroke="#CCFF00" strokeWidth="4" />
          {/* Eye line/gaze line to screen */}
          <line x1="126" y1="52" x2="214" y2="52" stroke="#ff5050" strokeWidth="1.5" strokeDasharray="3 3" />
          {/* Shoulder/Upper arm */}
          <line x1="122" y1="85" x2="128" y2="120" stroke="#CCFF00" strokeWidth="4" strokeLinecap="square" />
          {/* Lower arm (resting on desk/armrest) */}
          <line x1="128" y1="120" x2="190" y2="114" stroke="#CCFF00" strokeWidth="4" strokeLinecap="square" />

          {/* Monitor Representation */}
          <rect x="230" y="30" width="10" height="70" rx="0" fill="#ffffff" /> {/* side profile screen */}
          <line x1="235" y1="65" x2="250" y2="110" stroke="#ffffff" strokeWidth="3" /> {/* Monitor arm */}
          <rect x="240" y="105" width="22" height="5" fill="#ffffff" /> {/* Stand base */}

          {/* Laptop Side representation */}
          <path d="M 195 110 L 215 110 L 225 90" fill="none" stroke="#CCFF00" strokeWidth="2.5" strokeLinecap="square" />

          {/* Gaze symbol indicator */}
          <path d="M 128 50 L 132 52 L 128 54 Z" fill="#ff5050" />
          <text x="170" y="45" className="text-[9px] font-black fill-[#ff5050] font-mono uppercase tracking-wider">GAZE PARALLEL</text>
          
          {/* Angles annotation */}
          <text x="150" y="95" className="text-[9px] font-bold fill-white font-mono uppercase">ELBOW {ergonomics.elbowAngle}</text>
          <path d="M 125 105 A 15 15 0 0 0 133 120" fill="none" stroke="#CCFF00" strokeWidth="1" />
        </svg>

        {/* Dynamic Overlay Tags */}
        <div className="absolute top-3 left-3 bg-black px-2.5 py-1 border border-white flex items-center gap-1.5 shadow-sm">
          <div className="w-2 h-2 bg-[#CCFF00] animate-pulse" />
          <span className="text-[9px] font-black text-[#CCFF00] font-mono tracking-widest uppercase">IDEAL SYMMETRY</span>
        </div>
      </div>

      {/* Bottom specs details */}
      <div className="mt-6 space-y-3 pt-4 border-t-2 border-white/10 font-mono text-xs uppercase tracking-wider">
        <div className="flex justify-between items-center">
          <span className="text-white/60">눈-모니터 권장 거리</span>
          <span className="font-bold text-white">{ergonomics.eyeDistance}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white/60">팔꿈치 가이드 각도</span>
          <span className="font-bold text-white">{ergonomics.elbowAngle}</span>
        </div>
        <div className="flex justify-between items-center border-t border-white/10 pt-2">
          <span className="text-[#CCFF00] font-bold">책상 추천 높이</span>
          <span className="font-black text-[#CCFF00] text-sm">{ergonomics.deskHeight} CM</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#CCFF00] font-bold">의자 추천 높이</span>
          <span className="font-black text-[#CCFF00] text-sm">{ergonomics.chairHeight} CM</span>
        </div>
      </div>
    </div>
  );
}
