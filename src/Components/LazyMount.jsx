import { useEffect, useRef, useState } from "react";

export default function LazyMount({ children, minHeight = 320, className = "", id }) {
  const hostRef = useRef(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    if (!("IntersectionObserver" in window)) {
      setShouldRender(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: "560px 0px" },
    );

    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={hostRef}
      id={id}
      className={`lazy-mount ${className}`.trim()}
      style={{ "--lazy-min-height": `${minHeight}px` }}
    >
      {shouldRender ? children : null}
    </div>
  );
}
