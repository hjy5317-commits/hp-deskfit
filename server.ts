import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { WorkspaceRequest, WorkspaceResponse, HPProduct } from "./src/types.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    console.warn("GEMINI_API_KEY is not defined or is placeholder. AI text generation will fallback to rule-based system.");
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Fixed database of HP Products matching the Design Guidelines and target uses
const HP_PRODUCTS: HPProduct[] = [
  // Laptops
  {
    id: "hp-spectre-16",
    category: "laptop",
    name: "HP Spectre x360 Luxury 16\"",
    specs: ["Intel Core Ultra 7", "32GB RAM", "2TB SSD", "3K+ OLED Touchscreen", "지팅 에르고 레디 힌지"],
    price: 1899000,
    originalPrice: 2099000,
    discountRate: 10,
    tag: "PREMIUM"
  },
  {
    id: "hp-envy-16",
    category: "laptop",
    name: "HP Envy Creator Professional 16\"",
    specs: ["Intel Core i9", "32GB RAM", "1TB SSD", "RTX 4060 GPU", "100% DCI-P3 색재현율"],
    price: 1549000,
    originalPrice: 1749000,
    discountRate: 11,
    tag: "CREATOR"
  },
  {
    id: "hp-pavilion-14",
    category: "laptop",
    name: "HP Pavilion Plus Superlight 14\"",
    specs: ["Intel Core i5", "16GB RAM", "512GB SSD", "2.8K OLED 120Hz", "0.99kg 초경량"],
    price: 999000,
    originalPrice: 1199000,
    discountRate: 16,
    tag: "BEST VALUE"
  },
  {
    id: "hp-zbook-studio",
    category: "laptop",
    name: "HP ZBook Studio Workstation G10",
    specs: ["Intel Core i9 vPro", "64GB RAM", "2TB SSD", "RTX A3000", "ISV 엔지니어링 표준 인증"],
    price: 3499000,
    originalPrice: 3499000,
    tag: "ENTERPRISE"
  },

  // Monitors
  {
    id: "hp-series-7-31",
    category: "monitor",
    name: "HP Series 7 Pro 4K UHD 31.5\"",
    specs: ["4K IPS Black 패널", "USB-C 96W 충전 지원", "아이세이프 시력보호", "에르고노믹 상하좌우 스위블"],
    price: 749000,
    originalPrice: 799000,
    discountRate: 6,
    tag: "ERGO CHOICE"
  },
  {
    id: "hp-dreamcolor-27",
    category: "monitor",
    name: "HP DreamColor Professional Studio 27\"",
    specs: ["QHD", "스튜디오 하드웨어 캘리브레이션", "99% Adobe RGB", "후드 기본 제공"],
    price: 1150000,
    originalPrice: 1150000,
    tag: "CREATOR"
  },
  {
    id: "hp-series-5-27",
    category: "monitor",
    name: "HP Series 5 FHD Zero-Bezel 27\"",
    specs: ["FHD IPS", "100Hz 고주사율", "초슬림 메탈 미니멀 디자인", "틸트 조절 베이스"],
    price: 249000,
    originalPrice: 299000,
    discountRate: 16,
    tag: "BEST"
  },

  // Printers
  {
    id: "hp-smart-tank-7306",
    category: "printer",
    name: "HP Smart Tank M15w 초소형 레이저",
    specs: ["스마트폰 간편 프틴팅", "무한 잉크 대비 80% 토너 절약", "컴팩트한 공간 절약형 폼팩터"],
    price: 189000,
    originalPrice: 219000,
    discountRate: 13,
    tag: "COMPACT"
  },
  {
    id: "hp-officejet-9010",
    category: "printer",
    name: "HP OfficeJet Pro 9120e 고속 헤비듀티",
    specs: ["자동 양면 인쇄 & 스캔", "분당 22매 초고속 인쇄", "HP+ 스마트 커넥티비티 6개월 제공"],
    price: 329000,
    originalPrice: 359000,
    discountRate: 8,
    tag: "SMART BIZ"
  },

  // Accessories
  {
    id: "hp-975-keyboard",
    category: "accessory",
    name: "HP Dual Mode 975 무선 스마트 키보드",
    specs: ["백라이트 근접 센서", "최대 3개 기기 멀티 페어링", "저소음 기계식 펜타그래프 키감"],
    price: 129000,
    originalPrice: 149000,
    discountRate: 13,
    tag: "MUST HAVE"
  },
  {
    id: "hp-935-mouse",
    category: "accessory",
    name: "HP Creator 935 프리미엄 인체공학 마우스",
    specs: ["어깨 피로 감소 버티컬 그립", "커스텀 7버튼 매핑", "유리 표면 작동 트래킹 센서"],
    price: 99000,
    originalPrice: 119000,
    discountRate: 16,
    tag: "ERGO"
  }
];

