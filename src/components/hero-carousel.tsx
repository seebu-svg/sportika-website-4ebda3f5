"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { HERO_SLIDES, PHOTOS } from "@/lib/seed";
import { Photo } from "./photo";
import { useJoin } from "./join-dialog";

export function HeroCarousel() {
  const [cur, setCur] = useState(0);
  const [fading, setFading] = useState(false);
  const [paused, setPaused] = useState(false);
  const [textH, setTextH] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchX = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const { open } = useJoin();
  const slide = HERO_SLIDES[cur];

  const go = (i: number) => {
    if (i === cur) return;
    setFading(true);
    setTimeout(() => {
      setCur(i);
      setFading(false);
    }, 220);
  };

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || paused) return;
    timer.current = setTimeout(() => setCur((c) => (c + 1) % HERO_SLIDES.length), 4000);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [cur, paused]);

  // fit(): pin the text block to the tallest slide so buttons/tabs never move
  const fit = useCallback(() => {
    const stage = stageRef.current;
    const box = measureRef.current;
    if (!stage || !box) return;
    const w = stage.clientWidth;
    if (!w) return;
    box.style.width = `${w}px`;
    let max = 0;
    for (const el of Array.from(box.children) as HTMLElement[]) {
      max = Math.max(max, el.getBoundingClientRect().height);
    }
    if (max) setTextH(Math.round(max));
  }, []);

  useEffect(() => {
    fit();
    const stage = stageRef.current;
    if (!stage || typeof ResizeObserver === "undefined") return;
    let raf = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(fit);
    });
    ro.observe(stage);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [fit]);

  // subtle 3D tilt on the highlight card (pointer devices, large screens)
  useEffect(() => {
    const scene = sceneRef.current;
    const card = cardRef.current;
    if (!scene || !card) return;
    if (!matchMedia("(hover: hover)").matches) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.innerWidth <= 900) return;
    const onMove = (e: MouseEvent) => {
      const r = scene.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `rotateY(${-12 + x * 14}deg) rotateX(${4 - y * 10}deg)`;
    };
    const onLeave = () => {
      card.style.transform = "";
    };
    scene.addEventListener("mousemove", onMove);
    scene.addEventListener("mouseleave", onLeave);
    return () => {
      scene.removeEventListener("mousemove", onMove);
      scene.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section
      className={paused ? "hero paused" : "hero"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 50) go((cur + (dx < 0 ? 1 : HERO_SLIDES.length - 1)) % HERO_SLIDES.length);
      }}
    >
      <div className="hbg" aria-hidden="true">
        {PHOTOS.hero.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={src} src={src} alt="" className={i === cur ? "on" : ""} onError={(e) => (e.currentTarget.style.display = "none")} />
        ))}
      </div>

      <div className="wrap stage" ref={stageRef}>
        <div>
          <div className="eb">HOME OF PAKISTAN SPORTS</div>
          <div className={fading ? "sw out" : "sw"} style={textH ? { minHeight: textH } : undefined}>
            <h1 dangerouslySetInnerHTML={{ __html: slide.heading }} />
            <p className="lead">{slide.lead}</p>
          </div>
          <div className="acts">
            <Link className="p" href={slide.href}>{slide.cta}</Link>
            <a className="g" href="#" onClick={(e) => { e.preventDefault(); open(); }}>Join Sportika</a>
          </div>
        </div>

        <div className="scene" ref={sceneRef}>
          <div className="c3" ref={cardRef}>
            <div className="ghost g2" />
            <div className="ghost g1" />
            <Link className="face" href={slide.hrefAlt ?? slide.href}>
              <div className={fading ? "fw out" : "fw"}>
                <Photo src={PHOTOS.card[cur]} alt={slide.name} eager />
                <span className="tagp">{slide.tag}</span>
                <div className="fb">
                  <small>{slide.cat}</small>
                  <h3>{slide.name}</h3>
                  <p>{slide.desc}</p>
                  <u>{slide.linkLabel} →</u>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="wrap tabs" role="group" aria-label="Explore Sportika">
        {HERO_SLIDES.map((x, i) => (
          <button key={x.t} type="button" className={i === cur ? "on" : ""} aria-pressed={i === cur} onClick={() => go(i)}>
            {x.t}
            <small>{x.s}</small>
            <i />
          </button>
        ))}
      </div>

      {/* off-screen: every slide's text, measured by fit() to pin the height */}
      <div ref={measureRef} aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, zIndex: -1, opacity: 0, pointerEvents: "none" }}>
        {HERO_SLIDES.map((x) => (
          <div key={x.t} className="sw" style={{ minHeight: 0 }}>
            <h1 dangerouslySetInnerHTML={{ __html: x.heading }} />
            <p className="lead">{x.lead}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
