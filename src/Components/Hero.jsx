import { useRef } from "react";
import site from "../data/site.json";
import { useAppContext } from "../context/AppContext.jsx";
import { gsap, useGSAP } from "../gsap.js";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion.js";

export default function HeroSection() {
  const heroRef = useRef(null);
  const floatTweenRef = useRef(null);
  const { searchQuery, setSearchQuery } = useAppContext();
  const prefersReducedMotion = usePrefersReducedMotion();
  const headlineWords = site.hero.headline.split(" ");

  useGSAP(
    (context, contextSafe) => {
      const root = heroRef.current;
      if (!root || prefersReducedMotion) return undefined;

      const words = gsap.utils.toArray(".hero-word", root);
      const subtitle = root.querySelector(".hero-subtitle");
      const search = root.querySelector(".hero-search");
      const stickers = gsap.utils.toArray(".sticker-float", root);

      const entrance = gsap.timeline();
      entrance
        .from(words, {
          y: 30,
          autoAlpha: 0,
          duration: 0.58,
          stagger: 0.055,
          ease: "back.out(1.55)",
        })
        .from(subtitle, { y: 16, autoAlpha: 0, duration: 0.42, ease: "back.out(1.4)" }, "-=0.2")
        .from(search, { y: 18, scale: 0.97, autoAlpha: 0, duration: 0.46, ease: "back.out(1.55)" }, "-=0.12")
        .from(stickers, {
          y: 18,
          scale: 0.82,
          autoAlpha: 0,
          duration: 0.44,
          stagger: 0.075,
          ease: "back.out(1.7)",
        }, "-=0.1");

      let floatTween = null;
      entrance.eventCallback("onComplete", contextSafe(() => {
        floatTween = gsap.to(stickers, {
          y: -5,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          stagger: 0.18,
          ease: "sine.inOut",
        });
        floatTweenRef.current = floatTween;
      }));

      return () => {
        entrance.kill();
        floatTween?.kill();
        floatTweenRef.current = null;
      };
    },
    { scope: heroRef, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  function handleSearch(event) {
    event.preventDefault();
    document.getElementById("trending-section")?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
  }

  return (
    <section className="hero" id="home" ref={heroRef} aria-labelledby="hero-title">
      <h1 className="hero-title" id="hero-title" aria-label={site.hero.headline}>
        {headlineWords.map((word, index) => (
          <span className="hero-word" key={`${word}-${index}`} aria-hidden="true">{word}{index < headlineWords.length - 1 ? " " : ""}</span>
        ))}
      </h1>
      <p className="hero-subtitle">{site.hero.subtitle}</p>

      <form className="hero-search" role="search" onSubmit={handleSearch}>
        <label className="sr-only" htmlFor="hero-search-input">Search FandomVerse</label>
        <input
          id="hero-search-input"
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={site.hero.searchPlaceholder}
        />
        <button className="hero-search-button" type="submit">{site.hero.searchButton}</button>
      </form>

      <div
        className="sticker-row"
        aria-hidden="true"
        onPointerEnter={() => floatTweenRef.current?.pause()}
        onPointerLeave={() => floatTweenRef.current?.resume()}
      >
        {site.hero.stickers.map((emoji, index) => (
          <span className="sticker-float" key={`${emoji}-${index}`}>
            <span className="sticker-tile">{emoji}</span>
          </span>
        ))}
      </div>
    </section>
  );
}
