import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";

const Somos = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const containerRef = useRef(null);
  const sectionRefs = useRef([]);

  const sections = [
    {
      id: 1,
      date: "01",
      month: "Enero",
      year: "2019",
      title: "El Inicio",
      subtitle: "AR",
      image: "img/about1.webp",
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
      className="min-h-[400vh] bg-gray-50 relative mt-24 mb-24"
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
          <div className="hidden md:!grid md:!grid-cols-2 md:!gap-16 max-w-7xl w-full items-center">
            {/* Texto */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-baseline space-x-4">
                  <span className="text-6xl font-light text-gray-900">
                    {section.date}
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600 font-light tracking-wide">
                      {section.month}
                    </p>
                    <p className="text-sm text-gray-400 font-light">
                      {section.year}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-4xl font-light text-gray-900">
                    {section.title}
                  </h2>
                  <h3 className="text-2xl italic font-light text-gray-700">
                    {section.subtitle}
                  </h3>
                </div>
              </div>

              <div className="space-y-6">
                <div className="w-16 h-px bg-gray-300"></div>
                {section.content.map((paragraph, pIndex) => (
                  <p
                    key={pIndex}
                    className="text-lg font-light text-gray-600 leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="pt-8">
                <p className="text-xs font-light text-gray-400 tracking-wider">
                  {section.author}
                </p>
              </div>
            </div>

            {/* Imagen */}
            <div className="relative">
              <div className="w-full aspect-[3/4] relative overflow-hidden">
                <img
                  src={section.image}
                  alt={section.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute bottom-4 right-4 transform rotate-90 origin-bottom-right">
                  <p className="text-xs font-light text-gray-600 tracking-widest">
                    #ARWeddingsStory
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:!hidden w-full max-w-lg space-y-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-4">
                <span className="text-4xl font-light text-gray-900">
                  {section.date}
                </span>
                <div className="text-left space-y-1">
                  <p className="text-sm text-gray-600 font-light">
                    {section.month}
                  </p>
                  <p className="text-sm text-gray-400 font-light">
                    {section.year}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-light text-gray-900">
                  {section.title}
                </h2>
                <h3 className="text-xl italic font-light text-gray-700">
                  {section.subtitle}
                </h3>
              </div>
            </div>

            <div className="relative">
              <div className="w-full aspect-[3/4] relative overflow-hidden">
                <img
                  src={section.image}
                  alt={section.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute bottom-4 right-4 transform rotate-90 origin-bottom-right">
                  <p className="text-xs font-light text-gray-600 tracking-widest">
                    #ARWeddingsStory
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6 text-center">
              <div className="w-12 h-px bg-gray-300 mx-auto"></div>
              {section.content.map((paragraph, pIndex) => (
                <p
                  key={pIndex}
                  className="text-base font-light text-gray-600 leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="text-center pt-4">
              <p className="text-xs font-light text-gray-400 tracking-wider">
                {section.author}
              </p>
            </div>
          </div>
        </div>
      ))}

      {showProgress && (
        <div className="fixed right-8 top-1/2 transform -translate-y-1/2 space-y-3 z-20">
          {sections.map((_, index) => (
            <div
              key={index}
              className={`
                w-2 h-8 
                ${currentSection === index ? "bg-gray-900" : "bg-gray-300"}
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