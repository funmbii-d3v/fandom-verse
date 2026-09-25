import { useMemo, useRef, useState } from "react";
import media from "../data/media.json";
import site from "../data/site.json";
import { useAppContext } from "../context/AppContext.jsx";
import useScrollReveal from "../hooks/useScrollReveal.js";
import { getCategoryName, matchesSearch } from "../utils/content.js";
import Card, { GradientThumb } from "./Card.jsx";
import SectionHeading from "./SectionHeading.jsx";

export default function MediaHub() {
  const sectionRef = useRef(null);
  const [activeTab, setActiveTab] = useState(media.tabs[0].id);
  const [playingId, setPlayingId] = useState(null);
  const { searchQuery } = useAppContext();
  const visibleItems = useMemo(
    () => (media.items[activeTab] ?? []).filter((item) => matchesSearch(item, searchQuery)),
    [activeTab, searchQuery],
  );
  const revealKey = `${activeTab}|${searchQuery}|${visibleItems.map((item) => item.id).join(",")}`;

  useScrollReveal(sectionRef, revealKey);

  function handleTabKeyDown(event, currentIndex) {
    let nextIndex = currentIndex;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % media.tabs.length;
    else if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + media.tabs.length) % media.tabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = media.tabs.length - 1;
    else return;

    event.preventDefault();
    const nextTab = media.tabs[nextIndex];
    setActiveTab(nextTab.id);
    setPlayingId(null);
    sectionRef.current?.querySelector(`[data-media-tab="${nextTab.id}"]`)?.focus();
  }

  return (
    <section className="content-section" id="media-content" ref={sectionRef} aria-labelledby="media-heading">
      <SectionHeading
        id="media-heading"
        title={site.sections.media}
        action={<a className="text-link" href="#media">{site.actions.viewAll}</a>}
      />

      <div className="media-tabs" role="tablist" aria-label="Media type">
        {media.tabs.map((tab) => (
          <button
            className={`media-tab${activeTab === tab.id ? " active" : ""}`}
            type="button"
            role="tab"
            key={tab.id}
            data-media-tab={tab.id}
            tabIndex={activeTab === tab.id ? 0 : -1}
            aria-selected={activeTab === tab.id}
            aria-controls="media-card-list"
            onKeyDown={(event) => handleTabKeyDown(event, media.tabs.findIndex((item) => item.id === tab.id))}
            onClick={() => {
              setActiveTab(tab.id);
              setPlayingId(null);
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {visibleItems.length ? (
        <div className="card-row media-card-row" id="media-card-list" role="tabpanel" aria-label={media.tabs.find((tab) => tab.id === activeTab)?.label}>
          {visibleItems.map((item) => {
            const isPlaying = playingId === item.id;
            return (
              <Card className="media-card" key={item.id} data-reveal>
                <GradientThumb image={item.image} gradient={item.gradient} className="media-thumb">
                  {activeTab === "videos" && (
                  <button
                    className={`play-button${isPlaying ? " is-playing" : ""}`}
                    type="button"
                    onClick={() => setPlayingId((current) => current === item.id ? null : item.id)}
                    aria-label={`${isPlaying ? "Stop" : "Preview"} ${item.title}`}
                    aria-pressed={isPlaying}
                  >
                    <span aria-hidden="true">{isPlaying ? "Ⅱ" : "▶"}</span>
                  </button>
                )}
                </GradientThumb>
                <div className="card-body">
                  <h3>{item.title}</h3>
                  <small className="muted-text">{getCategoryName(item.categoryId)}{isPlaying ? " · Preview selected" : ""}</small>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="empty-state" id="media-card-list" role="tabpanel" aria-label={media.tabs.find((tab) => tab.id === activeTab)?.label} data-reveal>{site.emptyStates.media}</div>
      )}
    </section>
  );
}
