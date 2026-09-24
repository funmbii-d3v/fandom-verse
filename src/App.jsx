import { useEffect, useMemo, useState } from "react";
import categories from "./data/categories.json";
import merchandise from "./data/merchandise.json";
import { AppContext } from "./context/AppContext.jsx";
import Navbar from "./Components/Navbar.jsx";
import HeroSection from "./Components/Hero.jsx";
import CategoryPills from "./Components/CategoryPills.jsx";
import TrendingRow from "./Components/TrendingRow.jsx";
import ArticleGrid from "./Components/ArticleGrid.jsx";
import MediaHub from "./Components/MediaHub.jsx";
import CharacterRow from "./Components/CharacterRow.jsx";
import InfoPanels from "./Components/InfoPanels.jsx";
import MerchGrid from "./Components/MerchGrid.jsx";
import LazyMount from "./Components/LazyMount.jsx";
import Footer from "./Components/Footer.jsx";
import ChatBot from "./Components/Chatbot.jsx";
import "./styles/index.css"

function readJson(storage, key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = storage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarks, setBookmarks] = useState(() => {
    const stored = readJson(typeof window === "undefined" ? null : window.localStorage, "fandomverse-bookmarks", []);
    return Array.isArray(stored) ? stored : [];
  });
  const [bookmarkNotes, setBookmarkNotes] = useState(() => {
    const stored = readJson(typeof window === "undefined" ? null : window.sessionStorage, "fandomverse-bookmark-notes", {});
    return stored && typeof stored === "object" && !Array.isArray(stored) ? stored : {};
  });
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    try {
      window.localStorage.setItem("fandomverse-bookmarks", JSON.stringify(bookmarks));
    } catch {
      // Local storage may be unavailable in a private or restricted browsing context.
    }
  }, [bookmarks]);

  useEffect(() => {
    try {
      window.sessionStorage.setItem("fandomverse-bookmark-notes", JSON.stringify(bookmarkNotes));
    } catch {
      // Session storage may be unavailable in a private or restricted browsing context.
    }
  }, [bookmarkNotes]);

  const productMap = useMemo(() => new Map(merchandise.map((product) => [product.id, product])), []);
  const cartCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);
  const cartTotal = useMemo(() => cartItems.reduce((sum, item) => {
    const product = productMap.get(item.productId);
    return sum + (product ? product.cartPrice * item.quantity : 0);
  }, 0), [cartItems, productMap]);

  function toggleBookmark(articleId) {
    setBookmarks((current) => current.includes(articleId)
      ? current.filter((savedId) => savedId !== articleId)
      : [...current, articleId]);
  }

  function saveBookmarkNote(articleId, note) {
    setBookmarkNotes((current) => ({ ...current, [articleId]: note }));
  }

  function addToCart(productId) {
    if (!productMap.has(productId)) return;
    setCartItems((current) => {
      const existing = current.find((item) => item.productId === productId);
      if (existing) {
        return current.map((item) => item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item);
      }
      return [...current, { productId, quantity: 1 }];
    });
  }

  function removeFromCart(productId) {
    setCartItems((current) => current.filter((item) => item.productId !== productId));
  }

  const contextValue = useMemo(() => ({
    activeCategory,
    setActiveCategory: (categoryId) => {
      if (categories.some((category) => category.id === categoryId)) setActiveCategory(categoryId);
    },
    searchQuery,
    setSearchQuery: (value) => {
      setSearchQuery(value);
      if (String(value).trim()) setActiveCategory("all");
    },
    bookmarks,
    bookmarkNotes,
    toggleBookmark,
    saveBookmarkNote,
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
  }), [activeCategory, searchQuery, bookmarks, bookmarkNotes, cartItems, cartCount, cartTotal, productMap]);

  return (
    <AppContext.Provider value={contextValue}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <CategoryPills />
        <div className="page-wrap">
          <TrendingRow />
          <ArticleGrid />
          <LazyMount id="media" minHeight={430}>
            <MediaHub />
          </LazyMount>
          <LazyMount minHeight={300}>
            <CharacterRow />
          </LazyMount>
          <LazyMount id="events" minHeight={490}>
            <InfoPanels />
          </LazyMount>
          <LazyMount id="merch" minHeight={400}>
            <MerchGrid />
          </LazyMount>
        </div>
      </main>
      <Footer />
      <ChatBot />
    </AppContext.Provider>
  );
}