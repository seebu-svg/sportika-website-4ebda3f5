-- ============================================================================
-- Sportika — seed content (mirrors src/lib/seed.ts so editors can manage rows
-- in Supabase without a deploy). Uses ON CONFLICT DO NOTHING to stay idempotent.
-- ============================================================================

insert into public.tournaments (slug,name,sport,city,status,status_label,prize,date_label,venue,teams_label,entry_fee,capacity,start_date,end_date,cover_image,description) values
 ('karachi-futsal-cup','Karachi Inter-University Futsal Cup','Futsal','Karachi','live','Live now','Rs 150,000 prize pool','27 Oct to 2 Nov','Aqua Futsal Arena, Karachi','16 teams','Rs 6,000 / team',16,'2026-10-27','2026-11-02','https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=1400&q=70&auto=format&fit=crop','Sixteen university futsal sides from across Sindh battle for the Inter-University crown at Aqua Futsal Arena. Live scores all week.'),
 ('sportika-padel-open','Sportika Padel Open','Padel','Karachi','published','Registration open','Rs 4,000 / pair','21 to 23 Nov','DHA Phase 6 Padel Club, Karachi','32 pairs','Rs 4,000 / pair',32,'2026-11-21','2026-11-23','https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1400&q=70&auto=format&fit=crop','Karachi''s biggest open padel tournament returns for a three-day knockout across men''s, women''s and mixed draws.'),
 ('al-noor-badminton-olympiad','Al-Noor Schools Badminton Olympiad','Badminton','Karachi','published','Registration open','Rs 1,500 / player','28 to 30 Nov','Al-Noor Campus Hall, Karachi','64 players','Rs 1,500 / player',64,'2026-11-28','2026-11-30','https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1400&q=70&auto=format&fit=crop','A inter-school badminton meet for under-16 and under-19 singles and doubles.')
on conflict (slug) do nothing;

insert into public.players (slug,name,sport,city,position,rating,avatar_url,achievement,featured,bio,stats) values
 ('ahmed-raza','Ahmed Raza','Cricket','Karachi','BAT',86,'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=1400&q=70&auto=format&fit=crop','Best Batter, Inter-University Cup 2025',true,'Left-handed opening batter known for a quick start and clean strike zone.','[{"value":"42","label":"MAT"},{"value":"1,860","label":"RUNS"},{"value":"48.9","label":"AVG"}]'),
 ('sara-khan','Sara Khan','Badminton','Karachi','SGL',84,'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1400&q=70&auto=format&fit=crop','Champion, Karachi Badminton Classic 2026',true,'National-level singles player with a smash-first game.','[{"value":"31","label":"MAT"},{"value":"24","label":"WON"},{"value":"6","label":"TITLES"}]'),
 ('bilal-ahmed','Bilal Ahmed','Futsal','Karachi','PIV',81,'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=1400&q=70&auto=format&fit=crop','Top Scorer, SFPL 2024',false,'Clinical pivot and set-piece specialist in the Sindh Futsal Premier League.','[{"value":"27","label":"MAT"},{"value":"39","label":"GOALS"},{"value":"12","label":"AST"}]'),
 ('fatima-noor','Fatima Noor','Padel','Lahore','DRV',79,'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=1400&q=70&auto=format&fit=crop','Runner-up, SPPL 2025',false,'Defensive wall at the back of the court, great retriever.','[{"value":"22","label":"MAT"},{"value":"17","label":"WON"},{"value":"2","label":"TITLES"}]'),
 ('zain-abbas','Zain Abbas','Chess','Karachi','',88,'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=1400&q=70&auto=format&fit=crop','Sindh Chess Champion 2026',false,'FIDE-rated 2210, tactical player.','[{"value":"2210","label":"RATING"},{"value":"140","label":"GAMES"},{"value":"61%","label":"SCORE"}]'),
 ('ayesha-malik','Ayesha Malik','Badminton','Lahore','SGL',80,'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=1400&q=70&auto=format&fit=crop','Runner-up, Karachi Classic',false,'Fast footwork and net play.','[{"value":"28","label":"MAT"},{"value":"19","label":"WON"}]'),
 ('omar-sheikh','Omar Sheikh','Chess','Islamabad','',77,'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1400&q=70&auto=format&fit=crop',null,false,'Positional player and school coach.','[{"value":"1980","label":"RATING"}]'),
 ('hamza-ali','Hamza Ali','Football','Karachi','MF',78,'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=1400&q=70&auto=format&fit=crop','Captain, DHA Strikers',false,'Box-to-box midfielder and league-winning captain.','[{"value":"35","label":"MAT"},{"value":"11","label":"GOALS"}]')
