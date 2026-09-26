import Modal from "./Modal.jsx";
import { getCategoryName } from "../utils/content.js";

export default function CharacterDetail({ character, onClose }) {
  if (!character) return null;

  return (
    <Modal isOpen={Boolean(character)} onClose={onClose} labelledBy="character-detail-title">
      <div className="character-detail-head">
        <span
          className="character-detail-avatar"
          style={{ "--c": character.color }}
          aria-hidden="true"
        >
          {character.image ? <img src={character.image} alt="" /> : character.emoji}
        </span>
        <div>
          <span className="chip">{getCategoryName(character.categoryId)}</span>
          <h2 id="character-detail-title">{character.name}</h2>
          <p className="detail-meta">{character.series}</p>
        </div>
      </div>

      <div className="detail-body">
        <h3>Biography</h3>
        <p className="detail-text">{character.bio}</p>

        {character.traits?.length > 0 && (
          <>
            <h3>Traits</h3>
            <ul className="trait-list">
              {character.traits.map((trait) => (
                <li key={trait} className="chip">{trait}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </Modal>
  );
}