-- ============================================================================
-- Sportika website — seed content for web_* tables only.
-- Events/players/matches come from the mobile views, so they are NOT seeded
-- here. Every insert is guarded so re-running never duplicates rows.
-- ============================================================================

insert into public.web_posts (slug,type,category,title,excerpt,cover_image,published_label,body) values
 ('padel-open-registration-live','news','BREAKING','Sportika Padel Open registration is now live','Three days of knockout padel at DHA Phase 6. Entries close 12 November.','https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=1400&q=70&auto=format&fit=crop','2 hours ago','Registration for the Sportika Padel Open is now open across men''s, women''s and mixed draws.'),
 ('futsal-quarter-finals','news','RESULT','Inter-university futsal: quarter-final results','Four universities book their semi-final spots at Aqua Futsal Arena.','https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1400&q=70&auto=format&fit=crop','Live now','The quarter-finals delivered two penalty shoot-outs and a last-minute winner.'),
 ('basketball-finals','news','NEWS','Inter-school basketball: final results','A clean sweep for the defending champions in a high-scoring final.','https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1400&q=70&auto=format&fit=crop','Yesterday','The inter-school basketball season closed with the defending champions retaining their title.'),
 ('chess-revival-karachi','news','FEATURE','Inside the chess revival in Karachi universities','New clubs, sponsor-backed leagues and record entries at campus opens.','https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=1400&q=70&auto=format&fit=crop','2 days ago','Chess is having a moment in Karachi''s universities.'),
 ('getting-verified','blog','BLOG','What it takes to get verified on Sportika','How the badge works and how to earn it.','https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1400&q=70&auto=format&fit=crop','5 min read','Verification confirms an athlete''s identity and results.'),
 ('profile-scouts-read','blog','GUIDE','How to build a player profile scouts read','Photos, stats, highlights, in the right order.','https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1400&q=70&auto=format&fit=crop','4 min read','Start with a clear headshot and an action photo.'),
 ('grassroots-cricket-records','blog','OPINION','Why grassroots cricket needs better records','If it isn''t documented, it didn''t happen.','https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1400&q=70&auto=format&fit=crop','6 min read','Local cricket produces plenty of talent and almost no reliable data.'),
 ('running-a-tournament','blog','TIPS','Running a tournament without losing money','Budgeting, fees, sponsorship, and the pitfalls.','https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1400&q=70&auto=format&fit=crop','5 min read','Lock your venue and pricing first.')
on conflict (slug) do nothing;

insert into public.web_champions (sport,tournament,year,winner,runner_up,score,image)
select v.sport, v.tournament, v.year, v.winner, v.runner_up, v.score, v.image
from (values
 ('Football · Team','Sportika 5-a-side Football League','Oct 2026','DHA Strikers','Clifton United','3-2','https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=1400&q=70&auto=format&fit=crop'),
 ('Futsal · Dec 2025','Karachi Futsal Super Cup','Dec 2025','Karachi Falcons','Lahore Lions','5-4','https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=1400&q=70&auto=format&fit=crop'),
 ('Badminton · 2026','Karachi Badminton Classic','2026','Sara Khan','Ayesha Malik','21-17, 21-19','https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1400&q=70&auto=format&fit=crop'),
 ('Chess · 2026','Sindh Chess Championship','2026','Zain Abbas','Omar Sheikh',null,'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1400&q=70&auto=format&fit=crop')
) as v(sport,tournament,year,winner,runner_up,score,image)
where not exists (
  select 1 from public.web_champions c
  where c.sport = v.sport and c.tournament = v.tournament and c.year = v.year
);

insert into public.web_podcast_episodes (episode_no,title,description,duration,cover_image)
select v.episode_no, v.title, v.description, v.duration, v.cover_image
from (values
 (9,'From Karachi gullies to the national squad','How a street cricketer got noticed, and what the road to the top really takes.','45 min','https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=1400&q=70&auto=format&fit=crop'),
 (8,'Running a league on a student budget',null,'42 min','https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1400&q=70&auto=format&fit=crop'),
 (7,'Women in Karachi padel',null,'38 min','https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1400&q=70&auto=format&fit=crop')
) as v(episode_no,title,description,duration,cover_image)
where not exists (
  select 1 from public.web_podcast_episodes p where p.episode_no = v.episode_no
);

