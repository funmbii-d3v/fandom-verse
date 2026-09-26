import { useRef, useState } from "react";
import characters from "../data/characters.json";
import site from "../data/site.json";
import { useAppContext } from "../context/AppContext.jsx";
import useScrollReveal from "../hooks/useScrollReveal.js";
import { matchesSearch } from "../utils/content.js";
import SectionHeading from "./SectionHeading.jsx";
import CharacterDetail from "./CharacterDetail.jsx";

export default function CharacterRow() {
  const [openCharacter, setOpenCharacter] = useState(null);
  const sectionRef = useRef(null);
  const { searchQuery } = useAppContext();
  const visibleCharacters = characters.filter((character) => matchesSearch(character, searchQuery));
  const revealKey = `${searchQuery}|${visibleCharacters.map((character) => character.id).join(",")}`;

  useScrollReveal(sectionRef, revealKey);

  return (
    <section className="content-section" id="characters" ref={sectionRef} aria-labelledby="characters-heading">
      <SectionHeading id="characters-heading" title={site.sections.characters} />
      {visibleCharacters.length ? (
        <div className="character-row" role="list" aria-label="Popular original characters">
          {visibleCharacters.map((character) => (
            <article
              className="character-tile"
              role="listitem"
              key={character.id}
              data-reveal
              onClick={() => setOpenCharacter(character)}
              style={{ cursor: "pointer" }}
            >
              <img className="character-avatar" src={character.image} alt={character.name} />
              <strong>{character.name}</strong>
              <small>{character.series}</small>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state" data-reveal role="status">{site.emptyStates.characters}</div>
      )}
      <CharacterDetail character={openCharacter} onClose={() => setOpenCharacter(null)} />
    </section>
  );
}