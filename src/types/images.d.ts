// 대문자 확장자 이미지 import 지원 (next/image-types는 소문자만 선언함)
declare module "*.JPG" {
  import type { StaticImageData } from "next/image";
  const content: StaticImageData;
  export default content;
}

declare module "*.JPEG" {
  import type { StaticImageData } from "next/image";
  const content: StaticImageData;
  export default content;
}

declare module "*.PNG" {
  import type { StaticImageData } from "next/image";
  const content: StaticImageData;
  export default content;
}
