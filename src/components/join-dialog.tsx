"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

const JoinContext = createContext<{ open: () => void }>({ open: () => {} });

export function useJoin() {
  return useContext(JoinContext);
}

const I = (p: string) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" dangerouslySetInnerHTML={{ __html: p }} />
);

const MAIN: [string, string, string, string][] = [
  ["/join-player", "As an Athlete", "Build your sports profile with stats, photos and achievements, and get found by scouts.", '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>'],
  ["/list-your-tournament", "As an Organizer", "List your tournament free and fill it with players from across Pakistan.", '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M8 15h3"/>'],
  ["/contact?topic=sponsor", "As a Sponsor or Brand", "Back events, athletes and stories that sports fans follow.", '<path d="M11 17l-2 2a2.8 2.8 0 0 1-4-4l3-3a2.8 2.8 0 0 1 4 0"/><path d="M13 7l2-2a2.8 2.8 0 0 1 4 4l-3 3a2.8 2.8 0 0 1-4 0M9 15l6-6"/>'],
];

const MORE: [string, string, string, string][] = [
  ["/ambassadors", "Campus Ambassador", "Lead Sportika on your campus", '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/>'],
  ["/careers", "Join the team", "Volunteer on real events", '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 3-6 6.5-6s6.5 2.4 6.5 6M16 4.8a3.5 3.5 0 0 1 0 6.4M18 14.5c2 .7 3.5 2.6 3.5 5.5"/>'],
  ["/careers", "Work with us", "Paid jobs and internships", '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>'],
];

export function JoinProvider({ children }: { children: ReactNode }) {
  const [on, setOn] = useState(false);
  const open = useCallback(() => setOn(true), []);
  const close = useCallback(() => setOn(false), []);

  useEffect(() => {
    if (!on) return;
    const key = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.body.style.overflow = "hidden";
    addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = "";
      removeEventListener("keydown", key);
    };
  }, [on, close]);

  return (
    <JoinContext.Provider value={{ open }}>
      {children}
      {on && (
        <div className="jz on" role="dialog" aria-modal="true" aria-labelledby="jz-t" onClick={(e) => (e.target === e.currentTarget ? close() : undefined)}>
          <div className="jz-b">
            <div className="jz-h">
              <h2 id="jz-t">Join <em>Sportika Pakistan</em></h2>
              <p>Choose how you want to be part of the game.</p>
            </div>
            <button type="button" className="jz-x" aria-label="Close" onClick={close}>
              {I('<path d="M6 6l12 12M18 6L6 18"/>')}
            </button>
            <div className="jz-m">
              {MAIN.map((o) => (
                <a key={o[1] + o[0]} className="jz-c" href={o[0]} onClick={close}>
                  <i>{I(o[3])}</i>
                  <div><b>{o[1]}</b><span>{o[2]}</span></div>
                </a>
              ))}
            </div>
            <div className="jz-l">MORE WAYS TO JOIN</div>
            <div className="jz-o">
              {MORE.map((o) => (
                <a key={o[1] + o[0]} className="jz-r" href={o[0]} onClick={close}>
                  <i>{I(o[3])}</i>
                  <div><b>{o[1]}</b><span>{o[2]}</span></div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </JoinContext.Provider>
  );
}
