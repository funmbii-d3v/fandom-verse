export default function SectionHeading({ title, breadcrumb, action, id }) {
  return (
    <div className="section-heading" data-reveal>
      <h2 id={id}>{title}</h2>
      {breadcrumb ? <span className="breadcrumb">{breadcrumb}</span> : null}
      {action ? <div className="section-action">{action}</div> : null}
    </div>
  );
}
