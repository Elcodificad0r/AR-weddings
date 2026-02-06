import React, { useEffect, useMemo, useRef, useState } from "react";
import Home from "./Home";
import Proyectos from "./Proyectos";

/** ✅ Hook: detecta mobile (<= 767px) */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  return isMobile;
}

/**
 * Hook: progreso 0..1 según scroll dentro de un contenedor.
 */
function useParallaxProgress(containerRef) {
  const [p, setP] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;

      const total = rect.height - vh;
      if (total <= 0) {
        setP(0);
        return;
      }

      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      setP(scrolled / total);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [containerRef]);

  return p;
}

const clamp01 = (n) => Math.min(1, Math.max(0, n));
const lerp = (a, b, t) => a + (b - a) * t;

export default function HomeToProjectsParallax() {
  // ✅ Hooks SIEMPRE arriba (sin returns antes)
  const isMobile = useIsMobile();
  const wrapRef = useRef(null);
  const progress = useParallaxProgress(wrapRef);

  /**
   * Timeline:
   * 0.00 - 0.55  => Home se “lava” a blanco y se desvanece
   * 0.45 - 1.00  => Proyectos entra desde la derecha
   */
  const homeFade = useMemo(() => {
    const t = clamp01((progress - 0.05) / 0.5);
    return 1 - t;
  }, [progress]);

  const whiteWash = useMemo(() => {
    const t = clamp01((progress - 0.1) / 0.55);
    return t * t * (3 - 2 * t);
  }, [progress]);

  const projectsEnter = useMemo(() => {
    const t = clamp01((progress - 0.45) / 0.55);
    return t * t * (3 - 2 * t);
  }, [progress]);

  const projectsX = useMemo(() => {
    const x = lerp(110, 0, projectsEnter);
    return `translate3d(${x}%, 0, 0)`;
  }, [projectsEnter]);

  const projectsY = useMemo(() => {
    const y = lerp(14, 0, projectsEnter);
    return `translate3d(0, ${y}px, 0)`;
  }, [projectsEnter]);

  // ✅ Mobile: Home + Proyectos normal (sin parallax)
  if (isMobile) {
    return (
      <>
        <section id="home">
          <Home />
        </section>

        <section id="proyectos">
          <Proyectos />
        </section>
      </>
    );
  }

  // ✅ Desktop: Parallax
  return (
    <section
      id="home"
      ref={wrapRef}
      className="relative"
      style={{ height: "280vh", background: "#F2F2F2" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* BASE BG */}
        <div className="absolute inset-0" style={{ background: "#F2F2F2" }} />

        {/* HOME */}
        <div
          className="absolute inset-0 z-[10]"
          style={{
            opacity: homeFade,
            transform: `scale(${lerp(1, 1.02, 1 - homeFade)})`,
            filter: `saturate(${lerp(1, 0.9, 1 - homeFade)})`,
            willChange: "opacity, transform, filter",
          }}
        >
          <Home />
        </div>

        {/* WHITE WASH */}
        <div
          className="absolute inset-0 z-[20] pointer-events-none"
          style={{
            background: "#F2F2F2",
            opacity: whiteWash,
            willChange: "opacity",
          }}
        />

        {/* PROYECTOS */}
        <div
          className="absolute inset-0 z-[30]"
          style={{
            transform: `${projectsX} ${projectsY}`,
            opacity: projectsEnter,
            willChange: "transform, opacity",
          }}
        >
          <Proyectos parallaxProgress={projectsEnter} parallaxMode />
        </div>
      </div>
    </section>
  );
}
