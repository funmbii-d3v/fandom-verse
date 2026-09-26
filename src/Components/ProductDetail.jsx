import Modal from "./Modal.jsx";
import { useAppContext } from "../context/AppContext.jsx";
import { getCategoryName } from "../utils/content.js";

export default function ProductDetail({ product, onClose }) {
  const { addToCart } = useAppContext();
  if (!product) return null;

  return (
    <Modal isOpen={Boolean(product)} onClose={onClose} labelledBy="product-detail-title">
      <div
        className="detail-hero merch-detail-hero"
        style={{ "--art-gradient": `linear-gradient(135deg, ${product.gradient[0]}, ${product.gradient[1]})` }}
      >
        <img src={product.image} alt={product.name} className="detail-hero-image" />
      </div>

      <div className="detail-body">
        <span className="chip">{getCategoryName(product.categoryId)}</span>
        <h2 id="product-detail-title">{product.name}</h2>
        <p className="detail-price">{product.priceLabel}</p>
        <p className="detail-text">{product.description}</p>

        <button
          className="add-button detail-add-button"
          type="button"
          onClick={() => {
            addToCart(product.id);
            onClose();
          }}
        >
          Add to cart
        </button>
        <p className="cart-disclaimer">Demo cart only — no checkout or payment.</p>
      </div>
    </Modal>
  );
}