/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    Kakao?: any;
  }
}

const SDK_URL = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js";

let loading: Promise<void> | null = null;

export function kakaoConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
}

function loadSdk(): Promise<void> {
  if (window.Kakao) return Promise.resolve();
  if (!loading) {
    loading = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = SDK_URL;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => {
        loading = null;
        reject(new Error("Kakao SDK 로드 실패"));
      };
      document.head.appendChild(s);
    });
  }
  return loading;
}

export async function shareKakao(opts: {
  url: string;
  title: string;
  description: string;
  imageUrl: string;
}): Promise<void> {
  if (!kakaoConfigured()) {
    throw new Error("NEXT_PUBLIC_KAKAO_JS_KEY가 설정되지 않았습니다");
  }
  await loadSdk();
  const Kakao = window.Kakao;
  if (!Kakao.isInitialized()) {
    Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
  }
  Kakao.Share.sendDefault({
    objectType: "feed",
    content: {
      title: opts.title,
      description: opts.description,
      imageUrl: opts.imageUrl,
      link: { mobileWebUrl: opts.url, webUrl: opts.url },
    },
    buttons: [
      {
        title: "청첩장 보기",
        link: { mobileWebUrl: opts.url, webUrl: opts.url },
      },
    ],
  });
}
