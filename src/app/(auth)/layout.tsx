import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <section style={{ minHeight: "72vh", display: "flex", alignItems: "center", padding: "56px 0" }}>
      <div className="wrap" style={{ display: "flex", justifyContent: "center" }}>
        <div className="card" style={{ padding: 32, width: "min(100%,480px)" }}>
          {children}
        </div>
      </div>
    </section>
  );
}