insert into public.web_gallery_items (album,album_slug,caption,image)
select v.album, v.album_slug, v.caption, v.image
from (values
 ('IQRAVERSE','iqraverse','Campus sports festival','https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1400&q=70&auto=format&fit=crop'),
 ('SPPL','sppl','Padel Premier League','https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1400&q=70&auto=format&fit=crop'),
 ('SFPL','sfpl','Futsal Premier League','https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=1400&q=70&auto=format&fit=crop'),
 ('Chess','chess','Sindh Chess Championship','https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=1400&q=70&auto=format&fit=crop'),
 ('Summer Sports Fiesta','ssf','Summer Sports Fiesta','https://images.unsplash.com/photo-1551958219-acbc608c6377?w=1400&q=70&auto=format&fit=crop')
) as v(album,album_slug,caption,image)
where not exists (
  select 1 from public.web_gallery_items g
  where g.album_slug = v.album_slug and g.caption = v.caption
);

insert into public.web_sponsors (name,position)
select v.name, v.position
from (values
 ('Tapmad',1),('Quice',2),('Leisure Leagues',3),('Nutrilov',4),('Champions Club',5),('Iqra University',6)
) as v(name,position)
where not exists (select 1 from public.web_sponsors s where s.name = v.name);

insert into public.web_coaches (name,title,sport,city,image,blurb)
select v.name, v.title, v.sport, v.city, v.image, v.blurb
from (values
 ('Imran Yousuf','Head Cricket Coach','Cricket','Karachi','https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1400&q=70&auto=format&fit=crop','15 years coaching juniors and university sides.'),
 ('Nadia Aslam','Badminton Coach','Badminton','Karachi','https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=1400&q=70&auto=format&fit=crop','National-level singles specialist.'),
 ('Faisal Raza','Futsal Coach','Futsal','Karachi','https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=1400&q=70&auto=format&fit=crop','SFPL-winning head coach.'),
 ('Hira Shah','Padel Coach','Padel','Lahore','https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1400&q=70&auto=format&fit=crop','Former pro tour player.')
) as v(name,title,sport,city,image,blurb)
where not exists (select 1 from public.web_coaches c where c.name = v.name);

insert into public.web_ambassadors (name,title,city,image,blurb)
select v.name, v.title, v.city, v.image, v.blurb
from (values
 ('Areeba Khan','Iqra University','Karachi','https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1400&q=70&auto=format&fit=crop','Runs campus tournaments and trials.'),
 ('Daniyal Haider','FAST NUCES','Karachi','https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1400&q=70&auto=format&fit=crop','Leads the esports society.'),
 ('Maria Siddiqui','University of Karachi','Karachi','https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1400&q=70&auto=format&fit=crop','Women''s cricket ambassador.')
) as v(name,title,city,image,blurb)
where not exists (select 1 from public.web_ambassadors a where a.name = v.name);

insert into public.web_societies (name,title,sport,city,image,blurb)
select v.name, v.title, v.sport, v.city, v.image, v.blurb
from (values
 ('Iqra University Sports Society','University','Multi','Karachi','https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=1400&q=70&auto=format&fit=crop','Runs IQRAVERSE and eight intramural leagues.'),
 ('Karachi Futsal Club','Club','Futsal','Karachi','https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=1400&q=70&auto=format&fit=crop','Home of the SFPL.'),
 ('Sindh Chess Association','Association','Chess','Karachi','https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1400&q=70&auto=format&fit=crop','Sanctions rating and district events.')
) as v(name,title,sport,city,image,blurb)
where not exists (select 1 from public.web_societies s where s.name = v.name);

insert into public.web_team_members (name,title,city,image,blurb)
select v.name, v.title, v.city, v.image, v.blurb
from (values
 ('Seebu','Founder','Karachi','https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=1400&q=70&auto=format&fit=crop','Started Sportika as a student club in 2023.'),
 ('Zoya Ahmed','Head of Events','Karachi','https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1400&q=70&auto=format&fit=crop','Runs tournaments end to end.'),
 ('Bilal Ahmed','Head of Media','Karachi','https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=1400&q=70&auto=format&fit=crop','Leads coverage, podcasts and the gallery.')
) as v(name,title,city,image,blurb)
where not exists (select 1 from public.web_team_members tm where tm.name = v.name);

