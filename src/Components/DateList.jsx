const MONTH_NUMBER = { Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06", Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12" };

export default function DateList({ items, emptyMessage }) {
  if (!items.length) return <p className="empty-list-message">{emptyMessage}</p>;

  return (
    <ul className="date-list">
      {items.map((item) => (
        <li className="date-list-item" key={item.id} data-reveal>
          <time className="date-badge" dateTime={`${new Date().getFullYear()}-${MONTH_NUMBER[item.month] ?? "01"}-${item.day}`}>
            <strong>{item.day}</strong>
            <span>{item.month}</span>
          </time>
          <div className="date-copy">
            <h3>{item.title}</h3>
            <small>{item.subtitle}</small>
          </div>
        </li>
      ))}
    </ul>
  );
}
