import React, { useState, useEffect, useRef, useMemo } from "react";

const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
const clamp01 = (n) => clamp(n, 0, 1);
const smoothstep = (t) => t * t * (3 - 2 * t);
const lerp = (a, b, t) => a + (b - a) * t;

const Somos = () => {
  const [showProgress, setShowProgress] = useState(false);

  const containerRef = useRef(null);

  // ✅ NUEVO: tracking de carga de video por sección
  const [loadedVideos, setLoadedVideos] = useState({});

  const sections = useMemo(
    () => [
      {
        id: 1,
        date: "01",
        month: "Enero",
        year: "2019",
        title: "El Inicio",
        subtitle: "AR",
        image: "img/about1.webp",
        video: "img/about1.mp4",
        content: [
          "Todo comenzó con una cámara y la pasión por contar historias.",
          "Desde entonces, cada boda es un nuevo capítulo que escribimos con luz y movimiento.",
          "Nuestro enfoque siempre ha sido capturar lo auténtico, lo espontáneo, lo real.",
        ],
        author: "archive by Alexis Ramírez",
      },
      {
        id: 2,
        date: "02",
        month: "Marzo",
        year: "2020",
        title: "Filosofía",
        subtitle: "Momentos",
        image: "img/about2.webp",
        video: "img/about2.mp4",
        content: [
          "Creemos que cada pareja tiene una historia única que merece ser contada.",
          "No buscamos poses perfectas, buscamos emociones verdaderas.",
          "El amor auténtico no necesita dirección, solo documentación.",
        ],
        author: "archive by Alexis Ramírez",
      },
      {
        id: 3,
        date: "03",
        month: "Julio",
        year: "2021",
        title: "Método",
        subtitle: "Intimidad",
        image: "img/about3.webp",
        video: "img/about3.mp4",
        content: [
          "Trabajamos como observadores silenciosos de vuestra historia.",
          "Nos adaptamos a vuestro ritmo, respetamos vuestros momentos íntimos.",
          "La cámara desaparece para que solo quede la esencia pura del día.",
        ],
        author: "archive by Alexis Ramírez",
      },
      {
        id: 4,
        date: "04",
        month: "Septiembre",
        year: "2022",
        title: "Presente",
        subtitle: "Evolución",
        image: "img/about4.webp",
        video: "img/about4.mp4",
        content: [
          "Hoy somos un equipo comprometido con la excelencia artística.",
          "Cada proyecto nos enseña algo nuevo sobre el amor y la vida.",
          "Seguimos creciendo, aprendiendo y emocionándonos con cada historia.",
        ],
        author: "archive by Alexis Ramírez",
      },
    ],
    []
  );

  const maxIndex = Math.max(0, sections.length - 1);

  // =========================
  // ✅ Scroll engine (raw + smooth + latch)
  // =========================
  const targetRawRef = useRef(0);
  const smoothRawRef = useRef(0);
  const rafRef = useRef(null);

  const lastScrollYRef = useRef(0);

  // ✅ latch anti-jitter en extremos
  const startLatchedRef = useRef(false);
  const endLatchedRef = useRef(false);
  const latchYRef = useRef(0);

  // estado solo para re-render
  const [, forceRender] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return;

      const y = window.scrollY;
      const lastY = lastScrollYRef.current || y;
      const dy = y - lastY;
      const dir = dy >= 0 ? 1 : -1;
      lastScrollYRef.current = y;

      const isMobile = window.innerWidth < 768;

      // ✅ cuánto necesitas mover para soltar el latch (mobile más)
      const RELEASE_PX = isMobile ? 180 : 110;

      // =========================
      // ✅ Calcular raw continuo 0..maxIndex
      // =========================
      let raw = 0;

      if (isMobile) {
        const scrollTop = y;
        const containerTop = containerRef.current.offsetTop;
        const containerHeight = containerRef.current.offsetHeight;
        const sectionHeight = containerHeight / sections.length;

        // show progress
        if (
          scrollTop >= containerTop - window.innerHeight / 2 &&
          scrollTop <= containerTop + containerHeight - window.innerHeight / 2
        ) {
          setShowProgress(true);
        } else {
          setShowProgress(false);
        }

        const extraOffset = 140;
        const relativeScroll =
          scrollTop - containerTop + window.innerHeight / 2 - extraOffset;

        raw = relativeScroll / sectionHeight;
        raw = clamp(raw, 0, maxIndex);
      } else {
        const rect = containerRef.current.getBoundingClientRect();
        const vh = window.innerHeight;
        const total = rect.height - vh;

        if (total <= 0) {
          raw = 0;
        } else {
          const scrolled = Math.min(Math.max(-rect.top, 0), total);
          raw = (scrolled / total) * maxIndex;
        }

        // show progress
        const containerTop = containerRef.current.offsetTop;
        if (
          y >= containerTop - window.innerHeight / 2 &&
          y <=
            containerTop +
              containerRef.current.offsetHeight -
              window.innerHeight / 2
        ) {
          setShowProgress(true);
        } else {
          setShowProgress(false);
        }
      }

      const prev = targetRawRef.current;

      // =========================
      // ✅ LATCH extremos (FIX)
      // =========================
      const END_EPS = 0.02;
      const START_EPS = 0.02;

      // Si estamos latched al final:
      if (endLatchedRef.current) {
        // suelta SOLO si subiste una distancia real
        if (y < latchYRef.current - RELEASE_PX) {
          endLatchedRef.current = false;
        } else {
          targetRawRef.current = maxIndex; // pegado al final
          return;
        }
      }

      // Si estamos latched al inicio:
      if (startLatchedRef.current) {
        // suelta SOLO si bajaste una distancia real
        if (y > latchYRef.current + RELEASE_PX) {
          startLatchedRef.current = false;
        } else {
          targetRawRef.current = 0; // pegado al inicio
          return;
        }
      }

      // Activar latch al final
      if (raw >= maxIndex - END_EPS && dir >= 0) {
        endLatchedRef.current = true;
        latchYRef.current = y;
        targetRawRef.current = maxIndex;
        return;
      }

      // Activar latch al inicio
      if (raw <= START_EPS && dir <= 0) {
        startLatchedRef.current = true;
        latchYRef.current = y;
        targetRawRef.current = 0;
        return;
      }

      // =========================
      // ✅ Direction lock (evita “jitter”)
      // =========================
      targetRawRef.current = dir > 0 ? Math.max(prev, raw) : Math.min(prev, raw);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sections.length, maxIndex]);

  // ✅ Smooth raf (más lento y elegante)
  useEffect(() => {
    const tick = () => {
      const target = targetRawRef.current;
      const cur = smoothRawRef.current;

      // ✅ easing más lento = más tiempo para leer
      const next = cur + (target - cur) * 0.15;
      smoothRawRef.current = next;

      // re-render suave (sin setState continuo agresivo)
      forceRender((v) => (v + 1) % 100000);

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // =========================
  // ✅ Helpers de animación por slide
  // =========================
  const getSlideStyle = (index) => {
    const raw = smoothRawRef.current;
    const d = raw - index; // -1..0..+1 aprox

    // alterna dirección: 0->entra derecha, 1->entra izquierda, etc.
    const dir = index % 2 === 0 ? 1 : -1;

    // ✅ zona “activa” amplia para permanencia y lectura
    // t = 0 en el centro, 1 hacia los bordes
    const t = clamp01(Math.abs(d) / 1.9);
    const eased = smoothstep(1 - t); // 1 en centro, 0 fuera

    // ✅ parallax lateral: fuera ~ ±18vw, en centro 0
    const xVw = lerp(18 * dir * Math.sign(d || 1), 0, eased);

    // micro y para profundidad (muy leve)
    const yPx = lerp(10, 0, eased);

    // opacity suave y estable
    const opacity = lerp(0, 1, eased);

    // zIndex: la más cercana al raw al frente
    const zIndex = 10 + Math.round((1 - t) * 10);

    return {
      opacity,
      zIndex,
      transform: `translate3d(${xVw}vw, ${yPx}px, 0)`,
      willChange: "transform, opacity",
      pointerEvents: Math.abs(d) < 0.55 ? "auto" : "none",
    };
  };

  return (
    <div
      ref={containerRef}
      className="min-h-[400vh] bg-[#F2F2F2] relative mt-24 mb-24 overflow-hidden"
    >
      {sections.map((section, index) => (
        <div
          key={section.id}
          className="
            sticky top-0 w-full h-screen flex items-center justify-center
            p-8 md:!p-16
            sm:min-h-[120vh] sm:overflow-y-auto !important
          "
          style={getSlideStyle(index)}
        >
          {/* Desktop Layout */}
          <div className="hidden md:!grid md:!grid-cols-2 md:!gap-20 lg:!gap-24 max-w-7xl w-full items-center">
            {/* Texto */}
            <div className="space-y-10 max-w-xl mx-auto">
              <div className="space-y-6">
                <div className="flex items-baseline space-x-6">
                  <span className="text-7xl lg:text-8xl font-extralight text-gray-900 tracking-tight">
                    {section.date}
                  </span>
                  <div className="space-y-0.5">
                    <p className="text-xs text-gray-500 font-light tracking-[0.2em] uppercase">
                      {section.month}
                    </p>
                    <p className="text-xs text-gray-400 font-light tracking-widest">
                      {section.year}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <h2 className="text-5xl lg:text-6xl font-extralight text-gray-900 tracking-tight leading-tight">
                    {section.title}
                  </h2>
                  <h3 className="text-3xl lg:text-4xl italic font-light text-gray-600 font-serif tracking-wide">
                    {section.subtitle}
                  </h3>
                </div>
              </div>

              <div className="relative">
                <div className="min-h-[42vh] flex flex-col justify-center -translate-y-10">
                  <div className="w-20 h-px bg-gray-300"></div>

                  <div className="grid grid-cols-12 gap-y-6 mt-8">
                    <div className="col-span-4 pr-6">
                      <div className="space-y-3">
                        <p className="text-[10px] font-light tracking-[0.35em] uppercase text-gray-400">
                          Creative Story
                        </p>
                        <p className="text-[10px] font-light tracking-[0.35em] uppercase text-gray-400">
                          Nature’s Atmosphere
                        </p>
                        <div className="w-10 h-px bg-gray-200"></div>
                        <p className="text-[10px] font-light tracking-[0.35em] uppercase text-gray-300">
                          2K{section.year.slice(-2)}
                        </p>
                      </div>
                    </div>

                    <div className="col-span-8 space-y-4">
                      {section.content.map((paragraph, pIndex) => (
                        <div
                          key={pIndex}
                          className="relative border border-gray-200/80 bg-[#F2F2F2] backdrop-blur-[1px] p-5"
                        >
                          <div className="absolute -top-3 left-4 bg-[#F2F2F2] px-2">
                            <span className="text-[10px] font-light tracking-[0.35em] uppercase text-gray-400">
                              {String(pIndex + 1).padStart(2, "0")}
                            </span>
                          </div>

                          <p className="text-[15px] lg:text-[16px] font-light text-gray-600 leading-relaxed tracking-wide">
                            {paragraph}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-[10px] font-light text-gray-400 tracking-[0.25em] uppercase">
                  {section.author}
                </p>
              </div>
            </div>

            {/* ✅ Imagen -> Lazy + Video */}
            <div className="relative">
              <div className="min-h-[42vh] flex items-center justify-center -translate-y-10">
                <div className="w-full aspect-[3/4] relative overflow-hidden shadow-2xl">
                  {/* ✅ STILL (lazy) */}
                  <img
                    src={section.image}
                    alt={section.title}
                    loading="lazy"
                    decoding="async"
                    className={`
                      absolute inset-0 w-full h-full object-cover transition-opacity duration-700
                      ${loadedVideos[section.id] ? "opacity-0" : "opacity-100"}
                    `}
                  />

                  {/* ✅ VIDEO */}
                  <video
                    src={section.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    onCanPlay={() =>
                      setLoadedVideos((prev) => ({ ...prev, [section.id]: true }))
                    }
                    className={`
                      absolute inset-0 w-full h-full object-cover transition-opacity duration-700
                      ${loadedVideos[section.id] ? "opacity-100" : "opacity-0"}
                    `}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                  <div className="absolute bottom-6 right-6 transform rotate-90 origin-bottom-right">
                    <p className="text-[10px] font-light text-white/80 tracking-[0.3em] uppercase drop-shadow-lg">
                      #ARWeddingsStory
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:!hidden w-full max-w-lg space-y-10">
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center space-x-4">
                <span className="text-5xl font-extralight text-gray-900 tracking-tight">
                  {section.date}
                </span>
                <div className="text-left space-y-0.5">
                  <p className="text-xs text-gray-500 font-light tracking-[0.2em] uppercase">
                    {section.month}
                  </p>
                  <p className="text-xs text-gray-400 font-light tracking-widest">
                    {section.year}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-4xl font-extralight text-gray-900 tracking-tight">
                  {section.title}
                </h2>
                <h3 className="text-2xl italic font-light text-gray-600 font-serif">
                  {section.subtitle}
                </h3>
              </div>
            </div>

            <div className="relative">
              <div className="w-full aspect-[3/4] relative overflow-hidden shadow-xl">
                {/* ✅ STILL (lazy) */}
                <img
                  src={section.image}
                  alt={section.title}
                  loading="lazy"
                  decoding="async"
                  className={`
                    absolute inset-0 w-full h-full object-cover transition-opacity duration-700
                    ${loadedVideos[section.id] ? "opacity-0" : "opacity-100"}
                  `}
                />

                {/* ✅ VIDEO */}
                <video
                  src={section.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  onCanPlay={() =>
                    setLoadedVideos((prev) => ({ ...prev, [section.id]: true }))
                  }
                  className={`
                    absolute inset-0 w-full h-full object-cover transition-opacity duration-700
                    ${loadedVideos[section.id] ? "opacity-100" : "opacity-0"}
                  `}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                <div className="absolute bottom-4 right-4 transform rotate-90 origin-bottom-right">
                  <p className="text-[10px] font-light text-white/80 tracking-[0.3em] uppercase drop-shadow-lg">
                    #ARWeddingsStory
                  </p>
                </div>
              </div>
            </div>

            {/* Descripción (igual que tu diseño) */}
            <div className="space-y-8 px-4">
              <div className="w-16 h-px bg-gray-300 mx-auto"></div>

              <div className="space-y-4">
                {section.content.map((paragraph, pIndex) => (
                  <div
                    key={pIndex}
                    className="relative border border-gray-200/80 bg-white/70 p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-light tracking-[0.35em] uppercase text-gray-400">
                        Note
                      </span>
                      <span className="text-[10px] font-light tracking-[0.35em] uppercase text-gray-300">
                        {String(pIndex + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <p className="text-[14px] font-light text-gray-600 leading-relaxed tracking-wide text-center">
                      {paragraph}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-center gap-4">
                <span className="text-[10px] font-light tracking-[0.35em] uppercase text-gray-300">
                  Creative
                </span>
                <span className="w-6 h-px bg-gray-200"></span>
                <span className="text-[10px] font-light tracking-[0.35em] uppercase text-gray-300">
                  Story
                </span>
              </div>
            </div>

            <div className="text-center pt-2">
              <p className="text-[10px] font-light text-gray-400 tracking-[0.25em] uppercase">
                {section.author}
              </p>
            </div>
          </div>
        </div>
      ))}

      {showProgress && (
        <div className="fixed right-8 top-1/2 transform -translate-y-1/2 space-y-4 z-20">
          {sections.map((_, index) => {
            const d = Math.abs(smoothRawRef.current - index);
            const active = d < 0.55;
            return (
              <div
                key={index}
                className={`
                  w-1 transition-all duration-500
                  ${active ? "bg-gray-900 h-16" : "bg-gray-300 h-12"}
                `}
              />
            );
          })}
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          div.sticky {
            position: relative !important;
            height: auto !important;
            min-height: 140vh !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Somos;
