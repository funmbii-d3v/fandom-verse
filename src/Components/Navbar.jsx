import { useRef, useState } from "react";
import site from "../data/site.json";
import { useAppContext } from "../context/AppContext.jsx";
import { ScrollTrigger, gsap, useGSAP } from "../gsap.js";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion.js";
import CartPopover from "./CartPopover.jsx";
import SearchBar from "./SearchBar.jsx";
import { BagIcon, BookmarkIcon, MenuIcon, SearchIcon } from "./Icon.jsx";

export default function Navbar() {
  const navRef = useRef(null);
  const { bookmarks, cartCount } = useAppContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    (context, contextSafe) => {
      const nav = navRef.current;
      if (!nav) return undefined;

      gsap.set(nav, { backgroundColor: "transparent", color: "#fff", boxShadow: "none" });

      const applyNavState = contextSafe((solid) => {
        setIsScrolled(solid);
        const rootStyles = getComputedStyle(document.documentElement);
        const surface = rootStyles.getPropertyValue("--surface").trim();
        const text = rootStyles.getPropertyValue("--text").trim();

        gsap.to(nav, {
          backgroundColor: solid ? surface : "rgba(31, 18, 53, 0)",
          color: solid ? text : "#fff",
          boxShadow: solid ? "0 2px 16px rgba(31, 18, 53, 0.14)" : "0 0 0 rgba(0, 0, 0, 0)",
          duration: prefersReducedMotion ? 0 : 0.25,
          ease: "power2.out",
          overwrite: "auto",
        });
      });

      const trigger = ScrollTrigger.create({
        start: 40,
        end: 100000,
        onEnter: () => applyNavState(true),
        onLeaveBack: () => applyNavState(false),
      });

      if (window.scrollY > 40) applyNavState(true);
      return () => trigger.kill();
    },
    { scope: navRef, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  const closeMenu = () => setMenuOpen(false);
  const goToBookmarks = () => {
    closeMenu();
    document.getElementById("articles")?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
  };

  return (
    <>
      <header ref={navRef} className={`site-nav${isScrolled ? " scrolled" : ""}`}>
        <div className="nav-shell">
          <div className="nav-brand-area">
            <button
              className="icon-button burger-button"
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="primary-navigation"
            >
              <MenuIcon open={menuOpen} />
            </button>
            <a className="brand" href="#home" onClick={closeMenu} aria-label={`${site.brand} home`}>
              <span className="brand-mark" aria-hidden="true">✪</span>
              <span className="brand-name">{site.brand}</span>
            </a>
          </div>

          <nav
            className={`nav-links${menuOpen ? " open" : ""}`}
            id="primary-navigation"
            aria-label="Main navigation"
          >
            {site.navigation.map((link) => (
              <a href={link.href} key={link.href} onClick={closeMenu}>{link.label}</a>
            ))}
          </nav>

          <div className="nav-actions">
            <button
              className="icon-button"
              type="button"
              onClick={() => {
                setSearchOpen((current) => !current);
                setCartOpen(false);
                setMenuOpen(false);
              }}
              aria-label={searchOpen ? "Close search" : "Open global search"}
              aria-expanded={searchOpen}
              aria-controls="global-search-panel"
            >
              <SearchIcon />
            </button>
            <button
              className="icon-button badge-anchor"
              type="button"
              onClick={goToBookmarks}
              aria-label={`Go to bookmarks, ${bookmarks.length} saved`}
            >
              <BookmarkIcon />
              <span className="count-badge" aria-hidden="true">{bookmarks.length}</span>
            </button>
            <div className="cart-anchor">
              <button
                className="icon-button badge-anchor"
                type="button"
                onClick={() => {
                  setCartOpen((current) => !current);
                  setSearchOpen(false);
                }}
                aria-label={`Open cart, ${cartCount} items`}
                aria-expanded={cartOpen}
                aria-controls="cart-summary"
              >
                <BagIcon />
                <span className="count-badge" aria-hidden="true">{cartCount}</span>
              </button>
              <CartPopover open={cartOpen} onClose={() => setCartOpen(false)} />
            </div>
          </div>
        </div>
      </header>
      <SearchBar open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}