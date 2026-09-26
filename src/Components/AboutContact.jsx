import site from "../data/site.json";

export default function AboutContact() {
  return (
    <section className="about-contact" aria-label="About and contact">
      <div className="two-col-panels">
        <article className="panel about-panel" id="about" aria-labelledby="about-heading">
          <h2 id="about-heading">About FandomVerse</h2>
          <p>
            FandomVerse is a fan portal built to bring anime, gaming, movies, TV shows,
            K-Pop, comics and manga into one place. This project was built as a demo
            for TechWiz 7, with all content loaded from local JSON files and no backend.
          </p>
        </article>

        <article className="panel contact-panel" id="contact" aria-labelledby="contact-heading">
          <h2 id="contact-heading">Contact us</h2>
          <ul className="contact-list">
            <li><strong>Email:</strong> <a href="mailto:contact.fandomverse@gmail.com">contact.fandomverse@gmail.com</a></li>
            <li><strong>Location:</strong> Lagos, Nigeria</li>
            <li><strong>Team:</strong> {site.team ?? "The FandomVerse team"}</li>
          </ul>
        </article>
      </div>
    </section>
  );
}