// Helper to formulate ergonomic rules mathematically (rule-based recommendation)
function calculateErgonomics(height: number): {
  deskHeight: number;
  chairHeight: number;
  eyeDistance: string;
  elbowAngle: string;
  tips: string[];
} {
  // ISO/ANSI-BIFMA standard calculations
  // Desk seat height: ~26% of body height, Desk surface height: ~41% of body height (or seat plus ~27-30cm depending on arm rest)
  const chairHeight = Math.round(height * 0.26);
  const deskHeight = Math.round(height * 0.41);
  return {
    deskHeight,
    chairHeight,
    eyeDistance: "50 ~ 70 cm",
    elbowAngle: "90° ~ 100°",
    tips: [
      `책상 위 팔꿈치 각도가 ${90}° ~ 100°를 유지할 수 있도록 책상 높이를 ${deskHeight}cm 근처로 셋팅하십시오.`,
      `의자 높이는 무릎 뒤 오금이 바닥과 직각을 이루며 발바닥 전체가 닿는 ${chairHeight}cm 높이로 권장해 드립니다.`,
      `모니터 상단 1/3 지점이 눈높이와 수평을 이루어야 목뼈(경추) 전면 디스크 스트레스가 최소화됩니다.`,
      `장시간 정적인 자세를 지양하고 50분 근무 후 10분 스트레칭 또는 스탠딩 전환을 습관화하십시오.`
    ]
  };
}

// Curate 3 tailored HP products based on input profile
function curateProducts(workType: string, spaceSize: string): HPProduct[] {
  const selected: HPProduct[] = [];

  // 1. Laptop Selection
  if (workType === "developer" || workType === "creator") {
    const laptop = HP_PRODUCTS.find(p => p.id === "hp-spectre-16" || p.id === "hp-envy-16") || HP_PRODUCTS[0];
    selected.push(laptop);
  } else if (workType === "designer") {
    const laptop = HP_PRODUCTS.find(p => p.id === "hp-zbook-studio" || p.id === "hp-envy-16") || HP_PRODUCTS[0];
    selected.push(laptop);
  } else {
    const laptop = HP_PRODUCTS.find(p => p.id === "hp-pavilion-14") || HP_PRODUCTS[2];
    selected.push(laptop);
  }

  // 2. Monitor Selection
  if (workType === "designer" || workType === "creator") {
    const monitor = HP_PRODUCTS.find(p => p.id === "hp-dreamcolor-27") || HP_PRODUCTS[5];
    selected.push(monitor);
  } else if (workType === "developer") {
    const monitor = HP_PRODUCTS.find(p => p.id === "hp-series-7-31") || HP_PRODUCTS[4];
    selected.push(monitor);
  } else {
    const monitor = HP_PRODUCTS.find(p => p.id === "hp-series-5-27") || HP_PRODUCTS[6];
    selected.push(monitor);
  }

  // 3. Accessory Selection (or space-saving printer if space is compact)
  if (spaceSize === "compact") {
    const printer = HP_PRODUCTS.find(p => p.id === "hp-smart-tank-7306") || HP_PRODUCTS[7];
    selected.push(printer);
  } else {
    const mouse = HP_PRODUCTS.find(p => p.id === "hp-935-mouse") || HP_PRODUCTS[10];
    selected.push(mouse);
  }

  return selected;
}

