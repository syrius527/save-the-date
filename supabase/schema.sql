-- 모바일 청첩장 DB 스키마
-- Supabase 대시보드 > SQL Editor 에서 실행하세요.

create table if not exists guestbook_entries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 20),
  -- 게스트 스냅: 사진이 메인이라 메시지는 비워둘 수 있음
  message text not null default '' check (char_length(message) <= 500),
  ip_hash text,
  created_at timestamptz not null default now()
);
create index if not exists guestbook_created_idx on guestbook_entries (created_at desc);

create table if not exists guestbook_photos (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references guestbook_entries(id) on delete cascade,
  object_key text not null unique,
  content_type text not null,
  size_bytes bigint not null,
  width int,
  height int,
  sort_order int not null default 0
);
create index if not exists guestbook_photos_entry_idx on guestbook_photos (entry_id);

create table if not exists rsvps (
  id uuid primary key default gen_random_uuid(),
  side text not null check (side in ('groom', 'bride')),
  attending boolean not null,
  name text not null check (char_length(name) between 1 and 20),
  relation text,
  headcount int not null check (headcount between 1 and 10),
  variant text not null default 'friend',
  ip_hash text,
  created_at timestamptz not null default now()
);

-- presigned 업로드 고아 객체 추적 (24h 지나도 클레임 안 되면 cron이 R2에서 삭제)
create table if not exists upload_tickets (
  object_key text primary key,
  content_type text not null,
  declared_size bigint not null,
  claimed boolean not null default false,
  ip_hash text,
  created_at timestamptz not null default now()
);
create index if not exists upload_tickets_unclaimed_idx on upload_tickets (created_at) where not claimed;

-- RLS: 전 테이블 deny-all. anon key는 배포되지 않으며,
-- 모든 접근은 Next.js 서버(service role)를 통해서만 이루어진다.
alter table guestbook_entries enable row level security;
alter table guestbook_photos enable row level security;
alter table rsvps enable row level security;
alter table upload_tickets enable row level security;
