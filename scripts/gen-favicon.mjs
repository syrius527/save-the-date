// 필기체 D·R 겹침 모노그램 파비콘 → src/app/icon.png(512), src/app/apple-icon.png(180)
// 스크립트 서체는 획이 글자 박스를 크게 벗어나므로:
// 큰 캔버스에 렌더 → trim으로 실제 잉크 영역만 크롭 → 정사각 캔버스 중앙에 합성
// 사용: node scripts/gen-favicon.mjs
import sharp from "sharp";

const SCRIPT_FONT = "'Snell Roundhand', 'Apple Chancery', cursive";
const BG = "#f7f3ec";

// 여유가 큰 캔버스(1600)에 겹친 모노그램만 그린다 — 위치는 trim이 보정
const glyphSvg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1600">
  <rect width="100%" height="100%" fill="${BG}"/>
  <text x="700" y="760" font-family="${SCRIPT_FONT}" font-size="450"
    fill="#5c6f5a" text-anchor="middle" dominant-baseline="middle">D</text>
  <text x="872" y="800" font-family="${SCRIPT_FONT}" font-size="450"
    fill="#3b3630" fill-opacity="0.92" text-anchor="middle" dominant-baseline="middle">R</text>
</svg>`);

async function makeIcon(canvasSize, glyphSize, outPath) {
  const glyph = await sharp(glyphSvg)
    .trim({ threshold: 10 })
    .resize(glyphSize, glyphSize, { fit: "inside" })
    .toBuffer();
  await sharp({
    create: {
      width: canvasSize,
      height: canvasSize,
      channels: 3,
      background: BG,
    },
  })
    .composite([{ input: glyph, gravity: "centre" }])
    .png()
    .toFile(outPath);
  console.log("generated", outPath, `(${canvasSize})`);
}

await makeIcon(512, 400, "src/app/icon.png");
await makeIcon(180, 132, "src/app/apple-icon.png");
