-- ============================================================================
-- Sportika — public-site expansion
-- Adds the four directories the platform needs (clubs, venues, rankings,
-- organizer early access) and widens the two inbound forms so a real player
-- application and a real tournament request fit in one row each.
-- Additive-only and safe to re-run.
-- ============================================================================

-- ------------------------------------------------------------------- clubs --
create table if not exists public.clubs (
  slug        text primary key,
  type        text not null default 'club' check (type in ('club','academy')),
  name        text not null,
  sports      jsonb not null default '[]'::jsonb,
  area        text not null default '',
  city        text not null default '',
  description text not null default '',
  verified    boolean not null default false,
  featured    boolean not null default false,
  founded     integer,
  players     integer,
  training    text,
  coaches     jsonb not null default '[]'::jsonb,
  highlights  text,
  image       text,
  created_at  timestamptz not null default now()
);
create index if not exists clubs_city_idx  on public.clubs (city);
create index if not exists clubs_type_idx  on public.clubs (type);

-- ------------------------------------------------------------------ venues --
create table if not exists public.venues (
  slug        text primary key,
  type        text not null default 'court' check (type in ('court','ground','indoor')),
  name        text not null,
  sports      jsonb not null default '[]'::jsonb,
  area        text not null default '',
  city        text not null default '',
  description text not null default '',
  verified    boolean not null default false,
  featured    boolean not null default false,
  courts      integer,
  price       text,
  hours       text,
  amenities   text,
  image       text,
  created_at  timestamptz not null default now()
);
create index if not exists venues_city_idx on public.venues (city);
create index if not exists venues_type_idx on public.venues (type);

-- ---------------------------------------------------------------- rankings --
-- Denormalised result of the scoring engine; one row per player/sport/city.
create table if not exists public.rankings (
  id         uuid primary key default gen_random_uuid(),
  sport      text not null,
  city       text not null,
  rank       integer not null,
  name       text not null,
  club       text,
  matches    integer not null default 0,
  points     integer not null default 0,
  delta      integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (sport, city, name)
);
create index if not exists rankings_list_idx on public.rankings (sport, city, rank);

-- ---------------------------------------------------- organizer early access --
create table if not exists public.early_access (
  id           uuid primary key default gen_random_uuid(),
  whatsapp     text not null,
  sport        text,
  source       text not null default 'organize',
  created_at   timestamptz not null default now()
);

-- ------------------------------------------- join_requests: full application --
-- The prototype collects an application a verifier can actually act on, plus
-- private fields (CNIC/B-Form, DOB, guardian contact) that never reach a public
-- profile. Sport-specific answers vary per game, so they go in one jsonb blob.
alter table public.join_requests
  add column if not exists cnic          text,
  add column if not exists dob           date,
  add column if not exists height_cm     numeric,
  add column if not exists weight_kg     numeric,
  add column if not exists area          text,
  add column if not exists address       text,
  add column if not exists level         text,
  add column if not exists institution   text,
  add column if not exists club_team     text,
  add column if not exists guardian_name text,
  add column if not exists guardian_phone text,
  add column if not exists links         text,
  add column if not exists consent       boolean not null default false,
  add column if not exists sport_fields  jsonb not null default '{}'::jsonb;

-- ------------------------------------- tournament_requests: full submission --
alter table public.tournament_requests
  add column if not exists org_type      text,
  add column if not exists contact_person text,
  add column if not exists website       text,
  add column if not exists social        text,
  add column if not exists organizer_cnic text,
  add column if not exists format        text,
  add column if not exists venue         text,
  add column if not exists start_date    date,
  add column if not exists end_date      date,
  add column if not exists entry_fee     text,
  add column if not exists entry_amount  numeric,
  add column if not exists teams_count   integer,
  add column if not exists prize_pool    text,
  add column if not exists about         text,
  add column if not exists reg_link      text,
  add column if not exists reg_opens     date,
  add column if not exists reg_closes    date,
  add column if not exists who_can_play  text,
  add column if not exists poster_url    text,
  add column if not exists consent       boolean not null default false;

-- ----------------------------------------------------------------- policies --
alter table public.clubs        enable row level security;
alter table public.venues       enable row level security;
alter table public.rankings     enable row level security;
alter table public.early_access enable row level security;

drop policy if exists "clubs read"        on public.clubs;
drop policy if exists "venues read"       on public.venues;
drop policy if exists "rankings read"     on public.rankings;
drop policy if exists "admin write clubs"    on public.clubs;
drop policy if exists "admin write venues"   on public.venues;
drop policy if exists "admin write rankings" on public.rankings;
drop policy if exists "anyone requests early access" on public.early_access;
drop policy if exists "admin reads early access"     on public.early_access;

