"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/actions/auth";
import type { Role } from "@/lib/types";

type Item = { href: string; label: string };

export function DashboardNav({ role, email }: { role: Role; email: string }) {
  const pathname = usePathname();

  const items: Item[] = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/player", label: "My profile" },
  ];
  if (role === "organizer" || role === "admin") items.push({ href: "/dashboard/organizer", label: "My tournaments" });
  if (role === "admin") items.push({ href: "/dashboard/admin", label: "Approvals" });

  return (
    <aside className="side">
      <div style={{ padding: "6px 14px 14px" }}>
        <div className="kk" style={{ marginBottom: 2 }}>DASHBOARD</div>
        <div style={{ fontSize: 13, color: "var(--mute)", wordBreak: "break-all" }}>{email}</div>
      </div>
      {items.map((it) => (
        <Link key={it.href} href={it.href} className={pathname === it.href ? "on" : ""}>{it.label}</Link>
      ))}
      <form action={signOut} style={{ marginTop: 14 }}>
        <button className="submit" type="submit" style={{ width: "100%", background: "transparent", border: "1px solid var(--line)", color: "var(--mute)" }}>
          Sign out
        </button>
      </form>
    </aside>
  );
}
