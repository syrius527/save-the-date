// 실제 사진으로 교체 전까지 쓸 placeholder 이미지 생성기
// 사용: npm run placeholders  (sharp는 next의 optional dependency로 이미 설치됨)
import sharp from "sharp";
import { mkdir } from "fs/promises";
import path from "path";

const photoDir = "src/assets/photos";
await mkdir(photoDir, { recursive: true });
await mkdir("public", { recursive: true });

function svg(w, h, c1, c2, label, textColor = "rgba(60,54,48,.5)") {
  const fontSize = Math.round(Math.min(w, h) / 14);
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
  </linearGradient></defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <text x="50%" y="50%" font-family="AppleGothic, sans-serif" font-size="${fontSize}"
    fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${label}</text>
</svg>`,
  );
}

const photos = [
  ["couple.jpg", 1600, 2000, "#e8ded0", "#cfc4b2", "두 사람의 사진"],
  ["groom-child.jpg", 800, 800, "#dde4d8", "#c2cdbd", "신랑 어릴 적"],
  ["bride-child.jpg", 800, 800, "#e9dcd4", "#d4c0b4", "신부 어릴 적"],
  ["gallery-01.jpg", 1200, 1200, "#e6ddcf", "#cdc2ae", "사진 1"],
  ["gallery-02.jpg", 1200, 1200, "#dfe2d6", "#c3c9b6", "사진 2"],
  ["gallery-03.jpg", 1200, 1200, "#e8dcd2", "#d1bfb0", "사진 3"],
  ["gallery-04.jpg", 1200, 1200, "#e2dfd7", "#c8c4b8", "사진 4"],
  ["gallery-05.jpg", 1200, 1200, "#e9e2d1", "#d2c8ad", "사진 5"],
  ["gallery-06.jpg", 1200, 1200, "#dde0da", "#c0c6bd", "사진 6"],
  ["gallery-07.jpg", 1200, 1200, "#e7dad3", "#cfbcb2", "사진 7"],
  ["gallery-08.jpg", 1200, 1200, "#e4e0d2", "#cac5b1", "사진 8"],
  ["gallery-09.jpg", 1200, 1200, "#e1ddd8", "#c6c1ba", "사진 9"],
  ["cover-poster.jpg", 1080, 1920, "#2a2724", "#141210", ""],
];

for (const [name, w, h, c1, c2, label] of photos) {
  await sharp(svg(w, h, c1, c2, label))
    .jpeg({ quality: 85 })
    .toFile(path.join(photoDir, name));
  console.log("generated", name);
}

// 카카오/OG 공유 카드 (1200×630)
const og = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#f7f3ec"/><stop offset="1" stop-color="#e3dccf"/>
  </linearGradient></defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <text x="50%" y="42%" font-family="Georgia, serif" font-size="72" fill="#3b3630"
    text-anchor="middle">DONGJAE <tspan font-style="italic" font-size="52">and</tspan> RAEWON</text>
  <text x="50%" y="58%" font-family="AppleGothic, sans-serif" font-size="34" fill="#8a8177"
    text-anchor="middle">2026. 10. 24. SAT 6PM · 워커힐 호텔 워커홀</text>
</svg>`,
);
await sharp(og).jpeg({ quality: 88 }).toFile("public/og1.jpg");
console.log("generated public/og1.jpg");
