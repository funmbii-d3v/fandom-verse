import { useRef, useState, useEffect} from "react";
import categories from "../data/categories.json";
import { useAppContext } from "../context/AppContext.jsx";
import { gsap, useGSAP } from "../gsap.js";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion.js";

export default function CategoryPills({scrolled}) {
  const pillsRef = useRef(null);
  const { activeCategory, setActiveCategory } = useAppContext();
  const prefersReducedMotion = usePrefersReducedMotion();
  const { contextSafe } = useGSAP(() => {}, { scope: pillsRef });

  const selectCategory = contextSafe((categoryId) => {
    if (categoryId === activeCategory) return;
    const currentCards = gsap.utils.toArray(".filter-card");

    if (prefersReducedMotion || currentCards.length === 0) {
      setActiveCategory(categoryId);
      return;
    }

    gsap.killTweensOf(currentCards);
    gsap.to(currentCards, {
      autoAlpha: 0,
      y: 20,
      duration: 0.2,
      stagger: 0.025,
      ease: "power1.in",
      overwrite: "auto",
      onComplete: () => setActiveCategory(categoryId),
    });
  });

  function handleTabKeyDown(event, currentIndex) {
    let nextIndex = currentIndex;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % categories.length;
    else if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + categories.length) % categories.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = categories.length - 1;
    else return;

    event.preventDefault();
    const nextCategory = categories[nextIndex];
    pillsRef.current?.querySelector(`[data-category-id="${nextCategory.id}"]`)?.focus();
    selectCategory(nextCategory.id);
  }
  
  return (
        <div className={`category-sticky-wrap ${scrolled ? 'scrolled' : ''}`}>
        <div className="category-capsule" role="tablist" aria-label="Browse fandom categories">
        {categories.map((category, index) => {
          const active = activeCategory === category.id;
          return (
            <button
              className={`category-pill${active ? " active" : ""}`}
              key={category.id}
              data-category-id={category.id}
              type="button"
              role="tab"
              tabIndex={active ? 0 : -1}
              aria-selected={active}
              aria-controls="trending-section articles"
              onKeyDown={(event) => handleTabKeyDown(event, index)}
              onClick={() => selectCategory(category.id)}
              style={{ "--category-color": category.color }}
            >
              <span className="category-icon-tile" aria-hidden="true">{category.emoji}</span>
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}