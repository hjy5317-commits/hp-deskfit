import React from 'react';
import { Quote, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatarText: string;
  quote: string;
  rating: number;
}

const TESTIMONIALS_DATA: Testimonial[] = [
  {
    name: "김민재",
    role: "수석 풀스택 개발자",
    company: "DevSync 코퍼레이션",
    avatarText: "MJ",
    quote: "HP Deskfit 콘셉트를 따라 책상 높이를 일반 74cm에서 추천 사양인 70cm로 수정한 이후로, 만성적이던 왼쪽 어깨 결림이 단 1주일 만에 드라마틱하게 개선되었습니다. 제 신체 비율에 맞추어 연계 설계된 HP Spectre x360 모니터 피팅 솔루션은 제 코딩 인생을 바꿔놨습니다.",
    rating: 5
  },
  {
    name: "Sarah Oh",
    role: "브랜드 수석 아티스트",
    company: "Studio Bloom Co.",
    avatarText: "SO",
    quote: "제 하루는 10시간 이상 책상 앞에서 그림을 그리고 색을 맞추는 일로 가득합니다. HP Deskfit이 제 키에 따라 기획한 DreamColor 모니터 스탠딩 각 조절 조언이 없었다면 매일 정형외과 물리치료에 수백을 쏟았을 것입니다. 디자인 또한 퓨어화이트 인테리어와 완벽 매칭되네요.",
    rating: 5
  },
  {
    name: "박동윤",
    role: "시니어 하재 재택근무 컨설턴트",
    company: "Global Remote Link",
    avatarText: "DY",
    quote: "사내 임직원들을 대상으로 스마트 오피스 환경 최적화 사업을 전파하고 있는데, 본 툴을 통해 직원 개개인의 맞춤 장비 세밀 세트와 규격을 AI가 산출해줘 업무 성과가 극적으로 개선됐습니다. HP의 완벽한 하드웨어 설계력이 빛을 발하는 에코 프레임워크입니다.",
    rating: 5
  }
];

export default function TestimonialSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {TESTIMONIALS_DATA.map((t, idx) => {
        const isRotLeft = idx % 2 === 0;
        return (
          <motion.div
            key={idx}
            whileHover={{ y: -6, scale: 1.01 }}
            className={`bg-[#0f0f0f] border-4 border-white p-6 rounded-none flex flex-col justify-between shadow-[4px_4px_0px_#ffffff] hover:shadow-[4px_4px_0px_#CCFF00] hover:border-[#CCFF00] transition-all ${
              isRotLeft ? 'transform -rotate-1' : 'transform rotate-1'
            }`}
          >
            <div>
              {/* Stars in Neon Yellow-Green */}
              <div className="flex gap-1 text-[#CCFF00] mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" className="stroke-0" />
                ))}
              </div>

              {/* Quote Icon */}
              <Quote className="text-[#CCFF00]/15 mb-3" size={32} />

              <p className="text-xs md:text-sm text-white/90 leading-relaxed mb-6 font-medium font-sans">
                "{t.quote}"
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              {/* stark squared avatar */}
              <div className="w-10 h-10 rounded-none bg-[#CCFF00] text-black flex items-center justify-center font-black font-mono text-sm border border-black">
                {t.avatarText}
              </div>
              <div>
                <h5 className="text-xs font-black text-white font-mono uppercase">{t.name}</h5>
                <p className="text-[10px] text-white/50 font-mono leading-none mt-1 uppercase">
                  {t.role} // {t.company}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
