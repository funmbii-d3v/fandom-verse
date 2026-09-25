import { useRef, useState } from "react";
import articles from "../data/articles.json";
import categories from "../data/categories.json";
import site from "../data/site.json";
import { useAppContext } from "../context/AppContext.jsx";
import useScrollReveal from "../hooks/useScrollReveal.js";
import { getCategoryName, matchesSearch } from "../utils/content.js";
import Card, { GradientThumb } from "./Card.jsx";
import SectionHeading from "./SectionHeading.jsx";
import { BookmarkIcon } from "./Icon.jsx";

export default function ArticleGrid() {
  const sectionRef = useRef(null);
  const [openNotes, setOpenNotes] = useState(() => new Set());
  const {
    activeCategory,
    searchQuery,
    bookmarks,
    bookmarkNotes,
    toggleBookmark,
    saveBookmarkNote,
  } = useAppContext();

  const visibleArticles = articles.filter((article) => {
    const matchesCategory = activeCategory === "all" || article.categoryId === activeCategory;
    return matchesCategory && matchesSearch(article, searchQuery);
  });
  const selectedCategory = categories.find((category) => category.id === activeCategory);
  const categoryName = selectedCategory?.name ?? "All";
  const revealKey = `${activeCategory}|${searchQuery}|${visibleArticles.map((article) => article.id).join(",")}`;

  useScrollReveal(sectionRef, revealKey);

  function toggleNote(articleId) {
    setOpenNotes((current) => {
      const next = new Set(current);
      if (next.has(articleId)) next.delete(articleId);
      else next.add(articleId);
      return next;
    });
  }

  return (
    <section className="content-section" id="articles" ref={sectionRef} aria-labelledby="articles-heading">
      <SectionHeading
        id="articles-heading"
        title={site.sections.articles}
        action={<a className="text-link" href="#articles">{site.actions.viewAll}</a>}
      />

      {visibleArticles.length ? (
        <div className="featured-grid">
          {visibleArticles.map((article) => {
            const saved = bookmarks.includes(article.id);
            const noteOpen = openNotes.has(article.id);
            return (
              <Card className="article-card filter-card" key={article.id} data-reveal>
                <GradientThumb image={article.image} gradient={article.gradient} className="article-thumb">
                  <button
                    className={`bookmark-toggle${saved ? " saved" : ""}`}
                    type="button"
                    onClick={() => toggleBookmark(article.id)}
                    aria-label={`${saved ? "Remove bookmark for" : "Bookmark"} ${article.title}`}
                    aria-pressed={saved}
                  >
                    <BookmarkIcon filled={saved} />
                  </button>
                </GradientThumb>
                <div className="card-body article-body">
                  <span className="category-chip">{getCategoryName(article.categoryId)}</span>
                  <h3>{article.title}</h3>
                  <div className="article-footer">
                    <small>{article.readTime}</small>
                    <button
                      className="note-toggle"
                      type="button"
                      onClick={() => toggleNote(article.id)}
                      disabled={!saved}
                      aria-expanded={noteOpen && saved}
                      aria-controls={`note-${article.id}`}
                      title={!saved ? "Bookmark this article to add a session note" : undefined}
                    >
                      {site.actions.note}
                    </button>
                  </div>
                  {saved && noteOpen ? (
                    <div className="note-panel" id={`note-${article.id}`}>
                      <label className="sr-only" htmlFor={`note-input-${article.id}`}>Session note for {article.title}</label>
                      <textarea
                        id={`note-input-${article.id}`}
                        rows="2"
                        value={bookmarkNotes[article.id] ?? ""}
                        onChange={(event) => saveBookmarkNote(article.id, event.target.value)}
                        placeholder="Add a private note for this session…"
                      />
                      <small>Notes are saved for this browser session.</small>
                    </div>
                  ) : null}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="empty-state filter-card" data-reveal role="status">
          {activeCategory !== "all" && !searchQuery.trim()
            ? `${site.emptyStates.articles} (${categoryName})`
            : site.emptyStates.articles}
        </div>
      )}
    </section>
  );
}