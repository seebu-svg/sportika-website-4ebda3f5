import Link from "next/link";

export default function NotFound() {
  return (
    <section className="hero" style={{ minHeight: "70vh", display: "flex", alignItems: "center" }}>
      <div className="wrap" style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "80px 24px" }}>
        <div className="eb" style={{ justifyContent: "center", display: "inline-flex" }}>404</div>
        <h1 style={{ margin: "18px 0 10px" }}>Page <em>not found</em></h1>
        <p className="lead" style={{ margin: "0 auto 24px" }}>That link doesn't exist. Let's get you back to the game.</p>
        <div className="acts" style={{ justifyContent: "center" }}>
          <Link className="p" href="/">Back to home</Link>
          <Link className="g" href="/tournaments">Browse tournaments</Link>
        </div>
      </div>
    </section>
  );
}
