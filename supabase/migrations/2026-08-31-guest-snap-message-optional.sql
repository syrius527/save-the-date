-- 게스트 스냅 전환: 메시지를 선택 항목으로 (사진만 올리는 등록 허용)
-- Supabase 대시보드 > SQL Editor 에서 실행하세요.
alter table guestbook_entries
  drop constraint guestbook_entries_message_check;

alter table guestbook_entries
  add constraint guestbook_entries_message_check check (char_length(message) <= 500);
