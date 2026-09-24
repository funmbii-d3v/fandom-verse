import merchandise from "../data/merchandise.json";
import site from "../data/site.json";
import { useAppContext } from "../context/AppContext.jsx";
import { formatMoney } from "../utils/content.js";

export default function CartPopover({ open, onClose }) {
  const { cartItems, removeFromCart, cartTotal } = useAppContext();
  const productsById = new Map(merchandise.map((product) => [product.id, product]));
  const visibleItems = cartItems
    .map((item) => ({ ...item, product: productsById.get(item.productId) }))
    .filter((item) => item.product);

  return (
    <div className="cart-popover" id="cart-summary" role="dialog" aria-label={site.cart.title} aria-hidden={!open} hidden={!open}>
      <div className="cart-popover-heading">
        <h2>{site.cart.title}</h2>
        <button className="text-icon-button" type="button" onClick={onClose} aria-label={`${site.actions.close} cart`}>
          <span aria-hidden="true">×</span>
        </button>
      </div>

      {visibleItems.length ? (
        <ul className="cart-line-items">
          {visibleItems.map(({ product, quantity }) => (
            <li className="cart-line-item" key={product.id}>
              <span className="cart-product-emoji" aria-hidden="true">{product.emoji}</span>
              <span className="cart-product-copy">
                <strong>{product.name}</strong>
                <small>{quantity} × {formatMoney(product.cartPrice)}</small>
              </span>
              <span className="cart-line-price">{formatMoney(product.cartPrice * quantity)}</span>
              <button
                className="cart-remove-button"
                type="button"
                onClick={() => removeFromCart(product.id)}
                aria-label={`${site.actions.remove} ${product.name} from cart`}
              >
                {site.actions.remove}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="cart-empty">{site.cart.empty}</p>
      )}

      <div className="cart-total-row">
        <strong>{site.cart.total}</strong>
        <strong>{formatMoney(cartTotal)}</strong>
      </div>
      <p className="cart-disclaimer">{site.cart.disclaimer}</p>
    </div>
  );
}
