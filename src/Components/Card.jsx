export default function Card({ as: Element = "article", className = "", children, ...props }) {
  return (
    <Element className={`comic-card ${className}`.trim()} {...props}>
      {children}
    </Element>
  );
}

export function GradientThumb({ image, alt = "", emoji, gradient = ["#7c3aed", "#ff3d8b"], className = "", children }) {
  const [start, end] = gradient;
  return (
    <div
      className={`gradient-thumb ${className}`.trim()}
      style={{ "--art-gradient": `linear-gradient(135deg, ${start}, ${end})` }}
    >
      {image ? (
        <img src={image} alt={alt} loading="lazy" className="thumb-image" />
      ) : emoji ? (
        <span className="thumb-emoji" aria-hidden="true">{emoji}</span>
      ) : null}
      {children}
    </div>
  );
}