on conflict (slug) do nothing;

insert into public.posts (slug,type,category,title,excerpt,cover_image,published_label,body) values
 ('padel-open-registration-live','news','BREAKING','Sportika Padel Open registration is now live','Three days of knockout padel at DHA Phase 6. Entries close 12 November.','https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=1400&q=70&auto=format&fit=crop','2 hours ago','Registration for the Sportika Padel Open is now open across men''s, women''s and mixed draws.'),
 ('futsal-quarter-finals','news','RESULT','Inter-university futsal: quarter-final results','Four universities book their semi-final spots at Aqua Futsal Arena.','https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1400&q=70&auto=format&fit=crop','Live now','The quarter-finals delivered two penalty shoot-outs and a last-minute winner.'),
 ('basketball-finals','news','NEWS','Inter-school basketball: final results','A clean sweep for the defending champions in a high-scoring final.','https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1400&q=70&auto=format&fit=crop','Yesterday','The inter-school basketball season closed with the defending champions retaining their title.'),
 ('chess-revival-karachi','news','FEATURE','Inside the chess revival in Karachi universities','New clubs, sponsor-backed leagues and record entries at campus opens.','https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=1400&q=70&auto=format&fit=crop','2 days ago','Chess is having a moment in Karachi''s universities.'),
 ('getting-verified','blog','BLOG','What it takes to get verified on Sportika','How the badge works and how to earn it.','https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1400&q=70&auto=format&fit=crop','5 min read','Verification confirms an athlete''s identity and results.'),
 ('profile-scouts-read','blog','GUIDE','How to build a player profile scouts read','Photos, stats, highlights, in the right order.','https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1400&q=70&auto=format&fit=crop','4 min read','Start with a clear headshot and an action photo.'),
 ('grassroots-cricket-records','blog','OPINION','Why grassroots cricket needs better records','If it isn''t documented, it didn''t happen.','https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1400&q=70&auto=format&fit=crop','6 min read','Local cricket produces plenty of talent and almost no reliable data.'),
 ('running-a-tournament','blog','TIPS','Running a tournament without losing money','Budgeting, fees, sponsorship, and the pitfalls.','https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1400&q=70&auto=format&fit=crop','5 min read','Lock your venue and pricing first.')
on conflict (slug) do nothing;

insert into public.champions (sport,tournament,year,winner,runner_up,score,image) values
 ('Football · Team','Sportika 5-a-side Football League','Oct 2026','DHA Strikers','Clifton United','3-2','https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=1400&q=70&auto=format&fit=crop'),
 ('Futsal · Dec 2025','Karachi Futsal Super Cup','Dec 2025','Karachi Falcons','Lahore Lions','5-4','https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=1400&q=70&auto=format&fit=crop'),
 ('Badminton · 2026','Karachi Badminton Classic','2026','Sara Khan','Ayesha Malik','21-17, 21-19','https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1400&q=70&auto=format&fit=crop'),
 ('Chess · 2026','Sindh Chess Championship','2026','Zain Abbas','Omar Sheikh',null,'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1400&q=70&auto=format&fit=crop');

insert into public.podcast_episodes (episode_no,title,description,duration,cover_image) values
 (9,'From Karachi gullies to the national squad','How a street cricketer got noticed, and what the road to the top really takes.','45 min','https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=1400&q=70&auto=format&fit=crop'),
 (8,'Running a league on a student budget',null,'42 min','https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1400&q=70&auto=format&fit=crop'),
 (7,'Women in Karachi padel',null,'38 min','https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1400&q=70&auto=format&fit=crop');

