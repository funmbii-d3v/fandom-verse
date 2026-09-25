import { useRef } from "react";
import categories from "../data/categories.json";
import trending from "../data/trending.json";
import site from "../data/site.json";
import { useAppContext } from "../context/AppContext.jsx";
import useScrollReveal from "../hooks/useScrollReveal.js";
import { getCategoryName, matchesSearch } from "../utils/content.js";
import Card, { GradientThumb } from "./Card.jsx";
import SectionHeading from "./SectionHeading.jsx";

export default function TrendingRow() {
  const sectionRef = useRef(null);
  const { activeCategory, searchQuery } = useAppContext();
  const visibleItems = trending.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.categoryId === activeCategory;
    return matchesCategory && matchesSearch(item, searchQuery);
  });
  const selectedCategory = categories.find((category) => category.id === activeCategory);
  const breadcrumb = selectedCategory && activeCategory !== "all"
    ? `Home › ${selectedCategory.name}`
    : "Home";
  const revealKey = `${activeCategory}|${searchQuery}|${visibleItems.map((item) => item.id).join(",")}`;

  useScrollReveal(sectionRef, revealKey);

  return (
    <section className="content-section" id="trending-section" ref={sectionRef} aria-labelledby="trending-heading">
      <SectionHeading
        id="trending-heading"
        title={site.sections.trending}
        breadcrumb={breadcrumb}
      />
      {visibleItems.length ? (
        <div className="card-row" role="list" aria-label="Trending fandoms">
          {visibleItems.map((item, index) => (
            <Card className="trending-card filter-card" key={item.id} role="listitem" data-reveal>
              <GradientThumb image={item.image} alt={item.title} gradient={item.gradient}>
                <span className="rank-badge">#{index + 1}</span>
              </GradientThumb>
              <div className="card-body">
                <h3>{item.title}</h3>
                <p className="card-meta">
                  <span>{getCategoryName(item.categoryId)}</span>
                  <span aria-label={`${item.rating.toFixed(1)} out of 5 stars`}><span aria-hidden="true">★</span> {item.rating.toFixed(1)}</span>
                </p>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="empty-state filter-card" data-reveal role="status">{site.emptyStates.trending}</div>
      )}
    </section>
  );
}
