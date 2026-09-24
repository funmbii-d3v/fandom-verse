import { Search, Bookmark, ShoppingBag, Menu, X, Send } from "lucide-react";

export function SearchIcon(props) {
  return <Search size={20} strokeWidth={2} aria-hidden="true" {...props} />;
}

export function BookmarkIcon({ filled = false, ...props }) {
  return (
    <Bookmark
      size={20}
      strokeWidth={2}
      fill={filled ? "currentColor" : "none"}
      aria-hidden="true"
      {...props}
    />
  );
}

export function BagIcon(props) {
  return <ShoppingBag size={20} strokeWidth={2} aria-hidden="true" {...props} />;
}

export function MenuIcon({ open = false, ...props }) {
  const Icon = open ? X : Menu;
  return <Icon size={20} strokeWidth={2} aria-hidden="true" {...props} />;
}

export function SendIcon(props) {
  return <Send size={20} strokeWidth={2} aria-hidden="true" {...props} />;
}