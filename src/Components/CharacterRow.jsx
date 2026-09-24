import { useRef } from "react";
import characters from "../data/characters.json";
import site from "../data/site.json";
import { useAppContext } from "../context/AppContext.jsx";
import useScrollReveal from "../hooks/useScrollReveal.js";
import { matchesSearch } from "../utils/content.js";
import SectionHeading from "./SectionHeading.jsx";

export default function CharacterRow() {
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
            <article className="character-tile" role="listitem" key={character.id} data-reveal>
              <span className="character-avatar" style={{ "--avatar-color": character.color }} aria-hidden="true">
                {character.emoji}
              </span>
              <strong>{character.name}</strong>
              <small>{character.series}</small>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state" data-reveal role="status">{site.emptyStates.characters}</div>
      )}
    </section>
  );
}
