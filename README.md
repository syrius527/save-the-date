# 동재 ♥ 래원 모바일 청첩장

Claude Design 프로토타입(`Wedding Invitation.dc.html`)을 기반으로 한 실서비스 청첩장.
Next.js 15 + Vercel / Supabase(방명록·RSVP) / Cloudflare R2(사진 원본, **무압축**).

## 구조 요약

- 10개 풀스크린 스냅 섹션: Cover 영상 → 초대 → 소개 → 일시(달력·카운트다운) → 갤러리 → 오시는 길 → 계좌 → 방명록 → RSVP → 공유
- **방명록 사진**: 장수 무제한, 브라우저 → R2 직접 presigned PUT(동시 3개·진행률·재시도). 원본 바이트 그대로 저장, 목록 썸네일만 next/image가 리사이즈(Vercel CDN 캐시), 라이트박스에서 원본 열람
- **손님 구분**: `/?to=family` = 친인척(인사말·전세버스 안내), 그 외 = 지인. RSVP에 어느 링크로 왔는지 기록됨. 문구는 `src/lib/variant.ts`에서 수정
- **관리자**: `/admin` (ADMIN_SECRET 로그인) — RSVP 집계, 방명록 글·사진 삭제
- **cron**: 매일 1회 중단된 업로드의 고아 객체 정리 + Supabase 무료 티어 절전 방지

## 로컬 실행

```bash
npm install
cp .env.example .env.local   # 아래 셋업 후 값 채우기
npm run dev
```

환경변수 없이도 페이지는 뜨고, 방명록/RSVP만 "준비되지 않았어요"로 비활성화됩니다.

## 1. Supabase 셋업

1. https://supabase.com 에서 프로젝트 생성
2. SQL Editor에서 `supabase/schema.sql` 전체 실행
3. Settings > API에서 `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`(service_role) 복사
   - anon key는 사용하지 않습니다 (전 테이블 RLS deny-all, 서버 경유만 허용)

## 2. Cloudflare R2 셋업

1. Cloudflare 대시보드 > R2 > 버킷 생성 (예: `wedding-guestbook`)
2. 버킷 Settings > **Public access > r2.dev subdomain 활성화** → 표시된 `pub-xxxx.r2.dev`를 `NEXT_PUBLIC_MEDIA_HOST`에 (https:// 제외)
3. R2 > API 토큰 관리 > **S3 호환 토큰** 생성(Object Read & Write, 해당 버킷 한정) → `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, 계정 ID → `R2_ACCOUNT_ID`
4. 버킷 Settings > CORS policy에 추가:

```json
[
  {
    "AllowedOrigins": ["http://localhost:3000", "https://<프로젝트명>.vercel.app"],
    "AllowedMethods": ["PUT"],
    "AllowedHeaders": ["content-type"],
    "MaxAgeSeconds": 3600
  }
]
```

> 참고: r2.dev 도메인은 Cloudflare가 "개발용"으로 안내하며 순간 트래픽 제한이 있습니다.
> 이 프로젝트는 영상은 Vercel에서, 썸네일은 Vercel 이미지 CDN 캐시로 서빙해 r2.dev 부하를
> 최소화하도록 설계되어 있어 350명 규모에서는 충분합니다. 추후 커스텀 도메인을 사면
> `media.도메인`을 버킷에 연결하고 `NEXT_PUBLIC_MEDIA_HOST`만 바꾸면 됩니다.

## 3. Kakao 공유 셋업

1. https://developers.kakao.com > 애플리케이션 추가
2. 앱 설정 > 플랫폼 > **Web 플랫폼 등록**: `http://localhost:3000`, `https://<프로젝트명>.vercel.app` (미등록 도메인에서는 공유가 조용히 실패합니다)
3. JavaScript 키 → `NEXT_PUBLIC_KAKAO_JS_KEY`

## 4. Vercel 배포

1. GitHub 리포에 push 후 Vercel에서 Import (프로젝트명이 곧 URL — 예: `dongjae-raewon`)
2. 환경변수 전부 등록 (`.env.example` 참고). `CRON_SECRET`을 등록하면 Vercel이 cron 요청에 자동으로 `Authorization: Bearer`를 붙입니다
3. `NEXT_PUBLIC_SITE_URL`을 실제 배포 URL로 설정 (OG/카카오 카드의 절대 URL에 사용)
4. 배포 후 R2 CORS와 Kakao 플랫폼 도메인에 실제 URL이 들어있는지 재확인

## 5. 실제 자산으로 교체

| 자산 | 위치 | 비고 |
|---|---|---|
| 커버 릴스 영상 | `public/cover/reel.mp4` 추가 | H.264+AAC mp4 권장. `src/lib/constants.ts`의 `COVER_VIDEO_SRC`를 `"/cover/reel.mp4"`로 변경 |
| 커플/어린시절 사진 | `src/assets/photos/*.jpg` 같은 파일명으로 교체 | 빌드 시 자동으로 AVIF/WebP·blur 처리 |
| 갤러리 사진 | `src/assets/photos/gallery/01~12/` 폴더에 자유롭게 추가 후 `npm run gallery` | 폴더 = 카테고리(12개). 기본 링크는 각 폴더의 첫 파일(이름 정렬순)을 고정 표시, `?g=random` 링크는 요청마다 카테고리별 1장 랜덤. 스크립트가 EXIF 회전 사진도 경고해줌 |
| OG 공유 이미지 | `public/og.jpg` (1200×630) | 카카오 카드에 노출 |
| 계좌번호·혼주 성함 | `src/lib/constants.ts` | |
| 지인/친인척 인사말·교통 문구 | `src/lib/variant.ts` | |
| 예식 정보(날짜·장소·지도 링크) | `src/lib/constants.ts` | |

placeholder 재생성: `npm run placeholders`

## 6. 관리자

- `ADMIN_SECRET` 생성: `openssl rand -hex 24`
- `https://.../admin` 접속 → 비밀키 입력 (30일 쿠키 유지)

## 배포 전 점검 체크리스트

- [ ] `/?to=family` vs 기본: 인사말·교통 안내 다르게 나오는지, 관리자에서 RSVP "링크" 열 기록 확인
- [ ] 실제 폰 사진(3~8MB) 여러 장 방명록 등록: 진행률·재시도, R2 객체 크기가 원본과 동일한지(무압축)
- [ ] iPhone 실기기: 스냅 스크롤, 사운드 토글, 키보드 올라올 때 스냅 동작
- [ ] 카카오톡: 링크 붙여넣기 OG 카드 / SDK 공유 / 인앱 브라우저에서 계좌 복사
- [ ] `/admin` 미인증 리다이렉트, 방명록 삭제 시 R2 객체도 삭제되는지 (R2 대시보드 확인)
- [ ] Vercel cron 로그에서 `/api/cron/cleanup` 200 확인 (Supabase 절전 방지 겸용)
