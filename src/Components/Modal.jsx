import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { gsap, useGSAP } from "../gsap.js";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion.js";

export default function Modal({ isOpen, onClose, labelledBy, children }) {
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (!isOpen || prefersReducedMotion) return undefined;
      const tl = gsap.timeline();
      tl.fromTo(overlayRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 })
        .fromTo(
          panelRef.current,
          { autoAlpha: 0, y: 24, scale: 0.96 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.32, ease: "back.out(1.5)" },
          "-=0.1",
        );
      return () => tl.kill();
    },
    { dependencies: [isOpen, prefersReducedMotion] },
  );

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      ref={overlayRef}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="modal-panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
      >
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close">
          <X size={20} aria-hidden="true" />
        </button>
        {children}
      </div>
    </div>
  );
}