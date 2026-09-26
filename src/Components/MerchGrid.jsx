import { useRef, useState } from "react";
import merchandise from "../data/merchandise.json";
import site from "../data/site.json";
import { useAppContext } from "../context/AppContext.jsx";
import useScrollReveal from "../hooks/useScrollReveal.js";
import { matchesSearch } from "../utils/content.js";
import Card, { GradientThumb } from "./Card.jsx";
import SectionHeading from "./SectionHeading.jsx";
import ProductDetail from "./ProductDetail.jsx";

export default function MerchGrid() {
  const sectionRef = useRef(null);
  const [openProduct, setOpenProduct] = useState(null);
  const { searchQuery, addToCart } = useAppContext();
  const visibleProducts = merchandise.filter((product) => matchesSearch(product, searchQuery));
  const revealKey = `${searchQuery}|${visibleProducts.map((product) => product.id).join(",")}`;

  useScrollReveal(sectionRef, revealKey);

  return (
    <section className="content-section" id="merch-content" ref={sectionRef} aria-labelledby="merch-heading">
      <SectionHeading
        id="merch-heading"
        title={site.sections.merchandise}
        action={<a className="text-link" href="#merch">{site.actions.viewAll}</a>}
      />
      {visibleProducts.length ? (
        <div className="card-row merch-row" role="list" aria-label="Featured merchandise">
          {visibleProducts.map((product) => (
            <Card
              className="merch-card"
              key={product.id}
              role="listitem"
              data-reveal
              onClick={() => setOpenProduct(product)}
              style={{ cursor: "pointer" }}
            >
              <GradientThumb image={product.image} gradient={product.gradient} className="merch-thumb" />
              <div className="card-body">
                <h3>{product.name}</h3>
                <div className="price-row">
                  <small>{product.priceLabel}</small>
                  <button
                    className="add-button"
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      addToCart(product.id);
                    }}
                  >
                    {site.actions.add}
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="empty-state" data-reveal role="status">{site.emptyStates.merchandise}</div>
      )}
      <ProductDetail product={openProduct} onClose={() => setOpenProduct(null)} />
    </section>
  );
}