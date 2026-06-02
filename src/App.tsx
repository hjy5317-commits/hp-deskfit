import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sliders, 
  Sparkles, 
  Activity, 
  CheckCircle, 
  ArrowRight, 
  Volume2, 
  Wrench, 
  HelpCircle, 
  MessageSquare, 
  PhoneCall, 
  FileText, 
  Lock, 
  Menu, 
  ShoppingCart, 
  User, 
  Search,
  Check,
  AlertTriangle
} from 'lucide-react';

import { WorkspaceRequest, WorkspaceResponse } from './types';
import DeskLayoutPreview from './components/DeskLayoutPreview';
import ProductCatalog from './components/ProductCatalog';
import FaqSection from './components/FaqSection';
import TestimonialSection from './components/TestimonialSection';

export default function App() {
  // Form State
  const [height, setHeight] = useState<number>(173);
  const [workType, setWorkType] = useState<'developer' | 'designer' | 'creator' | 'general'>('developer');
  const [deskType, setDeskType] = useState<'fixed' | 'height_adjustable'>('fixed');
  const [spaceSize, setSpaceSize] = useState<'compact' | 'medium' | 'executive'>('medium');
  const [notes, setNotes] = useState<string>('');
  
  // Loading & Results
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<WorkspaceResponse | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  // Active sub-navbar tab in dark prelude section
  const [activeHelpTab, setActiveHelpTab] = useState<string>('Browse Topics');

  // Simple Markdown Parser for AI summary rendering
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('###')) {
        return (
          <h4 key={idx} className="text-base md:text-lg font-black text-[#CCFF00] mt-6 mb-2 font-sans uppercase tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 bg-[#CCFF00] rounded-none inline-block transform rotate-45" />
            {trimmed.replace('###', '').trim()}
          </h4>
        );
      }
      if (trimmed.startsWith('####')) {
        return (
          <h5 key={idx} className="text-sm md:text-base font-black text-white mt-4 mb-2 font-sans uppercase tracking-tight">
            {trimmed.replace('####', '').trim()}
          </h5>
        );
      }
      if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
        // Look for bold elements within the bullet point
        let rawContent = trimmed.substring(1).trim();
        let contentElement: React.ReactNode = rawContent;
        if (rawContent.includes('**')) {
          const parts = rawContent.split('**');
          contentElement = parts.map((p, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-bold text-[#CCFF00]">{p}</strong> : p);
        }
        return (
          <li key={idx} className="list-none pl-4 border-l-2 border-[#CCFF00] text-xs md:text-sm text-[#e2e2e2] space-y-1.5 my-2.5 leading-relaxed">
            {contentElement}
          </li>
        );
      }
      if (trimmed === '') {
        return <div key={idx} className="h-2" />;
      }
      if (trimmed.includes('**')) {
        const parts = trimmed.split('**');
        return (
          <p key={idx} className="text-xs md:text-sm text-[#d2d2d2] leading-relaxed mb-3 text-justify">
            {parts.map((p, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-bold text-[#CCFF00]">{p}</strong> : p)}
          </p>
        );
      }
      return <p key={idx} className="text-xs md:text-sm text-[#d2d2d2] leading-relaxed mb-3 text-justify">{trimmed}</p>;
    });
  };

  const calculateErgonomics = async () => {
    setLoading(true);
    setErrorStatus(null);
    try {
      const payload: WorkspaceRequest = {
        height,
        workType,
        deskType,
        spaceSize,
        notes: notes.trim() === "" ? undefined : notes
      };

      const response = await fetch('/api/workspace/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('워크스페이스 계산 요청 중 요류가 발생했습니다.');
      }

      const data = (await response.json()) as WorkspaceResponse;
      setResult(data);
      setHasSearched(true);
    } catch (err: any) {
      console.error(err);
      setErrorStatus(err.message || '네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handlePresetSelect = (selectedHeight: number, selWork: 'developer' | 'designer' | 'creator' | 'general', textNotes: string) => {
    setHeight(selectedHeight);
    setWorkType(selWork);
    setNotes(textNotes);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-[#CCFF00] selection:text-black">
      {/* 1. HP UTILITY STRIP (36px high, Stark Black/Lime detail) */}
      <div className="bg-[#0f0f0f] text-white h-9 flex items-center justify-between px-4 md:px-8 text-xs select-none border-b border-white/10">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10.5px] uppercase text-[#CCFF00] tracking-[0.2em] font-black">
            HP DESKFIT ERGO // CREATIVE SYNC
          </span>
          <span className="border-l border-white/20 h-3" />
          <div className="flex gap-2">
            <button className="text-white hover:text-[#CCFF00] font-semibold uppercase tracking-wider text-[10px]">For Home</button>
            <span className="text-white/20">/</span>
            <button className="text-[#c2c2c2] hover:text-[#CCFF00] font-semibold uppercase tracking-wider text-[10px]">For Business</button>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6 font-mono text-[10.5px]">
          <span className="text-white/60">SESSION ACTIVE</span>
          <span className="text-[#CCFF00] font-bold">● LATEST INTEL VERSION</span>
          <a href="#cart" className="hover:text-[#CCFF00] flex items-center gap-1 font-bold text-white uppercase tracking-wider">
            <ShoppingCart size={13} />
            <span>CONFIG CART</span>
          </a>
        </div>
      </div>

      {/* 2. STARK TOP NAV */}
      <header className="bg-black sticky top-0 z-40 border-b-4 border-[#CCFF00] select-none shadow-[0_4px_20px_rgba(204,255,0,0.15)]">
        <div className="h-16 max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-black font-mono tracking-tighter text-[#CCFF00]" style={{ fontFamily: "'Arial Black', sans-serif" }}>
                HP
              </span>
              <span className="h-6 w-1 bg-white transform rotate-12" />
              <span className="text-sm font-black tracking-[0.2em] text-white uppercase font-mono">
                DESKFIT
              </span>
            </div>
            
            <nav className="hidden lg:flex items-center gap-6">
              <a href="#planner" className="text-xs font-black uppercase tracking-widest text-[#CCFF00] bg-white/10 px-3 py-1 border border-[#CCFF00]/40">
                Workspace Planner
              </a>
              <a href="#catalog" className="text-xs font-black uppercase tracking-widest text-white hover:text-[#CCFF00] transition-all">
                Laptops
              </a>
              <a href="#catalog" className="text-xs font-black uppercase tracking-widest text-white hover:text-[#CCFF00] transition-all">
                Monitors
              </a>
              <a href="#catalog" className="text-xs font-black uppercase tracking-widest text-white hover:text-[#CCFF00] transition-all">
                Printers
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <input 
                type="text" 
                placeholder="인체공학 기기 및 모델 검색..."
                className="bg-[#121212] border-2 border-white text-xs px-4 py-2 w-48 font-mono text-white placeholder-white/40 focus:outline-none focus:border-[#CCFF00]"
              />
              <Search size={14} className="absolute right-3 top-2.5 text-white/60" />
            </div>
            <button className="bg-[#CCFF00] text-black border-2 border-black hover:bg-white hover:text-black text-xs font-black uppercase tracking-wider px-5 py-2.5 transition-all">
              LOGIN
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO PROMO CARD (Bold Typography Cyber Brutalist Vibe) */}
      <section className="relative py-12 md:py-20 bg-[#070707] overflow-hidden border-b-2 border-white/10">
        {/* Geometric Brutalist Slashes aligned to Design Guidelines */}
        <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-16 h-80 bg-[#CCFF00] opacity-10 transform -skew-x-[30deg] rounded-none hidden xl:block" />
        <div className="absolute -right-12 top-1/2 -translate-y-1/2 w-24 h-96 bg-[#CCFF00] opacity-100 transform -skew-x-[25deg] rounded-none hidden xl:block shadow-[0_0_40px_rgba(204,255,0,0.5)]" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
            
            {/* Hero Text with Mega bold scale */}
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 text-[11px] font-black text-black bg-[#CCFF00] uppercase tracking-widest font-mono">
                [ HP INVENT // SMART ERGO DESIGNER ]
              </span>
              
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-[0.9]" style={{ fontFamily: "'Arial Black', sans-serif" }}>
                SPARK <br />
                <span className="text-[#CCFF00]">YOUR SETUP</span>
              </h1>
              
              <p className="text-xs md:text-sm text-white/80 max-w-xl leading-relaxed uppercase font-semibold font-mono tracking-wide">
                재택근무자와 오피스 전문가를 위해 개발된 대한민국 유일의 1:1 스마트 워크스페이스 아키텍트입니다. 키와 작업 환경, 통증 부위를 기반으로 AI 컨설턴트가 최상의 데스크 수치 및 HP 명장 장비들을 조합합니다.
              </p>

              {/* Real World Preset Buttons (Rotation aligned with brutalist design candidates) */}
              <div className="pt-2">
                <span className="text-[10px] font-bold text-[#CCFF00] uppercase tracking-[0.2em] block mb-3 font-mono">신속 원격 프리셋 매칭</span>
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => handlePresetSelect(178, 'developer', '만성 거북목 증상과 어깨 뭉침, 듀얼 와이드 모니터 셋업 희망')}
                    className="bg-[#121212] hover:bg-[#CCFF00] hover:text-black text-[11px] text-white font-black uppercase tracking-widest py-3 px-4 border-2 border-white transform -rotate-1 transition-all"
                  >
                    개발자 프리셋 (178cm)
                  </button>
                  <button 
                    onClick={() => handlePresetSelect(163, 'designer', '타블렛 전용 플렉솔로지 데공 공간 필요, 손목 압박 최소화 마우스 선호')}
                    className="bg-[#121212] hover:bg-[#CCFF00] hover:text-black text-[11px] text-white font-black uppercase tracking-widest py-3 px-4 border-2 border-[#CCFF00] transform rotate-2 transition-all"
                  >
                    아티스트 프리셋 (163cm)
                  </button>
                  <button 
                    onClick={() => handlePresetSelect(182, 'creator', '영상 편집 공간, 최고출력 스피커 배치와 대형 레이저 복합기 수납')}
                    className="bg-[#121212] hover:bg-[#CCFF00] hover:text-black text-[11px] text-white font-black uppercase tracking-widest py-3 px-4 border-2 border-white transform -rotate-1 transition-all"
                  >
                    크리에이터 프리셋 (182cm)
                  </button>
                </div>
              </div>
            </div>

            {/* Hero Visual Mockup */}
            <div className="lg:col-span-5 relative">
              <div className="bg-[#121212] rounded-none p-8 border-4 border-[#CCFF00] relative shadow-[0_0_30px_rgba(204,255,0,0.15)] overflow-hidden transform rotate-1">
                <div className="absolute top-4 right-4 bg-[#CCFF00] text-black text-[10px] font-black uppercase font-mono px-3 py-1 border-2 border-black">
                  HP DESIGN LAB
                </div>
                
                {/* Visual of laptop setup inside a clean workspace card */}
                <div className="space-y-4 pt-4">
                  <div className="bg-black p-4 border-2 border-white flex flex-col justify-between h-44">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] text-[#CCFF00] font-mono block uppercase font-bold tracking-widest">DEVICE MODEL SPECS</span>
                        <span className="text-xs font-black text-white uppercase tracking-wider">HP Workspace Fit Standard</span>
                      </div>
                      <span className="text-xl text-[#CCFF00]">⚡</span>
                    </div>
                    {/* posturing stats bars mock */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-white/60">인체공학 점수</span>
                        <span className="font-bold text-[#CCFF00]">92% IDEAL</span>
                      </div>
                      <div className="w-full bg-[#1e1e1e] h-3.5 border-2 border-white overflow-hidden">
                        <div className="bg-[#CCFF00] h-full" style={{ width: '92%' }} />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="bg-black p-3 border-2 border-[#CCFF00] transform -rotate-2">
                      <span className="text-[9px] text-white/50 block uppercase font-mono">CHAIR HEIGHT</span>
                      <span className="text-sm font-black text-[#CCFF00] font-mono">45 cm</span>
                    </div>
                    <div className="bg-black p-3 border-2 border-white transform rotate-1">
                      <span className="text-[9px] text-white/50 block uppercase font-mono">DESK HEIGHT</span>
                      <span className="text-sm font-black text-white font-mono">71.5 cm</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Cloud Header Bar alternative - neon colored ticker banner */}
      <section className="bg-[#CCFF00] text-black py-4 select-none overflow-hidden font-mono border-y-4 border-black font-black tracking-widest">
        <div className="text-xs uppercase flex items-center justify-center gap-8 md:gap-16 flex-wrap font-bold">
          <span>// 1:1 CUSTOM ERGONOMICS</span>
          <span>// AUTHENTIC HP HARDWARE SYSTEM</span>
          <span>// SERVER-SIDE GEMINI INTEL</span>
          <span>// ZERO-OUTFIT POSTURE CODES</span>
        </div>
      </section>

      {/* Standard Core Calculator Screen Segment */}
      <main id="planner" className="flex-1 py-16 px-4 md:px-8 max-w-7xl mx-auto w-full transition-all duration-300">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-black text-[#CCFF00] font-mono tracking-[0.25em] uppercase block mb-3">
            [ INTELLIGENT INPUT SCHEMATIC ]
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white m-0 p-0" style={{ fontFamily: "'Arial Black', sans-serif" }}>
            WORKSPACE PLANNER
          </h2>
          <p className="text-xs md:text-sm uppercase tracking-wider font-semibold text-white/60 mt-3 font-mono">
            본인의 정확한 키와 평소 스타일, 신체 통증 고민을 채워주시면 에르고노믹스 연산 매크로가 맞춤 정합을 시행합니다.
          </p>
        </div>

        {/* Input Card Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Inputs Panel left Column 5-span with brutalist heavy frame */}
          <div className="lg:col-span-5 bg-[#0f0f0f] border-4 border-white p-6 md:p-8 transform rotate-1 shadow-[0_4px_25px_rgba(255,255,255,0.05)]">
            <h3 className="text-xs font-black text-[#CCFF00] uppercase tracking-widest font-mono mb-6 pb-3 border-b-2 border-[#CCFF00] flex items-center gap-2">
              <Sliders size={16} className="text-[#CCFF00]" />
              SPECIFICATION FORM_
            </h3>

            <div className="space-y-6">
              {/* Height Input Slider & Quick text box */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-black uppercase tracking-wider text-white/80">신장 (키)</label>
                  <span className="text-sm font-black text-[#CCFF00] font-mono bg-black px-2 py-1 border border-white">{height} cm</span>
                </div>
                <input 
                  type="range" 
                  min="140" 
                  max="210" 
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full h-2 bg-[#1e1e1e] border border-white/30 rounded-none appearance-none cursor-pointer accent-[#CCFF00] mb-1 focus:outline-none"
                />
                <div className="flex justify-between text-[10px] text-white/50 font-mono">
                  <span>140cm</span>
                  <span>175cm</span>
                  <span>210cm</span>
                </div>
              </div>

              {/* Work Type Selection Radio Columns */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-white/80 block mb-2">주요 업무 유형</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'developer', name: 'Software Dev', label: '💻 개발자' },
                    { key: 'designer', name: 'Visual Arts', label: '🎨 디자이너' },
                    { key: 'creator', name: 'Creator', label: '🎥 크리에이터' },
                    { key: 'general', name: 'General Office', label: '👔 일반 사무' }
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setWorkType(item.key as any)}
                      className={`text-xs font-black p-3 text-left border-2 transform transition-all ${
                        workType === item.key 
                          ? 'border-[#CCFF00] bg-[#CCFF00] text-black transform rotate-1 scale-[1.02]' 
                          : 'border-white/30 bg-black text-white hover:border-white'
                      }`}
                    >
                      <div className="font-bold tracking-tight">{item.label}</div>
                      <div className="text-[9px] font-mono uppercase mt-1 opacity-70">{item.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Desk Type selection switcher */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-white/80 block mb-2">사용 중인 책상 형태</label>
                <div className="flex gap-2">
                  {[
                    { key: 'fixed', label: '고정 가구형 (74cm)' },
                    { key: 'height_adjustable', label: '모션 데스크 (높낮이 가능)' }
                  ].map((desk) => (
                    <button
                      key={desk.key}
                      onClick={() => setDeskType(desk.key as any)}
                      className={`flex-1 text-xs font-black py-3 px-4 text-center border-2 transition-all ${
                        deskType === desk.key
                          ? 'bg-[#CCFF00] text-black border-[#CCFF00] transform -rotate-1'
                          : 'bg-black text-[#c2c2c2] border-white/30 hover:border-white'
                      }`}
                    >
                      {desk.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Desk Room Size Space */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-white/80 block mb-2">데스크 배치 공간 공간체적</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'compact', label: '컴팩트 원룸' },
                    { key: 'medium', label: '일반 방 크기' },
                    { key: 'executive', label: '독립형 고급 서재' }
                  ].map((size) => (
                    <button
                      key={size.key}
                      onClick={() => setSpaceSize(size.key as any)}
                      className={`text-[11px] font-black py-2.5 px-0.5 text-center border-2 transition-all ${
                        spaceSize === size.key
                          ? 'border-[#CCFF00] text-[#CCFF00] bg-[#CCFF00]/10 transform rotate-1'
                          : 'border-white/30 text-white hover:border-white bg-black'
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes / Special Pain conditions text area */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-white/80 block mb-2">
                  신체 증상 및 요구사항 (선택)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="예: 어깨 회외근 및 손목 부위 둔감, 듀얼 모니터 선호, 좁은 수용량 등 상세 피로 부위 기재 가능"
                  rows={3}
                  className="w-full text-xs p-3 bg-black border-2 border-white/40 text-white placeholder-white/30 focus:outline-none focus:border-[#CCFF00] focus:ring-0 resize-none font-mono"
                />
              </div>

              {/* Submit CTA */}
              <button
                onClick={calculateErgonomics}
                disabled={loading}
                className="w-full bg-[#CCFF00] text-black text-xs font-black uppercase tracking-widest py-4.5 border-2 border-black hover:bg-white hover:border-[#CCFF00] transition-all flex items-center justify-center gap-2 transform -rotate-1 active:scale-95 cursor-pointer shadow-[0_4px_15px_rgba(204,255,0,0.3)]"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    DESIGN ANALYZING...
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    에르고 노믹스 계산하기
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results dashboard right Column 7-span */}
          <div className="lg:col-span-7 space-y-6">
            <AnimatePresence mode="wait">
              {!hasSearched ? (
                // Welcome screen panel before calculation
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-[#0f0f0f] border-4 border-dashed border-white/20 p-8 text-center h-full flex flex-col justify-center items-center py-24 transform -rotate-1"
                >
                  <Activity size={48} className="text-[#CCFF00] mb-4 animate-pulse" />
                  <h3 className="text-lg font-black text-white mb-2 font-mono uppercase tracking-widest">
                    HP DESK REAL-TIME TELEMETRY //
                  </h3>
                  <p className="text-xs uppercase font-mono tracking-wider text-white/50 max-w-sm leading-relaxed mb-6">
                    왼쪽 설계지에 수치를 채운 뒤 하단의 계산 버튼을 클릭하십시오. AI 마이크로 컨트롤러가 실시간 인체 비율 맞춤형 Posture 지수를 생성합니다.
                  </p>
                  <div className="inline-flex gap-2 text-xs text-black font-black uppercase tracking-widest items-center bg-[#CCFF00] px-5 py-2.5 border-2 border-black">
                    <span>READY FOR ANALYSIS</span>
                  </div>
                </motion.div>
              ) : (
                // Output results screen
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Results Score Alert Banner - Brutalist Candidate design */}
                  <div className="bg-black border-4 border-[#CCFF00] p-6 relative shadow-[0_0_20px_rgba(204,255,0,0.1)]">
                    <div className="absolute -top-3.5 left-6 bg-[#CCFF00] text-black px-3 py-0.5 text-[10px] font-black uppercase tracking-widest border border-black">
                      ANALYZED TARGET MATRIX
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/10 pt-2">
                      <div>
                        <span className="text-[10px] font-black text-[#CCFF00] uppercase tracking-widest font-mono">
                          ERGO METRICS ANALYSIS SYSTEM
                        </span>
                        <h3 className="text-2xl font-black text-white tracking-tight uppercase mt-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                          데스크 세팅 척추 정합도
                        </h3>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right bg-[#0f0f0f] border-2 border-white p-3 transform -rotate-1">
                          <span className="text-3xl font-black text-[#CCFF00] font-mono leading-none block">
                            {result?.score}
                            <span className="text-sm font-bold text-white/40 inline-block ml-1">/100</span>
                          </span>
                          <span className="text-[9px] font-black tracking-widest text-[#white] uppercase">
                            {result && result.score > 85 ? '🥇 HIGH SCORE' : '⚠️ CORRECTION REQ.'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Specifications 4-Grid items */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 text-center">
                      <div className="p-3 bg-[#0f0f0f] border-2 border-white/20 transform rotate-1">
                        <span className="text-[9px] text-white/50 font-mono block uppercase">RECOMMENDED DESK</span>
                        <span className="text-base font-black text-[#CCFF00] font-mono mt-1 block">
                          {result?.ergonomics.deskHeight}cm
                        </span>
                      </div>
                      <div className="p-2 bg-[#0f0f0f] border-2 border-white/20 transform -rotate-1">
                        <span className="text-[9px] text-white/50 font-mono block uppercase">RECOMMENDED CHAIR</span>
                        <span className="text-base font-black text-[#CCFF00] font-mono mt-1 block">
                          {result?.ergonomics.chairHeight}cm
                        </span>
                      </div>
                      <div className="p-2 bg-[#0f0f0f] border-2 border-white/20 transform rotate-1">
                        <span className="text-[9px] text-white/50 font-mono block uppercase">MONITOR DISTANCE</span>
                        <span className="text-base font-black text-[#CCFF00] font-mono mt-1 block">
                          {result?.ergonomics.eyeDistance}
                        </span>
                      </div>
                      <div className="p-2 bg-[#0f0f0f] border-2 border-white/20 transform -rotate-1">
                        <span className="text-[9px] text-white/50 font-mono block uppercase">INTERVAL WORK TIMING</span>
                        <span className="text-base font-black text-white font-mono mt-1 block">
                          50m / 10m
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* SVG diagram panel */}
                  {result && (
                    <div className="transform rotate-1 border-4 border-white">
                      <DeskLayoutPreview ergonomics={result.ergonomics} height={height} />
                    </div>
                  )}

                  {/* AI Advisory Summary Consultation via Gemini */}
                  <div className="bg-[#0f0f0f] rounded-none p-6 md:p-8 border-4 border-[#CCFF00] relative">
                    <div className="absolute -top-3 left-6 bg-[#CCFF00] text-black px-4 py-0.5 text-[9px] font-black uppercase tracking-wider font-mono">
                      HP AI ERGO COGNITIVE REASONING_
                    </div>

                    <div className="flex items-center gap-2 mb-4 pt-2">
                      <Sparkles className="text-[#CCFF00]" size={18} />
                      <h4 className="text-xs font-black text-white uppercase tracking-widest font-mono">
                        HP AI CONSULTANT INSIGHT_
                      </h4>
                    </div>

                    <div className="text-white/90 space-y-1 font-sans">
                      {result && renderMarkdown(result.aiSummary)}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 4. Curated Hardware Products Section */}
        {hasSearched && result && (
          <motion.section 
            id="catalog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-24 pt-16 border-t-4 border-[#CCFF00]"
          >
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-black text-black bg-[#CCFF00] uppercase tracking-widest px-3 py-1.5 rounded-none font-mono inline-block mb-3">
                HP INVENT HARDWARE ALIGNMENT
              </span>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-3" style={{ fontFamily: "'Arial Black', sans-serif" }}>
                ERGO SOLUTIONS
              </h2>
              <p className="text-xs md:text-sm uppercase font-semibold text-white/60 tracking-wider font-mono">
                인체공학 설계와 뼈 마찰 피로 최소화를 전제해, 당신의 평소 작업 형상 연구와 방 체적 크기에 딱 맞게 큐레이팅된 HP 정품 솔루션입니다.
              </p>
            </div>

            <ProductCatalog products={result.recommendedProducts} />
          </motion.section>
        )}

        {/* Testimonials */}
        <section className="mt-28 pt-16 border-t border-white/20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-black text-[#CCFF00] font-mono tracking-[0.2em] uppercase block mb-2">
              [ REAL EXPERIENCE LOGS ]
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white" style={{ fontFamily: "'Arial Black', sans-serif" }}>
              USER FEEDBACK
            </h2>
            <p className="text-xs md:text-sm uppercase tracking-wider font-semibold text-white/60 mt-3 font-mono">
              HP 데스크 정밀 정렬을 적용하고 만성 근골격 스트레스 감소를 실제 경험한 전문 근로자들의 리포트입니다.
            </p>
          </div>

          <TestimonialSection />
        </section>

        {/* FAQ Area */}
        <section className="mt-28 pt-16 border-t border-white/20 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-black text-[#CCFF00] font-mono tracking-[0.2em] uppercase block mb-2">
              EXPERTS KNOWLEDGE CHANNELS
            </span>
            <h2 className="text-3xl font-black uppercase text-white tracking-widest font-mono">
              FAQ / GUIDELINES
            </h2>
          </div>

          <FaqSection />
        </section>
      </main>

      {/* 5. DARK NAV SLAB: Bold Brutalist prelude banner block */}
      <section className="bg-black text-white py-16 px-4 md:px-8 border-t-4 border-[#CCFF00] relative">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tight" style={{ fontFamily: "'Arial Black', sans-serif" }}>
              HOW CAN WE HELP?
            </h3>
            <p className="text-xs uppercase text-white/80 font-mono tracking-widest">
              HP 스마트 데스킹 서비스 설계는 원장 기기 분석을 보장합니다. 에어로다이나믹 진단툴을 통한 지원도 이용해 보세요.
            </p>
          </div>

          {/* Sub category tabs mimicking HP smart portal */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { id: 'Browse Topics', icon: <FileText size={14} />, label: '자료실 탐색' },
              { id: 'Live Chat', icon: <MessageSquare size={14} />, label: '에르고 라이브 챗터' },
              { id: 'Contact', icon: <PhoneCall size={14} />, label: 'HP 본사 직속 연락' },
              { id: 'Diagnose', icon: <Wrench size={14} />, label: '장치 포트 진단' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveHelpTab(tab.id);
                  if (tab.id === 'Live Chat') {
                    alert('실시간 인체공학 수석 카운슬러 매칭을 순서 대기합니다. 잠시 후 상담 챗창이 점유됩니다.');
                  } else if (tab.id === 'Diagnose') {
                    alert('HP Connected Diagnostics: 브라우저와 연동된 USB 지골 장치를 체크합니다. 연결이 비어있습니다.');
                  }
                }}
                className={`flex items-center gap-2 text-xs font-mono font-black uppercase tracking-widest px-6 py-3.5 border-2 transition-all ${
                  activeHelpTab === tab.id
                    ? 'bg-[#CCFF00] text-black border-black transform rotate-1'
                    : 'bg-[#121212] text-white border-white/20 hover:border-[#CCFF00]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 6. HP FOOTER STARK DARK */}
      <footer className="bg-[#0c0c0c] text-white py-16 px-4 md:px-8 border-t-2 border-white/10 select-none text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 border-b border-white/10 pb-12 mb-8">
          {/* Brand block */}
          <div className="col-span-2 space-y-4">
            <span className="text-3xl font-black font-mono tracking-tighter text-[#CCFF00]" style={{ fontFamily: "'Arial Black', sans-serif" }}>HP</span>
            <p className="text-xs uppercase text-white/60 max-w-xs leading-relaxed mt-2 font-mono font-medium">
              HP Deskfit은 스마트 테크놀로지와 리얼 오피스 퍼니처 에센스를 융합해 몸과 디지털 기기의 최상의 물리적 융합을 조각합니다.
            </p>
          </div>

          <div>
            <h5 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-4 font-mono select-none">SHOPPING</h5>
            <ul className="space-y-2 text-white/70 font-medium">
              <li><button className="hover:text-[#CCFF00] uppercase text-[10px]">HP Spectre Laptops</button></li>
              <li><button className="hover:text-[#CCFF00] uppercase text-[10px]">HP DreamColor Screens</button></li>
              <li><button className="hover:text-[#CCFF00] uppercase text-[10px] font-mono">LaserJet MFP Printers</button></li>
              <li><button className="hover:text-[#CCFF00] uppercase text-[10px]">Ergonomic Mouse Combos</button></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-4 font-mono select-none">SUPPORT</h5>
            <ul className="space-y-2 text-white/70 font-medium">
              <li><button className="hover:text-[#CCFF00] uppercase text-[10px]">드라이버 수동 다운로드</button></li>
              <li><button className="hover:text-[#CCFF00] uppercase text-[10px]">HP 에르고 워런티</button></li>
              <li><button className="hover:text-[#CCFF00] uppercase text-[10px]">고객 상담 예약 접수</button></li>
              <li><button className="hover:text-[#CCFF00] uppercase text-[10px]">카운슬 사후 관리 리포트</button></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-4 font-mono select-none">COMPANY</h5>
            <ul className="space-y-2 text-white/70 font-medium">
              <li><button className="hover:text-[#CCFF00] uppercase text-[10px]">HP 역사 및 철학</button></li>
              <li><button className="hover:text-[#CCFF00] uppercase text-[10px] font-mono">HP Tech Inventors</button></li>
              <li><button className="hover:text-[#CCFF00] uppercase text-[10px]">에스컬레이션 환경 안전과</button></li>
              <li><button className="hover:text-[#CCFF00] uppercase text-[10px] font-mono">Sustainability 2030</button></li>
            </ul>
          </div>
        </div>

        {/* Global legal disclaimer block in smaller graphite text */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-[#c2c2c2] gap-4">
          <div className="space-y-1 text-center md:text-left">
            <p className="font-mono text-[10px]">© {new Date().getFullYear()} HP Development Company, L.P. HP Deskfit AI 서비스.</p>
            <p className="text-[10px] text-white/40">
              본 사이트의 추천 조언은 일반적 인체 규격 가용 범위를 기반으로 산정되었으며, 임상 의학적 정밀 진단을 대용할 수 없습니다.
            </p>
          </div>
          <div className="flex gap-4 font-semibold text-[11px] font-mono select-none">
            <a href="#privacy" className="hover:text-[#CCFF00] uppercase">개인정보 처리방침</a>
            <span>//</span>
            <a href="#terms" className="hover:text-[#CCFF00] uppercase">이용 약관</a>
            <span>//</span>
            <a href="#rights" className="hover:text-[#CCFF00] uppercase">법적 고지</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
