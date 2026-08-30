export type Variant = "family" | "friend";

// 'family' 정확 일치만 친인척, 오타·미지정은 조용히 지인 기본값
export function resolveVariant(to: string | undefined): Variant {
  return to === "family" ? "family" : "friend";
}

export interface TransportRow {
  label: string;
  body: string;
}

export interface VariantConfig {
  greetingTitle: string;
  greetingBody: string[];
  transport: {
    car: TransportRow[];
    transit: TransportRow[];
  };
}

const CAR_ROWS: TransportRow[] = [
  {
    label: "내비",
    body: "'워커힐 호텔' 또는 '서울 광진구 워커힐로 177' 검색",
  },
  {
    label: "주차",
    body: "호텔 주차장 이용 가능 (하객 무료 · 안내데스크 등록)",
  },
];

const SHUTTLE_ROW: TransportRow = {
  label: "셔틀",
  body: "광나루역 · 강변역에서 워커힐 셔틀버스 수시 운행",
};

// TODO: 실제 문구로 교체 (지인/친인척별 인사말·전세버스 안내)
export const VARIANTS: Record<Variant, VariantConfig> = {
  friend: {
    greetingTitle: "소중한 분들을 초대합니다",
    greetingBody: [
      "서로가 마주 보며 다져온 사랑을",
      "이제 함께 한 곳을 바라보며",
      "걸어갈 수 있는 큰 사랑으로 키우려 합니다.",
      "저희 두 사람의 새로운 시작을",
      "따뜻한 마음으로 축복해 주시면",
      "감사하겠습니다.",
    ],
    transport: {
      car: CAR_ROWS,
      transit: [
        {
          label: "지하철",
          body: "5호선 광나루역 2번 출구 → 호텔 셔틀버스 이용",
        },
        SHUTTLE_ROW,
      ],
    },
  },
  family: {
    greetingTitle: "저희 두 사람, 부부가 됩니다",
    greetingBody: [
      "귀한 걸음 하시어",
      "저희 두 사람의 첫 시작을",
      "가까이에서 지켜봐 주시고",
      "축복해 주시면 더없는 기쁨으로",
      "간직하겠습니다.",
    ],
    transport: {
      car: CAR_ROWS,
      transit: [
        {
          label: "전세버스",
          body: "가족분들을 위한 전세버스가 준비됩니다 (출발 장소·시간 추후 안내)",
        },
        SHUTTLE_ROW,
      ],
    },
  },
};