insert into public.web_clubs (slug,type,name,sports,area,city,description,verified,featured,founded,players,training,coaches,highlights) values
 ('clifton-futsal-club','club','Clifton Futsal Club','["Futsal"]','Clifton','Karachi','Competitive futsal club with senior and under-19 squads.',true,true,2019,48,'Tue, Thu, Sat · 8 pm','["Usman Ali","Faraz Khan"]','SFPL 2024 runner-up'),
 ('seaview-cricket-academy','academy','Seaview Cricket Academy','["Cricket"]','DHA Phase 8','Karachi','Coaching for ages 8 to 19, with hard-ball nets and match practice.',true,false,2015,120,'Daily · 4 pm to 7 pm','["Imran Siddiqui","Bilal Raza"]','3 players in district under-16 squads'),
 ('gulshan-badminton-academy','academy','Gulshan Badminton Academy','["Badminton"]','Gulshan-e-Iqbal','Karachi','Indoor courts and coaching for beginners to tournament players.',false,false,2018,70,'Mon to Sat · 5 pm','["Sana Mirza"]','Karachi Badminton Classic 2026 champion trained here'),
 ('north-strikers-fc','club','North Strikers FC','["Football"]','North Nazimabad','Karachi','Community football club with weekend leagues.',false,false,2021,36,'Sat, Sun · 7 am','["Kamran Hussain"]','Sportika 5-a-side League semi-finalist'),
 ('lahore-padel-academy','academy','Lahore Padel Academy','["Padel"]','Gulberg','Lahore','Padel coaching, ladders and weekly social games.',true,true,2022,85,'Daily · 6 pm to 11 pm','["Ali Hamza","Zoya Sheikh"]','Hosts a monthly ranked ladder'),
 ('capital-table-tennis-club','club','Capital Table Tennis Club','["Table tennis"]','F-7','Islamabad','Club play, coaching and inter-club matches.',false,false,2017,40,'Mon, Wed, Fri · 6 pm','["Hassan Javed"]','Provincial team selections')
on conflict (slug) do nothing;

insert into public.web_venues (slug,type,name,sports,area,city,description,verified,featured,courts,price,hours,amenities) values
 ('arena-futsal-clifton','court','Arena Futsal Clifton','["Futsal"]','Clifton','Karachi','Two floodlit futsal courts with turf, changing rooms and parking.',true,true,2,'From Rs 6,000 / hour','4 pm to 3 am','Floodlights, changing rooms, parking, cafe'),
 ('smash-padel-dha','court','Smash Padel DHA','["Padel"]','DHA Phase 6','Karachi','Three glass padel courts, racket rental and coaching.',true,false,3,'From Rs 5,000 / hour','7 am to 2 am','Racket rental, coaching, cafe, parking'),
 ('gulshan-sports-complex','indoor','Gulshan Sports Complex','["Badminton","Table tennis"]','Gulshan-e-Iqbal','Karachi','Indoor hall with badminton courts and table tennis tables.',false,false,6,'From Rs 1,500 / hour','6 am to 11 pm','Air cooling, changing rooms, parking'),
 ('north-cricket-ground','ground','North Cricket Ground','["Cricket"]','North Karachi','Karachi','Full-size cricket ground with turf wicket and nets.',false,false,1,'From Rs 25,000 / day','7 am to 7 pm','Turf wicket, nets, pavilion, scoreboard'),
 ('gulberg-padel-hub','court','Gulberg Padel Hub','["Padel"]','Gulberg','Lahore','Indoor and outdoor padel courts in central Lahore.',true,false,4,'From Rs 4,500 / hour','7 am to 1 am','Indoor courts, rental, cafe'),
 ('f9-football-turf','ground','F-9 Football Turf','["Football","Futsal"]','F-9','Islamabad','Seven-a-side turf pitch for leagues and friendlies.',false,false,1,'From Rs 7,000 / hour','3 pm to 2 am','Floodlights, parking, seating')
on conflict (slug) do nothing;
