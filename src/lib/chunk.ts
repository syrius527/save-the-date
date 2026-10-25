// 긴 키 목록을 나눠 처리 — PostgREST `.in()`은 URL 쿼리스트링으로 가서 수백 개면 URL 길이 한도를 넘는다
export function chunk<T>(items: readonly T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}
