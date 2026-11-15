import Link from "next/link";
import type { Metadata } from "next";
import {
  getChampions,
  getFeaturedPlayers,
  getGallery,
  getLiveMatches,
  getPosts,
  getSponsors,
  getTournaments,
} from "@/lib/data";
import { HERO_SLIDES, PHOTOS, SPORTS, TICKER } from "@/lib/seed";
import { SOCIALS } from "@/lib/nav";
import { Photo } from "@/components/photo";
import { HeroCarousel } from "@/components/hero-carousel";
import { NewsTabs } from "@/components/news-tabs";
import { orgJsonLd } from "@/components/json-ld";

export const revalidate = 3600;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const IC = {
  cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  team: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 3-6 6.5-6s6.5 2.4 6.5 6"/>',
};
const svg = (k: keyof typeof IC) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" dangerouslySetInnerHTML={{ __html: IC[k] }} />
);

export default async function HomePage() {
  const [tournaments, players, news, blogs, champions, gallery, sponsors, live] = await Promise.all([
    getTournaments(),
    getFeaturedPlayers(),
    getPosts("news"),
    getPosts("blog"),
    getChampions(),
    getGallery(),
    getSponsors(),
    getLiveMatches(),
  ]);

  const [t1, t2, t3] = tournaments;
  const [champ] = champions;

  return (
    <>
      {orgJsonLd()}
      <HeroCarousel />

      {/* ticker */}
      <div className="ticker" aria-label="Latest updates">
        <div className="tk">
          {[...TICKER, ...TICKER].map((t, i) => (
            <Link key={i} href="/tournaments" tabIndex={i < TICKER.length ? 0 : -1} aria-hidden={i >= TICKER.length}>
              <b>{t.tag}</b>
              {t.text}
            </Link>
          ))}
        </div>
      </div>

      {/* browse by sport */}
      <section className="sec sm">
        <div className="wrap rv">
          <div className="head"><div><div className="kk">BROWSE BY SPORT</div><h2>Pick your <em>game</em></h2></div></div>
          <div className="spt">
            {SPORTS.map((s) => (
              <Link key={s.name} href={`/players?sport=${encodeURIComponent(s.name.toLowerCase())}`}>
                <span aria-hidden="true">{s.icon}</span>
                {s.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* who we are */}
      <section className="sec tint">
        <div className="wrap who rv">
          <div className="col">
            {PHOTOS.who.map((p) => <Photo key={p} src={p} alt="Sportika event" />)}
            <div className="est"><b>2023</b><span>FOUNDED IN KARACHI</span></div>
          </div>
          <div>
            <div className="kk">WHO WE ARE</div>
            <h2>Built on the ground, for Pakistan's athletes.</h2>
            <p>Started in 2023 as a student sports club in Karachi, Sportika now runs events, lists tournaments, records champions and gives every player a profile that coaches and scouts can find.</p>
            <div className="acts">
              <Link className="p" href="/about">Read our story</Link>
              <Link className="g" href="/team">Meet the team</Link>
            </div>
          </div>
        </div>
      </section>

      {/* tournaments */}
      <section className="sec">
        <div className="wrap rv">
          <div className="head">
            <div><div className="kk">TOURNAMENTS</div><h2>Live and <em>upcoming</em></h2></div>
            <Link className="all" href="/tournaments">All tournaments →</Link>
          </div>
          <div className="tb3">
            {t1 && (
              <Link className="tbig zoom" href={`/tournaments/${t1.slug}`}>
                <Photo src={t1.cover_image} alt={t1.name} className="shade" />
                <span className={`pill ${t1.status === "live" ? "p-live" : "p-open"}`}>{t1.status_label.toUpperCase()}</span>
                <div className="ov">
                  {t1.prize && <span className="prz">🏆 {t1.prize}</span>}
                  <small>{t1.sport.toUpperCase()}</small>
                  <h3>{t1.name}</h3>
                  <div className="mt">
                    <span>{svg("cal")}{t1.date_label}</span>
                    {t1.venue && <span>{svg("pin")}{t1.venue}</span>}
                    {t1.teams_label && <span>{svg("team")}{t1.teams_label}</span>}
                  </div>
                  <span className="reg">View tournament →</span>
                </div>
              </Link>
            )}
            {[t2, t3].filter(Boolean).map((t) => (
              <Link key={t!.slug} className="tsm zoom" href={`/tournaments/${t!.slug}`}>
                <Photo src={t!.cover_image} alt={t!.name} className="shade" />
                <span className={`pill ${t!.status === "live" ? "p-live" : "p-open"}`}>{t!.status_label.toUpperCase()}</span>
                <div className="ov">
                  {t!.prize && <small>{t!.prize}</small>}
                  <h3>{t!.name}</h3>
                  <div className="mt"><span>{svg("cal")}{t!.date_label}</span></div>
                </div>
              </Link>
            ))}
          </div>
          <div className="nudge">
            <p><b>Organizing a tournament?</b> List it free and reach players across Pakistan.</p>
            <Link href="/list-your-tournament">List your tournament →</Link>
          </div>
        </div>
      </section>

      {/* champions */}
      {champ && (
        <section className="sec champ">
          <div className="wrap rv">
            <div className="head">
              <div><div className="kk">CHAMPIONS</div><h2>Every title, <em>on record</em></h2></div>
              <Link className="all" href="/champions">All champions →</Link>
            </div>
            <div className="chw">
              <Link className="hcb" href="/champions">
                <div className="hch"><span>{champ.sport.toUpperCase()}</span><span>{champ.year.toUpperCase()}</span></div>
                <div className="hcp">
                  <div className="hcs w"><Photo src={champ.image} alt={champ.winner} /><small>CHAMPION</small><b>{champ.winner}</b></div>
                  <div className="hcm">
                    <svg viewBox="0 0 48 58" aria-hidden="true"><path d="M12 4h24v14a12 12 0 0 1-24 0z" fill="#E6AE45"/><path d="M12 8H4v4a8 8 0 0 0 8 8M36 8h8v4a8 8 0 0 1-8 8" fill="none" stroke="#B9842C" strokeWidth="3"/><rect x="21" y="30" width="6" height="12" fill="#B9842C"/><rect x="14" y="42" width="20" height="6" rx="2" fill="#E6AE45"/><rect x="10" y="48" width="28" height="6" rx="2" fill="#8A6118"/></svg>
                    {champ.score && <span>{champ.score}</span>}
                  </div>
                  <div className="hcs">{champ.runner_up && <><Photo src={PHOTOS.champ[1]} alt={champ.runner_up} /><small>RUNNER-UP</small><b>{champ.runner_up}</b></>}</div>
                </div>
                <div className="hcf"><small>LATEST CHAMPION</small><h3>{champ.tournament}</h3><span>View results →</span></div>
              </Link>
              <div className="chl">
                <small className="chk">RECENT TITLES</small>
                {champions.slice(1, 4).map((c, i) => (
                  <Link key={c.id} className="hcr" href="/champions">
                    <Photo src={PHOTOS.champ[i + 3] ?? c.image} alt={c.winner} />
                    <div>
                      <small>{c.sport.toUpperCase()}</small>
                      <b>{c.winner}</b>
                      <span>beat {c.runner_up}{c.score ? ` (${c.score})` : ""}</span>
                      <em>{c.tournament}</em>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="nudge">
              <p><b>Kya aapki team agli champion banegi?</b> Find your next tournament and go for the title.</p>
              <Link href="/tournaments">Find a tournament →</Link>
            </div>
          </div>
        </section>
      )}

      {/* players */}
      <section className="sec tint">
        <div className="wrap rv">
          <div className="head">
            <div><div className="kk">LOCAL HEROES</div><h2>Players to <em>watch</em></h2></div>
            <Link className="all" href="/players">All players →</Link>
          </div>
          <div className="fcs">
            {players.map((p) => (
              <Link key={p.id} className="fc" href={`/players/${p.slug}`}>
                <span className="fcf">FEATURED</span>
                <Photo src={p.avatar_url} alt={p.name} />
                <div className="fcb">
                  <small>{p.sport.toUpperCase()} · {p.city.toUpperCase()}</small>
                  <h3>{p.name}</h3>
                  {p.achievement && <p>🏆 {p.achievement}</p>}
                </div>
              </Link>
            ))}
          </div>
          <div className="nudge">
            <p><b>Your game deserves to be seen.</b> Build your free profile and get found by coaches and scouts.</p>
            <Link href="/join-player">Join as player →</Link>
          </div>
        </div>
      </section>

      {/* media */}
      <section className="sec">
        <div className="wrap rv">
          <div className="head">
            <div><div className="kk">MEDIA</div><h2>News and <em>insights</em></h2></div>
          </div>
          <NewsTabs news={news} blogs={blogs} />
          <div className="nudge">
            <p><b>Made headlines on the ground?</b> Send us your story, result or press release.</p>
            <Link href="/contact?topic=news">Send your story →</Link>
          </div>
        </div>
      </section>

      {/* live matches strip */}
      {live.length > 0 && (
        <section className="sec dark">
          <div className="wrap rv">
            <div className="head">
              <div><div className="kk">LIVE NOW</div><h2>Scores updating <em>in real time</em></h2></div>
              <Link className="all" href="/tournaments/karachi-futsal-cup">Full coverage →</Link>
            </div>
            <div className="board">
              {live.map((m) => (
                <div key={m.id} className="row">
                  <span className="team">{m.team_a}</span>
                  <span className="score">{m.score_a} - {m.score_b}<br /><span className="live-dot" style={{ fontSize: 11 }}>{m.clock}</span></span>
                  <span className="team b">{m.team_b}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* podcast */}
      <section className="sec tint">
        <div className="wrap rv">
          <div className="head">
            <div><div className="kk">THE PODCAST</div><h2>Stories from the <em>game</em></h2></div>
            <Link className="all" href="/podcast">All episodes →</Link>
          </div>
          <div className="pod">
            <Link className="vid zoom" href="/podcast" aria-label="Play latest episode">
              <Photo src={PHOTOS.pod[0]} alt="" className="shade" />
              <span className="plb" />
            </Link>
            <div className="ptx">
              <small>LATEST · EPISODE 9</small>
              <h3>{HERO_SLIDES[3].name}</h3>
              <p>{HERO_SLIDES[3].desc}</p>
              <div className="pb">
                <Link href="/podcast">All episodes</Link>
                <Link href="/contact?topic=podcast">Be a guest</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* gallery */}
      <section className="sec">
        <div className="wrap rv">
          <div className="head">
            <div><div className="kk">GALLERY</div><h2>Caught in <em>play</em></h2></div>
            <Link className="all" href="/gallery">Open gallery →</Link>
          </div>
          <div className="gs">
            {gallery.slice(0, 5).map((g) => (
              <Link key={g.id} className="zoom" href={`/gallery#${g.album_slug}`} aria-label={`Album: ${g.album}`}>
                <Photo src={g.image} alt={g.album} className="shade" />
                <span>{g.album} <em>See album →</em></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* community */}
      <section className="sec sm">
        <div className="wrap rv">
          <div className="com">
            <div className="wa">
              <i><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.2A8.5 8.5 0 1 1 21 12z" /></svg></i>
              <div><small>JOIN THE COMMUNITY</small><h3>Sportika on WhatsApp</h3><p>Groups for every sport. Get tournaments, trials and results first.</p></div>
              <a href="#">Join the community</a>
            </div>
            <div className="fol">
              <small>FOLLOW SPORTIKA</small>
              <div className="so">
                {SOCIALS.map((s) => (
                  <a key={s.name} href={s.href} aria-label={`Sportika on ${s.name}`}>
                    <svg viewBox="0 0 24 24" aria-hidden="true" dangerouslySetInnerHTML={{ __html: s.path }} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* partners */}
      <section className="sec tint">
        <div className="wrap rv">
          <div className="head">
            <div><div className="kk">PARTNERS</div><h2>Backed by</h2></div>
            <Link className="all" href="/sponsors">All sponsors →</Link>
          </div>
          <div className="sp">
            {sponsors.map((name) => <div key={name}>{name}</div>)}
          </div>
        </div>
      </section>

      {/* cta */}
      <section className="sec">
        <div className="wrap rv">
          <div className="cta2">
            <Link className="cb zoom" href="/join-player">
              <Photo src={PHOTOS.cta[0]} alt="" className="shade" />
              <small>FOR PLAYERS</small>
              <h3>Pakistan's next star could be you</h3>
              <p>Your free profile, your stats, your story. Coaches and scouts are looking.</p>
              <u>Join as player →</u>
            </Link>
            <Link className="cb alt zoom" href="/contact?topic=event">
              <Photo src={PHOTOS.cta[1]} alt="" className="shade" />
              <small>FOR SCHOOLS, UNIVERSITIES AND COMPANIES</small>
              <h3>Run your event with us</h3>
              <p>We plan and run it end to end, from registration to the final.</p>
              <u>Talk to us →</u>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
