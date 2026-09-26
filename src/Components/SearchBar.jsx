import { useEffect, useRef } from "react";
import site from "../data/site.json";
import { useAppContext } from "../context/AppContext.jsx";
import { gsap, useGSAP } from "../gsap.js";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion.js";
import { SearchIcon, MenuIcon } from "./Icon.jsx";

export default function SearchBar({ open, onClose }) {
  const shellRef = useRef(null);
  const inputRef = useRef(null);
  const timelineRef = useRef(null);
  const { searchQuery, setSearchQuery } = useAppContext();
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) return undefined;

      const timeline = gsap.timeline({ paused: true });
      timeline.fromTo(
        shellRef.current,
        { height: 0, autoAlpha: 0, y: -8 },
        { height: "auto", autoAlpha: 1, y: 0, duration: 0.26, ease: "power2.out" },
      );
      timelineRef.current = timeline;

      return () => {
        timeline.kill();
        timelineRef.current = null;
      };
    },
    { scope: shellRef, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timeline = timelineRef.current;
    if (!timeline) return;
    if (open) timeline.play();
    else timeline.reverse();
  }, [open, prefersReducedMotion]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  return (
    <div
      ref={shellRef}
      id="global-search-panel"
      className={`searchbar-shell${open ? " is-open" : ""}${prefersReducedMotion ? " reduced-motion" : ""}`}
      aria-hidden={!open}
    >
      <div className="searchbar-inner">
        <form className="global-search-form" role="search" onSubmit={(event) => event.preventDefault()}>
          <SearchIcon />
          <label className="sr-only" htmlFor="global-search">
            Search every fandom and content type
          </label>
          <input
            ref={inputRef}
            id="global-search"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={site.search.globalPlaceholder}
            tabIndex={open ? 0 : -1}
          />
          {searchQuery ? (
            <button
              className="search-clear-button"
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label={site.actions.clearSearch}
              tabIndex={open ? 0 : -1}
            >
              <span aria-hidden="true"></span>
            </button>
          ) : null}
          <button className="search-close-button" type="button" onClick={onClose} tabIndex={open ? 0 : -1}>
            <MenuIcon open />
            <span className="sr-only">{site.actions.close} search</span>
          </button>
        </form>
        <p>{site.search.helper}</p>
      </div>
    </div>
  );
}
