import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    question: "나의 키에 꼭 맞는 정확한 책상 높이는 왜 중요한가요?",
    answer: "일반적으로 시중에 판매되는 일체형 사무책상은 일관되게 72~74cm 수준으로 고정 설계되어 개발되었습니다. 하지만 이는 키 180cm 이상의 서구 성인 규격에 가장 가까워, 한국 평균 체격을 지닌 분들이 기기를 쓰실 시 어깨가 과도하게 승모근과 수축 압박을 형성하는 스트레스 요인이 됩니다. 신체 비율에 부합하는 낮은 높낮이 설정이 경쇄골 안정과 터널 손목 각을 지켜줍니다."
  },
  {
    question: "모니터 시선 조절은 어떻게 해야 목 피로를 경감할 수 있을까요?",
    answer: "시선 가선은 모니터 제일 상단 테두리 1/3 상과 직선을 이루어야 합니다. 모니터 시선각이 이 기준보다 낮을 시 경추 극돌기가 미세하게 앞으로 인출되며 소위 말하는 거북목 증상을 유발합니다. HP Pro 시리즈 모니터의 조절 스탠드가 제공하는 피벗 및 틸팅 기능은 고유 시각을 정밀 보정하여 전신 피로를 경감합니다."
  },
  {
    question: "서서 일하는 높이(모션 스탠딩 사양)의 기준 가이드라인은 무엇인가요?",
    answer: "척추 주위 기립근 수축을 덜기 위해 서계실 때 팔꿈치 각도가 마찬가지로 'L자(90도~100도)'를 자연스럽게 굽히지 않고 유지할 수 있는 지상 높이가 귀하의 스탠딩 수치입니다. 서서 일할 때는 체중이 과도하게 골반และ 무릎 뒤 측부 인대에 가중되므로 최대 연속 20분을 넘기지 않는 순환 인터벌을 추천합니다."
  },
  {
    question: "스마트 홈오피스의 인체공학적 조명 및 조도 설계법은요?",
    answer: "모니터 패널에 발생하는 반사 휘도 광을 제거하기 위해 직사광선이 모니터 시야와 뒷면에 반사되지 않게 간접 조명을 배치하는 것이 이상적입니다. 모니터 하단의 간접 조도 혹은 빛 스크린 가드를 장착하면 망막 긴장을 현격하게 완화해줍니다."
  }
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {FAQ_DATA.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className="bg-[#0f0f0f] rounded-none border-2 border-white/60 overflow-hidden transition-all duration-200 hover:border-[#CCFF00]"
          >
            <button
              onClick={() => toggleAccordion(idx)}
              className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-black uppercase text-white hover:bg-[#CCFF00] hover:text-black transition-all font-mono"
            >
              <div className="flex items-center gap-3">
                <HelpCircle size={18} className="text-[#CCFF00] shrink-0" />
                <span className="text-xs md:text-sm tracking-wider">{item.question}</span>
              </div>
              <div className="shrink-0">
                {isOpen ? <ChevronUp size={16} className="text-current" /> : <ChevronDown size={16} className="text-current" />}
              </div>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 text-xs md:text-sm text-white/80 leading-relaxed border-t border-white/20 pt-4 bg-black font-sans">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