create policy "clubs read"        on public.clubs    for select using (true);
create policy "venues read"       on public.venues   for select using (true);
create policy "rankings read"     on public.rankings for select using (true);
create policy "admin write clubs"    on public.clubs    for all using (public.is_admin()) with check (public.is_admin());
create policy "admin write venues"   on public.venues   for all using (public.is_admin()) with check (public.is_admin());
create policy "admin write rankings" on public.rankings for all using (public.is_admin()) with check (public.is_admin());
create policy "anyone requests early access" on public.early_access for insert with check (true);
create policy "admin reads early access"     on public.early_access for select using (public.is_admin());

-- ------------------------------------------------------------ seed content --
-- Mirrors CLUBS / VENUES in src/lib/seed.ts so editors can manage rows in
-- Supabase without a deploy. Idempotent via ON CONFLICT DO NOTHING.
insert into public.clubs (slug,type,name,sports,area,city,description,verified,featured,founded,players,training,coaches,highlights) values
 ('clifton-futsal-club','club','Clifton Futsal Club','["Futsal"]','Clifton','Karachi','Competitive futsal club with senior and under-19 squads.',true,true,2019,48,'Tue, Thu, Sat · 8 pm','["Usman Ali","Faraz Khan"]','SFPL 2024 runner-up'),
 ('seaview-cricket-academy','academy','Seaview Cricket Academy','["Cricket"]','DHA Phase 8','Karachi','Coaching for ages 8 to 19, with hard-ball nets and match practice.',true,false,2015,120,'Daily · 4 pm to 7 pm','["Imran Siddiqui","Bilal Raza"]','3 players in district under-16 squads'),
 ('gulshan-badminton-academy','academy','Gulshan Badminton Academy','["Badminton"]','Gulshan-e-Iqbal','Karachi','Indoor courts and coaching for beginners to tournament players.',false,false,2018,70,'Mon to Sat · 5 pm','["Sana Mirza"]','Karachi Badminton Classic 2026 champion trained here'),
 ('north-strikers-fc','club','North Strikers FC','["Football"]','North Nazimabad','Karachi','Community football club with weekend leagues.',false,false,2021,36,'Sat, Sun · 7 am','["Kamran Hussain"]','Sportika 5-a-side League semi-finalist'),
 ('lahore-padel-academy','academy','Lahore Padel Academy','["Padel"]','Gulberg','Lahore','Padel coaching, ladders and weekly social games.',true,true,2022,85,'Daily · 6 pm to 11 pm','["Ali Hamza","Zoya Sheikh"]','Hosts a monthly ranked ladder'),
 ('capital-table-tennis-club','club','Capital Table Tennis Club','["Table tennis"]','F-7','Islamabad','Club play, coaching and inter-club matches.',false,false,2017,40,'Mon, Wed, Fri · 6 pm','["Hassan Javed"]','Provincial team selections')
on conflict (slug) do nothing;

insert into public.venues (slug,type,name,sports,area,city,description,verified,featured,courts,price,hours,amenities) values
 ('arena-futsal-clifton','court','Arena Futsal Clifton','["Futsal"]','Clifton','Karachi','Two floodlit futsal courts with turf, changing rooms and parking.',true,true,2,'From Rs 6,000 / hour','4 pm to 3 am','Floodlights, changing rooms, parking, cafe'),
 ('smash-padel-dha','court','Smash Padel DHA','["Padel"]','DHA Phase 6','Karachi','Three glass padel courts, racket rental and coaching.',true,false,3,'From Rs 5,000 / hour','7 am to 2 am','Racket rental, coaching, cafe, parking'),
 ('gulshan-sports-complex','indoor','Gulshan Sports Complex','["Badminton","Table tennis"]','Gulshan-e-Iqbal','Karachi','Indoor hall with badminton courts and table tennis tables.',false,false,6,'From Rs 1,500 / hour','6 am to 11 pm','Air cooling, changing rooms, parking'),
 ('north-cricket-ground','ground','North Cricket Ground','["Cricket"]','North Karachi','Karachi','Full-size cricket ground with turf wicket and nets.',false,false,1,'From Rs 25,000 / day','7 am to 7 pm','Turf wicket, nets, pavilion, scoreboard'),
 ('gulberg-padel-hub','court','Gulberg Padel Hub','["Padel"]','Gulberg','Lahore','Indoor and outdoor padel courts in central Lahore.',true,false,4,'From Rs 4,500 / hour','7 am to 1 am','Indoor courts, rental, cafe'),
 ('f9-football-turf','ground','F-9 Football Turf','["Football","Futsal"]','F-9','Islamabad','Seven-a-side turf pitch for leagues and friendlies.',false,false,1,'From Rs 7,000 / hour','3 pm to 2 am','Floodlights, parking, seating')
on conflict (slug) do nothing;
