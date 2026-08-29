// 서버/클라이언트 공용 DTO (server-only 모듈에서 분리)
export interface GuestbookPhotoDTO {
  key: string;
  url: string;
  width: number | null;
  height: number | null;
}

export interface GuestbookEntryDTO {
  id: string;
  name: string;
  message: string;
  createdAt: string;
  photos: GuestbookPhotoDTO[];
}

export interface GuestbookPage {
  entries: GuestbookEntryDTO[];
  nextCursor: string | null;
}
