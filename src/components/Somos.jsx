import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";

const Somos = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const containerRef = useRef(null);
  const sectionRefs = useRef([]);

  // ✅ NUEVO: tracking de carga de video por sección
  const [loadedVideos, setLoadedVideos] = useState({});

  const sections = [
    {
      id: 1,
      date: "01",
      month: "Enero",
      year: "2019",
      title: "El Inicio",
      subtitle: "AR",
      image: "img/about1.webp",
      video: "img/about1.mp4", // ✅ NUEVO
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
      video: "img/about2.mp4", // ✅ NUEVO
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
      video: "img/about3.mp4", // ✅ NUEVO
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
      video: "img/about4.mp4", // ✅ NUEVO
      content: [
        "Hoy somos un equipo comprometido con la excelencia artística.",
        "Cada proyecto nos enseña algo nuevo sobre el amor y la vida.",
        "Seguimos creciendo, aprendiendo y emocionándonos con cada historia.",
      ],
      author: "archive by Alexis Ramírez",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const scrollTop = window.scrollY;
      const containerTop = containerRef.current.offsetTop;
      const containerHeight = containerRef.current.offsetHeight;
      const sectionHeight = containerHeight / sections.length;

      const extraOffset = window.innerWidth < 768 ? 140 : 0;

      if (
        scrollTop >= containerTop - window.innerHeight / 2 &&
        scrollTop <= containerTop + containerHeight - window.innerHeight / 2
      ) {
        setShowProgress(true);
      } else {
        setShowProgress(false);
      }

      const relativeScroll =
        scrollTop - containerTop + window.innerHeight / 2 - extraOffset;

      const sectionIndex = Math.floor(relativeScroll / sectionHeight);

      if (sectionIndex >= 0 && sectionIndex < sections.length) {
        setCurrentSection(sectionIndex);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections.length]);

  useEffect(() => {
    sectionRefs.current.forEach((el, index) => {
      if (!el) return;
      if (index === currentSection) {
        gsap.to(el, { opacity: 1, duration: 1, zIndex: 10 });
      } else {
        gsap.to(el, { opacity: 0, duration: 1, zIndex: 0 });
      }
    });
  }, [currentSection]);

  return (
    <div
      ref={containerRef}
      className="min-h-[400vh] bg-[#F2F2F2] relative mt-24 mb-24"
    >
      {sections.map((section, index) => (
        <div
          key={section.id}
          ref={(el) => (sectionRefs.current[index] = el)}
          className="
            sticky top-0 w-full h-screen flex items-center justify-center
            p-8 md:!p-16 opacity-0
            sm:min-h-[120vh] sm:overflow-y-auto !important
          "
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

                  {/* ✅ VIDEO (about1.mp4, about2.mp4...) */}
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

            {/* ✅ NUEVO DISEÑO EDITORIAL DE DESCRIPCIÓN (MOBILE) */}
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
          {sections.map((_, index) => (
            <div
              key={index}
              className={`
                w-1 h-12 transition-all duration-500
                ${currentSection === index ? "bg-gray-900 h-16" : "bg-gray-300"}
              `}
            />
          ))}
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
