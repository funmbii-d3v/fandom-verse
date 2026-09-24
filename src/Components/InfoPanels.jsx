import { useRef } from "react";
import events from "../data/events.json";
import releases from "../data/releases.json";
import site from "../data/site.json";
import { useAppContext } from "../context/AppContext.jsx";
import useScrollReveal from "../hooks/useScrollReveal.js";
import { matchesSearch } from "../utils/content.js";
import DateList from "./DateList.jsx";
import SectionHeading from "./SectionHeading.jsx";

export default function InfoPanels() {
  const sectionRef = useRef(null);
  const { searchQuery } = useAppContext();
  const visibleReleases = releases.filter((release) => matchesSearch(release, searchQuery));
  const visibleEvents = events.filter((event) => matchesSearch(event, searchQuery));
  const revealKey = `${searchQuery}|${visibleReleases.map((item) => item.id).join(",")}|${visibleEvents.map((item) => item.id).join(",")}`;

  useScrollReveal(sectionRef, revealKey);

  return (
    <section className="content-section info-section" id="event-panels" ref={sectionRef} aria-label="Upcoming releases and event highlights">
      <div className="info-grid">
        <article className="info-panel" aria-labelledby="releases-heading" data-reveal>
          <SectionHeading id="releases-heading" title={site.sections.releases} />
          <DateList items={visibleReleases} emptyMessage={site.emptyStates.releases} />
        </article>
        <article className="info-panel" aria-labelledby="events-heading" data-reveal>
          <SectionHeading id="events-heading" title={site.sections.events} />
          <DateList items={visibleEvents} emptyMessage={site.emptyStates.events} />
        </article>
      </div>
    </section>
  );
}
