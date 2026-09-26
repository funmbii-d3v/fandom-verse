import { useState } from "react";
import site from "../data/site.json";
import Modal from "./Modal"; // adjust path if needed

export default function AboutContact() {
  const [teamOpen, setTeamOpen] = useState(false);
  const teamName = site.team ?? "The FandomVerse team";
  const members = site.members ?? [];
  const email= site.email ?? [];
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
            <li>
              <strong>Email:</strong>{" "}
              <a href="mailto:contact.fandomverse@gmail.com">
                contact.fandomverse@gmail.com
              </a>
            </li>
            <li>
              <strong>Location:</strong>{" "}
              <a href="https://maps.app.goo.gl/RhXfyFfbbiMTMmqq5" target="0">Lagos, Nigeria</a>
            </li>
            <li>
              <strong>Team:</strong>{" "}
              <button
                type="button"
                className="team-name-btn"
                onClick={() => setTeamOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={teamOpen}
              >
                {teamName}
              </button>
            </li>
          </ul>
        </article>
      </div>

      <Modal
        isOpen={teamOpen}
        onClose={() => setTeamOpen(false)}
        labelledBy="team-modal-heading"
      >
        <h2 id="team-modal-heading" className="team-modal-title">
          {teamName}
        </h2>
        <p className="team-modal-subtitle">Project team · TechWiz 7</p>

        <div className="team-cards">
          {members.map((member) => (
            <article key={member.studentID} className="team-card">
              <div className="team-card-avatar" aria-hidden="true">
                {member.name.charAt(0)}
              </div>
              <div className="team-card-body">
                <h3 className="team-card-name">{member.name}</h3>
                <p className="team-card-id">{member.studentID}</p>
                <p className="team-card-id">{member.email}</p>
              </div>
            </article>
          ))}
        </div>
      </Modal>
    </section>
  );
}