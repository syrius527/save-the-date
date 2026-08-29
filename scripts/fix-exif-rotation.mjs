// EXIF 회전 사진 일괄 정리 (무손실)
// - jpegtran이 JPEG 블록을 재배열하는 방식이라 재인코딩/화질 손실이 없다
// - 회전을 픽셀에 굽고 EXIF는 제거 → next/image 메타데이터와 실제 표시 방향이 일치하게 됨
// 사용: node scripts/fix-exif-rotation.mjs [대상 디렉토리=src/assets/photos]
import fs from "fs";
import os from "os";
import path from "path";
import { execFileSync } from "child_process";
import sharp from "sharp";
// jpegtran-bin v7은 ESM — default export가 바이너리 경로 문자열
import jpegtran from "jpegtran-bin";

const ROOT = process.argv[2] ?? "src/assets/photos";
const ROT_BY_ORIENTATION = { 3: "180", 6: "90", 8: "270" };

const backupDir = path.join(os.tmpdir(), "wedding-exif-backup");
fs.mkdirSync(backupDir, { recursive: true });

function* walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (/\.jpe?g$/i.test(e.name)) yield p;
  }
}

let fixed = 0;
let skipped = 0;
for (const file of walk(ROOT)) {
  const meta = await sharp(file).metadata();
  const o = meta.orientation ?? 1;
  if (o === 1) continue;
  const rot = ROT_BY_ORIENTATION[o];
  if (!rot) {
    console.warn(`⚠️  ${file}: orientation ${o}(미러형)은 수동 처리 필요 — 건너뜀`);
    skipped++;
    continue;
  }
  fs.copyFileSync(file, path.join(backupDir, path.basename(file)));
  const tmp = file + ".rot.tmp";
  try {
    execFileSync(jpegtran, ["-rot", rot, "-copy", "none", "-perfect", "-outfile", tmp, file]);
  } catch {
    // MCU(16px) 배수가 아니면 -perfect 실패 → 가장자리 부분 블록만 정리하는 -trim으로 재시도
    execFileSync(jpegtran, ["-rot", rot, "-copy", "none", "-trim", "-outfile", tmp, file]);
    console.warn(`   (${path.basename(file)}: 가장자리 부분 블록 트림됨)`);
  }
  fs.renameSync(tmp, file);
  console.log(`✓ ${file}: orientation ${o} → 픽셀 ${rot}° 회전 완료`);
  fixed++;
}
console.log(`\n완료: ${fixed}장 회전, ${skipped}장 건너뜀 (백업: ${backupDir})`);
