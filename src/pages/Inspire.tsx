import React, { useRef, useEffect } from "react";

export default function Inspire() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const wordRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    function onScroll() {
      const scrollTop = container!.scrollTop;
      const maxScroll = container!.scrollHeight - container!.clientHeight;
      const p = Math.min(1, Math.max(0, scrollTop / (maxScroll || 1)));

      // Phase 1 (p: 0 → 0.35): word scales large → normal size, shadow builds making it "appear"
      const p1 = Math.min(1, p / 0.35);
      const e1 = p1 * p1 * (3 - 2 * p1);

      // Phase 2 (p: 0.35 → 0.60): word scales down small
      const p2 = Math.min(1, Math.max(0, (p - 0.35) / 0.25));
      const e2 = p2 * p2 * (3 - 2 * p2);

      const scale = p < 0.35 ? (2.8 - e1 * 1.8) : (1 - e2 * 0.72);
      // shadow intensity: builds during phase 1, stays at max after
      const si = p < 0.35 ? e1 : 1;

      if (wordRef.current) {
        wordRef.current.style.transform = `scale(${scale})`;
        wordRef.current.style.textShadow = [
          `0 ${si * 22}px ${si * 50}px rgba(0,0,0,${si * 0.11})`,
          `0 ${si * 5}px ${si * 14}px rgba(0,0,0,${si * 0.09})`,
          `${si * 2}px ${si * 3}px ${si * 8}px rgba(160,160,160,${si * 0.35})`,
        ].join(", ");
      }

    }

    onScroll();
    container.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      container.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={scrollRef} className="inspire-scroll-outer">
      <div className="inspire-root">
        <div ref={wordRef} className="inspire-word">
          {"INSPIRE".split("").map((letter, i) => (
            <span key={i} className="inspire-letter">{letter}</span>
          ))}
        </div>
      </div>

      <style>{`
        .inspire-scroll-outer {
          height: 100vh;
          height: 100svh;
          overflow-y: scroll;
          position: relative;
          scrollbar-width: none;
        }

        .inspire-scroll-outer::-webkit-scrollbar {
          display: none;
        }

        .inspire-root {
          position: sticky;
          top: 0;
          height: 100vh;
          height: 100svh;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .inspire-word {
          font-size: clamp(3.5rem, 18vw, 15rem);
          font-weight: 900;
          color: #ffffff;
          letter-spacing: -0.04em;
          line-height: 1;
          user-select: none;
          white-space: nowrap;
          will-change: transform, text-shadow;
          transform-origin: center;
          text-shadow: none;
        }

        .inspire-letter {
          display: inline-block;
          transition: transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: default;
        }

        .inspire-letter:hover {
          transform: scale(1.45) translateY(-6%);
        }

      `}</style>

      {/* scroll spacer — gives the sticky scene room to animate */}
      <div style={{ height: "500vh" }} />
    </div>
  );
}
