import React, { useMemo, useState, useRef, useEffect } from "react";

type Star = {
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
  dur: number;
};

function makeStars(count: number, sizeRange: [number, number], opacityRange: [number, number], durRange: [number, number]) {
  return Array.from({ length: count }).map<Star>(() => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0],
    opacity: Math.random() * (opacityRange[1] - opacityRange[0]) + opacityRange[0],
    delay: Math.random() * 5,
    dur: Math.random() * (durRange[1] - durRange[0]) + durRange[0],
  }));
}

export default function Moon() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const wordRowRef = useRef<HTMLDivElement | null>(null);
  const moonParallaxRef = useRef<HTMLDivElement | null>(null);
  const moonGlowRef = useRef<HTMLDivElement | null>(null);
  const leftLetterRef = useRef<HTMLSpanElement | null>(null);
  const rightLetterRef = useRef<HTMLSpanElement | null>(null);
  const moonRiseRef = useRef<HTMLDivElement | null>(null);
  const starLayer1Ref = useRef<HTMLDivElement | null>(null);
  const starLayer2Ref = useRef<HTMLDivElement | null>(null);
  const starLayer3Ref = useRef<HTMLDivElement | null>(null);
  const poemRef = useRef<HTMLDivElement | null>(null);
  const [starOffset, setStarOffset] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [zoomScale, setZoomScale] = useState(1);
  const [layer1, setLayer1] = useState<Star[]>(() => makeStars(90, [0.5, 1.0], [0.5, 0.95], [2, 5]));
  const [layer2, setLayer2] = useState<Star[]>(() => makeStars(54, [0.8, 1.4], [0.35, 0.85], [4, 8]));
  const [layer3, setLayer3] = useState<Star[]>(() => makeStars(24, [1.0, 1.8], [0.25, 0.7], [6, 12]));
  const [imgLoaded, setImgLoaded] = useState(true);

  useEffect(() => {
    function updateLayers() {
      const w = window.innerWidth;
      const densityMultiplier = w >= 900 ? 1.5 : 1;
      const viewportScale = window.visualViewport?.scale ?? window.devicePixelRatio ?? 1;
      const zoomAdjustment = Math.min(1, 1 / Math.max(1, viewportScale));
      setZoomScale(zoomAdjustment);

      setLayer1(makeStars(Math.round(90 * densityMultiplier), [0.5, 1.0], [0.5, 0.95], [2, 5]));
      setLayer2(makeStars(Math.round(54 * densityMultiplier), [0.8, 1.4], [0.35, 0.85], [4, 8]));
      setLayer3(makeStars(Math.round(24 * densityMultiplier), [1.0, 1.8], [0.25, 0.7], [6, 12]));
    }

    updateLayers();
    window.addEventListener("resize", updateLayers);
    window.addEventListener("visibilitychange", updateLayers);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", updateLayers);
      window.visualViewport.addEventListener("scroll", updateLayers);
    }

    return () => {
      window.removeEventListener("resize", updateLayers);
      window.removeEventListener("visibilitychange", updateLayers);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", updateLayers);
        window.visualViewport.removeEventListener("scroll", updateLayers);
      }
    };
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    function onScroll() {
      const scrollTop = container!.scrollTop;
      const maxScroll = container!.scrollHeight - container!.clientHeight;
      const p = Math.min(1, Math.max(0, scrollTop / (maxScroll || 1)));
      const vw = window.innerWidth / 100;
      const vmin = Math.min(window.innerWidth, window.innerHeight) / 100;

      // Phase 1 (p: 0 → 0.20): moon fills screen → MOON word forms
      const p1 = Math.min(1, p / 0.20);
      const e1 = p1 * p1 * (3 - 2 * p1);
      const moonTargetVw = window.innerWidth < 640 ? 44 : 30;
      const moonSize = 92 * vmin * (1 - e1) + moonTargetVw * vw * e1;
      if (moonParallaxRef.current) {
        moonParallaxRef.current.style.width = `${moonSize}px`;
        moonParallaxRef.current.style.height = `${moonSize}px`;
      }
      const fontSize = moonTargetVw * vw * e1;
      if (leftLetterRef.current) {
        leftLetterRef.current.style.opacity = String(e1);
        leftLetterRef.current.style.fontSize = `${fontSize}px`;
      }
      if (rightLetterRef.current) {
        rightLetterRef.current.style.opacity = String(e1);
        rightLetterRef.current.style.fontSize = `${fontSize}px`;
      }

      // Phase 2 (p: 0.20 → 0.40): entire word shrinks 5×
      const p2 = Math.min(1, Math.max(0, (p - 0.20) / 0.20));
      const e2 = p2 * p2 * (3 - 2 * p2);
      const scaleAfterP2 = 1 - e2 * 0.8; // 1 → 0.2

      // Phase 3 (p: 0.40 → 0.60): letters stay white; white radial glow blooms behind moon
      const p3 = Math.min(1, Math.max(0, (p - 0.40) / 0.20));
      const e3 = p3 * p3 * (3 - 2 * p3);
      if (leftLetterRef.current) {
        leftLetterRef.current.style.color = `rgba(255,255,255,1)`;
        leftLetterRef.current.style.textShadow = `0 4px 40px rgba(255,255,255,${e3 * 0.8})`;
      }
      if (rightLetterRef.current) {
        rightLetterRef.current.style.color = `rgba(255,255,255,1)`;
        rightLetterRef.current.style.textShadow = `0 4px 40px rgba(255,255,255,${e3 * 0.8})`;
      }
      if (moonGlowRef.current) {
        moonGlowRef.current.style.opacity = String(e3);
        moonGlowRef.current.style.transform = `scale(${1 + e3 * 0.25})`;
      }

      if (wordRowRef.current) {
        wordRowRef.current.style.transform = `scale(${scaleAfterP2})`;
        wordRowRef.current.style.opacity = '1';
      }

      // Phase 4 (p: 0.60 → 1.0): moon rises a little, then poem fades in line by line
      const p4 = Math.min(1, Math.max(0, (p - 0.60) / 0.40));
      const e4 = p4 * p4 * (3 - 2 * p4);
      // Rise: saturates after first 25% of phase 4, small offset
      const rp = Math.min(1, p4 / 0.25);
      const e4rise = rp * rp * (3 - 2 * rp);
      if (moonRiseRef.current) {
        moonRiseRef.current.style.transform = `translateY(-${e4rise * 18}vh)`;
      }
      // Star parallax — continues throughout all of phase 4
      if (starLayer3Ref.current) starLayer3Ref.current.style.transform = `translateY(-${e4 * 8}vh)`;
      if (starLayer2Ref.current) starLayer2Ref.current.style.transform = `translateY(-${e4 * 14}vh)`;
      if (starLayer1Ref.current) starLayer1Ref.current.style.transform = `translateY(-${e4 * 22}vh)`;
      // Poem: starts after the rise has mostly settled (p4 > 0.20)
      if (poemRef.current) {
        const lines = poemRef.current.children;
        const poemStart = 0.22;
        const lineDelay = 0.08;
        const lineDuration = 0.12;
        for (let i = 0; i < lines.length; i++) {
          const lp = Math.min(1, Math.max(0, (p4 - poemStart - i * lineDelay) / lineDuration));
          const le = lp * lp * (3 - 2 * lp);
          const el = lines[i] as HTMLElement;
          if (el.classList.contains('moon-poem-spacer')) continue;
          if (el.classList.contains('moon-poem-rule')) {
            const ruleP = Math.min(1, Math.max(0, (p4 - 0.90) / 0.10));
            const ruleE = ruleP * ruleP * (3 - 2 * ruleP);
            el.style.transform = `scaleX(${ruleE})`;
            el.style.opacity = String(ruleE);
            continue;
          }
          el.style.opacity = String(le);
          el.style.transform = `translateY(${(1 - le) * 12}px)`;
        }
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

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!rootRef.current) return;
    const rect = rootRef.current.getBoundingClientRect();
    const x = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
    const y = (event.clientY - (rect.top + rect.height / 2)) / rect.height;
    setStarOffset({ x: x * 16, y: y * 12 });
    setTilt({ x: Math.max(-14, Math.min(14, -x * 14)), y: Math.max(-14, Math.min(14, y * 14)) });
  }

  function handlePointerLeave() {
    setStarOffset({ x: 0, y: 0 });
    setTilt({ x: 0, y: 0 });
  }

  const scaleStar = (size: number) => Math.max(0.45, Math.min(2, size * zoomScale));
  const starDims = (size: number) => {
    const scaled = scaleStar(size);
    return { width: `${scaled}px`, height: `${scaled}px`, maxWidth: "2.5px", maxHeight: "2.5px" };
  };

  function ImageOrFallback({ srcOverride }: { srcOverride?: string }) {
    const src = srcOverride ?? "/img/moon.png";
    return imgLoaded ? (
      <div className="moon-image-wrapper relative">
        <img
          src={src}
          alt="Moon"
          className="object-cover rounded-full shadow-2xl relative z-10"
          onError={() => setImgLoaded(false)}
          onLoad={() => setImgLoaded(true)}
        />
        <div className="moon-shadow-fade absolute inset-0 z-0" />
      </div>
    ) : (
      <div className="moon relative">
        <div className="terminator absolute inset-0 rounded-full pointer-events-none" />
        <div className="moon-shadow-fade absolute inset-0 rounded-full pointer-events-none" />

        {/* Craters with subtle inset shadows for depth */}
        <div className="crater c1" />
        <div className="crater c2" />
        <div className="crater c3" />
        <div className="crater c4" />
        <div className="crater c5" />
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="moon-scroll-outer">
      <div
        ref={rootRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="moon-root w-full bg-gradient-to-b from-slate-950 via-slate-900 to-black flex items-center justify-center overflow-hidden relative"
        style={{ perspective: 950 }}
      >
      {/* Layered starfields for depth */}
        <div className="absolute inset-0 pointer-events-none">
          <div ref={starLayer3Ref} className="absolute inset-0" style={{ willChange: "transform" }}>
            {layer3.map((s, i) => (
              <div
                key={`l3-${i}`}
                className="absolute rounded-full bg-white"
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  ...starDims(s.size),
                  opacity: s.opacity,
                  transform: `translate(calc(-50% + ${starOffset.x * 0.15}px), calc(-50% + ${starOffset.y * 0.15}px))`,
                  animation: `twinkle ${s.dur}s ${s.delay}s infinite ease-in-out, drift-slow ${20 + (i % 5)}s ${i % 3}s infinite linear`,
                }}
              />
            ))}
          </div>

          <div ref={starLayer2Ref} className="absolute inset-0" style={{ willChange: "transform" }}>
            {layer2.map((s, i) => (
              <div
                key={`l2-${i}`}
                className="absolute rounded-full bg-white"
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  ...starDims(s.size),
                  opacity: s.opacity,
                  transform: `translate(calc(-50% + ${starOffset.x * 0.25}px), calc(-50% + ${starOffset.y * 0.25}px))`,
                  animation: `twinkle ${s.dur}s ${s.delay}s infinite ease-in-out, drift ${18 + (i % 6)}s ${i % 4}s infinite linear`,
                }}
              />
            ))}
          </div>

          <div ref={starLayer1Ref} className="absolute inset-0" style={{ willChange: "transform" }}>
            {layer1.map((s, i) => (
              <div
                key={`l1-${i}`}
                className="absolute rounded-full bg-white"
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  ...starDims(s.size),
                  opacity: s.opacity,
                  filter: "blur(0.2px)",
                  transform: `translate(calc(-50% + ${starOffset.x * 0.35}px), calc(-50% + ${starOffset.y * 0.35}px))`,
                  animation: `twinkle ${s.dur}s ${s.delay}s infinite ease-in-out, drift-fast ${14 + (i % 4)}s ${i % 2}s infinite linear`,
                }}
              />
            ))}
          </div>
        </div>

        {/* MO[moon]N + poem — rise together in Phase 4 */}
        <div ref={moonRiseRef} className="moon-rise-wrap" style={{ willChange: "transform" }}>
          <div ref={wordRowRef} className="moon-word-row relative z-10" style={{ willChange: "transform, opacity" }}>
            <span ref={leftLetterRef} className="moon-letter moon-letter-left">MO</span>
            <div
              ref={moonParallaxRef}
              className="moon-parallax-wrap"
              style={{
                transform: `perspective(900px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
                transition: "transform 180ms ease-out",
              }}
            >
              <div ref={moonGlowRef} className="moon-glow" />
              <ImageOrFallback srcOverride="/img/blog/moon.png" />
            </div>
            <span ref={rightLetterRef} className="moon-letter moon-letter-right">N</span>
          </div>

          {/* Poem — fades in line by line in Phase 4, rises with moon */}
          <div ref={poemRef} className="moon-poem">
            <div className="moon-poem-line">The moon is quiet, soft, and true,</div>
            <div className="moon-poem-line">A gentle light the whole night knew.</div>
            <div className="moon-poem-line">Perhaps that's why I pause above—</div>
            <div className="moon-poem-line">It always reminds me a little of you.</div>
            <div className="moon-poem-spacer" />
            <div className="moon-poem-line">The moon was never made to blaze,</div>
            <div className="moon-poem-line">But softly steals the darkest gaze.</div>
            <div className="moon-poem-line">Perhaps that's why it feels so true—</div>
            <div className="moon-poem-line">It shines the way I think of you.</div>
            <div className="moon-poem-rule" />
          </div>
        </div>

      <style>{`
        .moon-scroll-outer {
          height: 100vh;
          height: 100svh;
          overflow-y: scroll;
          position: relative;
          scrollbar-width: none;
        }

        .moon-scroll-outer::-webkit-scrollbar {
          display: none;
        }

        .moon-root {
          position: sticky;
          top: 0;
          height: 100vh;
          height: 100svh;
        }

        .moon-word-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
        }

        .moon-parallax-wrap {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          position: relative;
          /* default size before JS kicks in — keeps moon centered on load */
          width: 92vmin;
          height: 92vmin;
        }

        .moon-glow {
          position: absolute;
          inset: -18%;
          border-radius: 9999px;
          background: radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(220,230,255,0.2) 45%, transparent 72%);
          filter: blur(32px);
          opacity: 0;
          pointer-events: none;
          will-change: opacity, transform;
          z-index: 0;
        }

        .moon-letter {
          /* start invisible and zero-size so they take no space on load */
          font-size: 0;
          opacity: 0;
          font-weight: 900;
          color: rgba(255,255,255,0.95);
          line-height: 0.72;
          letter-spacing: -0.03em;
          text-shadow: 0 4px 40px rgba(0,0,0,0.55);
          user-select: none;
          white-space: nowrap;
          overflow: visible;
          will-change: font-size, opacity;
        }

        .moon {
          width: 100%;
          height: 100%;
          border-radius: 9999px;
          background: radial-gradient(circle at 30% 25%, #f7f7f2 0%, #e6e6de 28%, #cfcfc6 55%, #9b9b90 100%);
          box-shadow: 0 30px 90px rgba(2,6,23,0.8), inset -18px -8px 36px rgba(0,0,0,0.24);
          position: relative;
          overflow: visible;
          transform-origin: center;
          animation: slow-rotate 90s linear infinite;
        }

        .moon::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          box-shadow: inset -10px -6px 40px rgba(0,0,0,0.18);
          mix-blend-mode: multiply;
          pointer-events: none;
        }

        .terminator {
          background: linear-gradient(90deg, rgba(2,6,23,0.65) 0%, rgba(2,6,23,0.25) 28%, rgba(2,6,23,0.05) 45%, transparent 60%);
          mix-blend-mode: multiply;
          border-radius: 9999px;
          opacity: 0.95;
          transform: translateX(-6%);
        }

        .crater {
          position: absolute;
          background: radial-gradient(circle at 30% 30%, rgba(0,0,0,0.32), rgba(0,0,0,0.05) 50%, rgba(255,255,255,0.02) 60%);
          border-radius: 9999px;
          box-shadow: inset 6px 6px 10px rgba(255,255,255,0.02), inset -6px -6px 10px rgba(0,0,0,0.35);
          opacity: 0.95;
        }

        .crater.c1 { width: 38px; height: 38px; left: 18%; top: 24%; }
        .crater.c2 { width: 26px; height: 26px; right: 20%; top: 30%; }
        .crater.c3 { width: 18px; height: 18px; left: 30%; bottom: 28%; }
        .crater.c4 { width: 22px; height: 22px; right: 30%; bottom: 22%; }
        .crater.c5 { width: 54px; height: 54px; left: 42%; top: 12%; opacity: 0.85; transform: translateX(-6%); }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        @keyframes drift {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0px); }
        }

        @keyframes drift-fast {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }

        @keyframes drift-slow {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
          100% { transform: translateY(0px); }
        }

        @keyframes slow-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .moon-image-wrapper {
          display: inline-flex;
          width: 100%;
          height: 100%;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
        }

        .moon-image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 9999px;
          box-shadow: 0 8px 48px rgba(2,6,23,0.7);
        }

        .moon-shadow-fade {
          border-radius: 9999px;
          background: radial-gradient(circle at 35% 35%, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.25) 30%, rgba(0,0,0,0.08) 55%, rgba(0,0,0,0) 80%);
          filter: blur(28px);
          transition: opacity 700ms ease-in-out, transform 700ms ease-in-out;
          opacity: 0.95;
          pointer-events: none;
          mix-blend-mode: multiply;
        }

        .moon-rise-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 10;
        }

        .moon-poem {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translateX(-50%);
          margin-top: 8vw;
          text-align: center;
          pointer-events: none;
          width: min(520px, 88vw);
          overflow: hidden;
        }

        .moon-poem-line {
          opacity: 0;
          font-family: 'Homemade Apple', cursive;
          font-size: clamp(0.8rem, 1.8vw, 1.05rem);
          color: rgba(255, 255, 255, 0.88);
          font-weight: 400;
          letter-spacing: 0.03em;
          line-height: 2.2;
          will-change: opacity, transform;
        }

        .moon-poem-spacer {
          height: 0.6em;
        }

        .moon-poem-rule {
          height: 1px;
          width: 80%;
          background: rgba(255,255,255,0.35);
          margin: 1.2em auto 0;
          transform: scaleX(0);
          transform-origin: center;
          opacity: 0;
          will-change: transform, opacity;
        }
      `}</style>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Homemade+Apple&display=swap');`}</style>
      </div>
      {/* scroll spacer — gives the sticky scene room to animate */}
      <div style={{ height: "500vh" }} />
    </div>
  );
}
