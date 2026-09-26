import Modal from "./Modal.jsx";
import { getCategoryName } from "../utils/content.js";

export default function ArticleDetail({ article, related, onClose, onSelectRelated }) {
  if (!article) return null;

  return (
    <Modal isOpen={Boolean(article)} onClose={onClose} labelledBy="article-detail-title">
      <div className="detail-hero" style={{ "--art-gradient": `linear-gradient(135deg, ${article.gradient[0]}, ${article.gradient[1]})` }}>
        {article.image ? (
          <img src={article.image} alt="" className="detail-hero-image" />
        ) : (
          <span className="detail-hero-emoji" aria-hidden="true">{article.emoji}</span>
        )}
      </div>

      <div className="detail-body">
        <span className="chip">{getCategoryName(article.categoryId)}</span>
        <h2 id="article-detail-title">{article.title}</h2>
        <p className="detail-meta">{article.readTime}</p>
        <div className="detail-text">
          {(article.body ?? [article.excerpt]).map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {related?.length > 0 && (
          <div className="detail-related">
            <h3>Related content</h3>
            <div className="detail-related-row">
              {related.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="detail-related-card"
                  onClick={() => onSelectRelated(item)}
                >
                  <span
                    className="detail-related-thumb"
                    style={{ "--art-gradient": `linear-gradient(135deg, ${item.gradient[0]}, ${item.gradient[1]})` }}
                  >
                    {item.emoji}
                  </span>
                  <span>{item.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}