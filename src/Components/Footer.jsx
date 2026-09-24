import { useEffect, useState } from "react";
import site from "../data/site.json";

function getCurrentVisitorCount() {
  const visitorKey = "fandomverse-visitors";
  const sessionKey = "fandomverse-visit-counted";

  try {
    if (!sessionStorage.getItem(sessionKey)) {
      const nextCount = (Number(localStorage.getItem(visitorKey)) || 12246) + 1;
      localStorage.setItem(visitorKey, String(nextCount));
      sessionStorage.setItem(sessionKey, "true");
    }
    return Number(localStorage.getItem(visitorKey)) || 12247;
  } catch {
    return 12247;
  }
}

function formatClock(date) {
  return date.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function Footer() {
  const [visitorCount, setVisitorCount] = useState(null);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    setVisitorCount(getCurrentVisitorCount());
    const intervalId = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  const visibleLinks = site.navigation.filter((link) => ["#home", "#articles", "#media", "#events", "#merch"].includes(link.href));

  return (
    <footer className="site-footer" id="about">
      <div className="footer-inner">
        <div className="footer-about">
          <a className="footer-brand" href="#home"><span aria-hidden="true">✦</span> {site.brand}</a>
          <p>{site.footer.about}</p>
        </div>

        <nav className="footer-links" aria-label={site.footer.quickLinks}>
          <strong>{site.footer.quickLinks}</strong>
          {visibleLinks.map((link) => <a href={link.href} key={link.href}>{link.label}</a>)}
          <a href={`mailto:${site.footer.contactEmail}`} id="contact">Contact</a>
        </nav>

        <div className="footer-status">
          <strong>{site.footer.visitors}</strong>
          <div className="visitor-counter" aria-label={`${visitorCount ?? "Loading"} visitors`}>
            {String(visitorCount ?? 12247).padStart(6, "0").split("").map((digit, index) => (
              <span key={`${digit}-${index}`}>{digit}</span>
            ))}
          </div>
          <time className="footer-clock" dateTime={now.toISOString()}>{formatClock(now)}</time>
        </div>
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} {site.brand} · Made for fandom discovery.</div>
    </footer>
  );
}