insert into public.gallery_items (album,album_slug,caption,image) values
 ('IQRAVERSE','iqraverse','Campus sports festival','https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1400&q=70&auto=format&fit=crop'),
 ('SPPL','sppl','Padel Premier League','https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1400&q=70&auto=format&fit=crop'),
 ('SFPL','sfpl','Futsal Premier League','https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=1400&q=70&auto=format&fit=crop'),
 ('Chess','chess','Sindh Chess Championship','https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=1400&q=70&auto=format&fit=crop'),
 ('Summer Sports Fiesta','ssf','Summer Sports Fiesta','https://images.unsplash.com/photo-1551958219-acbc608c6377?w=1400&q=70&auto=format&fit=crop');

insert into public.sponsors (name,position) values
 ('Tapmad',1),('Quice',2),('Leisure Leagues',3),('Nutrilov',4),('Champions Club',5),('Iqra University',6);

insert into public.coaches (name,title,sport,city,image,blurb) values
 ('Imran Yousuf','Head Cricket Coach','Cricket','Karachi','https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1400&q=70&auto=format&fit=crop','15 years coaching juniors and university sides.'),
 ('Nadia Aslam','Badminton Coach','Badminton','Karachi','https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=1400&q=70&auto=format&fit=crop','National-level singles specialist.'),
 ('Faisal Raza','Futsal Coach','Futsal','Karachi','https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=1400&q=70&auto=format&fit=crop','SFPL-winning head coach.'),
 ('Hira Shah','Padel Coach','Padel','Lahore','https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1400&q=70&auto=format&fit=crop','Former pro tour player.');

insert into public.ambassadors (name,title,city,image,blurb) values
 ('Areeba Khan','Iqra University','Karachi','https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1400&q=70&auto=format&fit=crop','Runs campus tournaments and trials.'),
 ('Daniyal Haider','FAST NUCES','Karachi','https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1400&q=70&auto=format&fit=crop','Leads the esports society.'),
 ('Maria Siddiqui','University of Karachi','Karachi','https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1400&q=70&auto=format&fit=crop','Women''s cricket ambassador.');

insert into public.societies (name,title,sport,city,image,blurb) values
 ('Iqra University Sports Society','University','Multi','Karachi','https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=1400&q=70&auto=format&fit=crop','Runs IQRAVERSE and eight intramural leagues.'),
 ('Karachi Futsal Club','Club','Futsal','Karachi','https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=1400&q=70&auto=format&fit=crop','Home of the SFPL.'),
 ('Sindh Chess Association','Association','Chess','Karachi','https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1400&q=70&auto=format&fit=crop','Sanctions rating and district events.');

insert into public.team_members (name,title,city,image,blurb) values
 ('Seebu','Founder','Karachi','https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=1400&q=70&auto=format&fit=crop','Started Sportika as a student club in 2023.'),
 ('Zoya Ahmed','Head of Events','Karachi','https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1400&q=70&auto=format&fit=crop','Runs tournaments end to end.'),
 ('Bilal Ahmed','Head of Media','Karachi','https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=1400&q=70&auto=format&fit=crop','Leads coverage, podcasts and the gallery.');

-- Matches + live events for the futsal cup (slug must exist first).
with m as (
  insert into public.matches (tournament_slug,team_a,team_b,score_a,score_b,status,clock,court,scheduled_at)
  values ('karachi-futsal-cup','Karachi Falcons','Lahore Lions',5,4,'live','2nd half','Court 1','2026-11-01T16:00:00Z'),
         ('karachi-futsal-cup','Sindh University','FAST',2,2,'live','1st half','Court 2','2026-11-01T17:00:00Z')
  returning id, team_a
)
insert into public.live_events (match_id,type,detail,minute)
select id,'score','Goal — '||team_a,34 from m;
