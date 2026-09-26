import { useMemo, useRef, useState } from "react";
import categories from "../data/categories.json";
import trailers from "../data/trailers.json";
import site from "../data/site.json";
import useScrollReveal from "../hooks/useScrollReveal.js";
import SectionHeading from "./SectionHeading.jsx";
import Card from "./Card.jsx";

const STATUS_OPTIONS = [
  { id: "all", label: "All" },
  { id: "upcoming", label: "Upcoming" },
  { id: "released", label: "Recently released" },
];

export default function TrailersSection() {
  const sectionRef = useRef(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [playingId, setPlayingId] = useState(null);

  const visible = useMemo(
    () =>
      trailers.filter((t) => {
        const matchesCategory = categoryFilter === "all" || t.categoryId === categoryFilter;
        const matchesStatus = statusFilter === "all" || t.status === statusFilter;
        return matchesCategory && matchesStatus;
      }),
    [categoryFilter, statusFilter],
  );

  const revealKey = `${categoryFilter}|${statusFilter}|${visible.map((t) => t.id).join(",")}`;
  useScrollReveal(sectionRef, revealKey);

  return (
    <section className="content-section" id="trailers-section" ref={sectionRef} aria-labelledby="trailers-heading">
      <SectionHeading id="trailers-heading" title={site.sections.trailers ?? "Trailers"} />

      <div className="trailer-filters">
        <select
          aria-label="Filter trailers by category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <div className="status-tabs" role="tablist" aria-label="Filter by release status">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              role="tab"
              aria-selected={statusFilter === opt.id}
              className={`status-tab${statusFilter === opt.id ? " active" : ""}`}
              onClick={() => setStatusFilter(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {visible.length ? (
        <div className="card-row" role="list" aria-label="Trailers">
          {visible.map((item) => {
            const isPlaying = playingId === item.id;
            return (
              <Card className="trailer-card" key={item.id} role="listitem">
                <div className="trailer-media">
                  {isPlaying ? (
                    <iframe
                      className="trailer-frame"
                      src={`https://www.youtube.com/embed/${item.youtubeId}?autoplay=1`}
                      title={item.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      <img src={item.image} alt={item.title} className="trailer-thumb" />
                      <button
                        className="play-button"
                        type="button"
                        onClick={() => setPlayingId(item.id)}
                        aria-label={`Play ${item.title}`}
                      >
                        <span aria-hidden="true">▶</span>
                      </button>
                    </>
                  )}
                </div>
                <div className="card-body">
                  <span className={`status-pill status-${item.status}`}>
                    {item.status === "upcoming" ? "Upcoming" : "Recently released"}
                  </span>
                  <h3>{item.title}</h3>
                  <p className="card-meta">{item.categoryId}</p>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="empty-state filter-card" role="status">No trailers match these filters yet.</div>
      )}
    </section>
  );
}