// Core API: Ergonomics & Workspace Customization
app.post("/api/workspace/optimize", async (req, res) => {
  const { height, workType, deskType, spaceSize, notes } = req.body as WorkspaceRequest;

  if (!height || typeof height !== "number") {
    return res.status(400).json({ error: "올바른 신장(키) 수値を 입력해주세요." });
  }

  // Set default score based on setup logic (e.g., height adjustable desks score higher, notes/specific setup preferences added)
  let score = 78;
  if (deskType === "height_adjustable") score += 12; // Ergonomic score bonus for sit-stand desks
  if (spaceSize === "executive") score += 5;
  if (spaceSize === "compact") score -= 3;
  if (notes && notes.length > 10) score += 5;
  score = Math.min(Math.max(score, 50), 100);

  const ergonomics = calculateErgonomics(height);
  const recommendedProducts = curateProducts(workType, spaceSize);

  // Gemini logic
  const client = getGeminiClient();
  let aiSummary = "";

  if (client) {
    try {
      const workTypeKo = {
        developer: "소프트웨어 개발 / 코딩",
        designer: "그래픽 디자인 및 시각 예술",
        creator: "동영상 편집 및 콘텐츠 크리에이티브",
        general: "문서 및 일반 경영 사무"
      }[workType] || "전문 사무 업무";

      const deskTypeKo = deskType === "height_adjustable" ? "모션/스탠딩 데스크" : "고정형 일반 데스크";
      const spaceSizeKo = {
        compact: "좁은 원룸 및 스마트 소형 공간",
        medium: "표준 침실 혹은 작은 전용 홈오피스",
        executive: "넓고 고급스러운 마스터 서재실"
      }[spaceSize] || "표준 홈오피스";

      const prompt = `
        사용자 정보:
        - 신장(키): ${height}cm
        - 주요 업무 분야: ${workTypeKo}
        - 보유 중인 책상 타입: ${deskTypeKo}
        - 데스크 작업 공간 크기: ${spaceSizeKo}
        - 기타 요구사항 및 신체 증상: ${notes || "없음"}

        위 신체 규격과 환경에 딱 맞춘 인체공학적 조언을 3~4개의 간결한 단락으로 마크다운 스타일(Markdown)로 한글로 정중하게 작성해주세요.
        글씨 디자인 가이드:
        - HP 프리미엄 워크스페이스 컨설턴트처럼 전문적이고 품격있게 답하세요.
        - 사용자의 키 ${height}cm에 맞는 정확한 책상 높이(${ergonomics.deskHeight}cm)와 의자 높이(${ergonomics.chairHeight}cm)를 다시 한 번 친절하게 언급하며 그 이유를 인체공학적(팔꿈치 각도, 오금 정렬 등)으로 해설해주십시오.
        - 추천받은 장비(${recommendedProducts.map(p => p.name).join(", ")})가 어떻게 이 작업 환경을 극적으로 보완하여 거북목 예방과 어깨 결림 예방에 도움을 주는지 연계해서 설명해주세요.
        - 글자는 깔끔하고 가독성 좋은 리스트와 소제목 위주로 정리해주세요.
      `;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "당신은 HP의 전속 인체공학적 스마트 워크스페이스 공간 수석 컨설턴트입니다. 오직 한글로 품격 있고 세련되게 답변해주세요."
        }
      });

      aiSummary = response.text || "";
    } catch (error) {
      console.error("Gemini API error, falling back to local generator:", error);
    }
  }

  // Local fallback if Gemini is missing or failed
  if (!aiSummary) {
    const workTypeKo = {
      developer: "개발자",
      designer: "디자이너",
      creator: "크리에이터",
      general: "사무직"
    }[workType];

    aiSummary = `
### 🖥️ **${height}cm ${workTypeKo} 맞춤형 인체공학 최적화 플랜**

귀하의 소중한 신체 정보(${height}cm)와 업무 성향을 정밀 융합 분석한 결과, 최종 공간 지골 지수는 **${score}점**으로 셋업 교정이 적극 요구됩니다.

#### **1. 맞춤형 신체 규격 최적화 수치**
*   **권장 책상 상판 최종 높이:** **${ergonomics.deskHeight}cm**
    *   상체를 바르게 세우고 양팔을 늘어뜨렸을 때 팔꿈치가 정확히 복사뼈 정렬과 함께 직각(90~100도)이 형성되는 이상적 수치입니다. 일반 고정형 책상(74cm 상당)은 귀하에게 오랜 시간 수축 피로를 유발하였을 것입니다.
*   **권장 의자 시트 고도 조절:** **${ergonomics.chairHeight}cm**
    *   오금이 압박되지 않고 뒤꿈치가 완벽 밀착되어 요추 전만이 기립 유지되는 최적의 무게 중심 높이입니다.

#### **2. 추천 HP 하드웨어 하이라이트 분석**
*   **완벽한 시야각 확보:** 추천드린 최고 성능 모니터의 조절 스탠드 기능은 눈높이에 정확히 들어맞도록 가이드됩니다. 장시간 거북목(C자 디스크 변형) 피로를 완벽하게 사전에 케어합니다.
*   **HP 스마트 에코 입력 디바이스:** 손목 터널 증후군 및 회외근의 회전을 최소화하는 인체공학 무선 디바이스 구성은 어깨 회전근의 누적 전단력을 감소시킵니다.

*※ 팁: 50분 집중 터울 뒤 반드시 10분간의 짧은 스탠딩 혹은 공중 이완 요가를 권해 드립니다. HP Deskfit이 당신의 스마트하고 지속 가능한 생산성을 전방위 지원합니다!*
    `;
  }

  const responseJson: WorkspaceResponse = {
    score,
    ergonomics,
    recommendedProducts,
    aiSummary
  };

  res.json(responseJson);
});

// Provide full HP Products list if needed for shop catalog browsing
app.get("/api/products", (req, res) => {
  res.json(HP_PRODUCTS);
});

// Setup Vite Dev Server / Static deployment fallback
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`HP Deskfit full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
