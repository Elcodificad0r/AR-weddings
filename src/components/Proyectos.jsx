import React, { useState, useEffect } from "react";
import { X, Play } from "lucide-react";

const Proyectos = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const projects = [
    {
      id: 1,
      title: "Charlene & Enrique",
      date: "Noviembre 2024",
      location: "Santiago N.L.",
      thumbnail: "./img/charlene-enrique.webp",
      vimeoId: "1027996730",
      description:
        "Una ceremonia íntima rodeada de naturaleza donde cada momento fue capturado con la sensibilidad que merecía su amor.",
      position: { row: 2, col: 3 },
    },
    {
      id: 2,
      title: "Paola & Carlos",
      date: "Julio 2025",
      location: "Viñedo Santiago N.L.",
      thumbnail: "./img/paola-carlos.webp",
      vimeoId: "1105323704",
      description:
        "Entre viñedos y atardeceres dorados, documentamos una historia de amor que trasciende el tiempo.",
      position: { row: 1, col: 7 },
    },
    {
      id: 3,
      title: "Angélica & Alexis",
      date: "Noviembre 2024",
      location: "Casa de Campo",
      thumbnail: "./img/angelica-alexis.webp",
      vimeoId: "1069026243",
      description:
        "Un día lleno de emociones auténticas, risas espontáneas y lágrimas de felicidad en un entorno campestre.",
      position: { row: 4, col: 2 },
    },
    {
      id: 4,
      title: "Alejandra & Daniel",
      date: "Diciembre 2024",
      location: "Rooftop Ciudad",
      thumbnail: "./img/alejandra-daniel.webp",
      vimeoId: "1134900955",
      description:
        "Con la ciudad como testigo, documentamos una celebración urbana llena de estilo y personalidad.",
      position: { row: 3, col: 6 },
    },
    {
      id: 5,
      title: "Aylin & Emmanuel",
      date: "Julio 2025",
      location: "Jardín Botánico",
      thumbnail: "./img/aylin-emannuel.webp",
      vimeoId: "1086249635",
      description:
        "Rodeados de flora exuberante, capturamos la esencia de un amor que florece naturalmente.",
      position: { row: 5, col: 4 },
    },
    {
      id: 6,
      title: "Kristina & Mike",
      date: "Mayo 2025",
      location: "La Herencia, Santiago N.L.",
      thumbnail: "./img/kristina-mike.webp",
      vimeoId: "1083300718",
      description:
        "El sonido del viento como banda sonora de una ceremonia llena de magia y conexión espiritual.",
      position: { row: 1, col: 1 },
    },
  ];

  const openProject = (project) => {
    setIsAnimating(true);
    setTimeout(() => {
      setSelectedProject(project);
      setIsAnimating(false);
    }, 300);
  };

  const closeProject = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setSelectedProject(null);
      setIsAnimating(false);
    }, 300);
  };

  useEffect(() => {
    if (selectedProject) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedProject]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape" && selectedProject) closeProject();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [selectedProject]);

  const keepSame = new Set([3, 5, 6]);

  const getThumbSize = (id) => {
    const base = {
      width: "clamp(120px, 28vw, 200px)",
      height: "clamp(160px, 38vw, 266px)",
    };

    if (keepSame.has(id)) return base;

    return {
      width: "clamp(160px, 40vw, 320px)",
      height: base.height,
    };
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-4 md:p-8 relative">
      {/* Grid Container */}
      <div className="relative w-full h-screen">
        {/* Grid Background Dots */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 12 }, (_, row) =>
            Array.from({ length: 8 }, (_, col) => (
              <div
                key={`${row}-${col}`}
                className="absolute w-1 h-1 bg-gray-400 rounded-full"
                style={{
                  top: `${(row + 1) * 8}%`,
                  left: `${(col + 1) * 12}%`,
                }}
              />
            ))
          )}
        </div>

        {/* Project Thumbnails */}
        {projects.map((project) => {
          const size = getThumbSize(project.id);

          return (
            <div
              key={project.id}
              className={`
                absolute cursor-pointer group transition-all duration-500 hover:scale-[1.06] hover:z-10
                ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"}
              `}
              style={{
                top: `clamp(0px, ${project.position.row * 15}%, calc(100% - 160px))`,
                left: `clamp(0px, ${project.position.col * 11}%, calc(100% - 120px))`,
                width: size.width,
                height: size.height,
              }}
              onClick={() => openProject(project)}
            >
              <div className="w-full h-full relative overflow-hidden group-hover:shadow-2xl transition-all duration-300">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </div>

                <div className="absolute top-2 left-2 text-xs font-light text-gray-200 opacity-80 bg-black/30 px-1 rounded">
                  ({project.id.toString().padStart(2, "0")})
                </div>
              </div>

              <div className="absolute -bottom-8 left-0 opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">
                <p className="text-xs font-light text-gray-900 tracking-wide uppercase">
                  {project.title}
                </p>
              </div>
            </div>
          );
        })}

        {/* Title */}
        <div className="absolute top-6 md:top-8 left-4 md:left-8">
          <h2 className="text-sm tracking-widest uppercase font-light text-gray-400">
            Proyectos Seleccionados
          </h2>
          <div className="w-12 h-px bg-gray-300 mt-2"></div>
        </div>

        {/* Year */}
        <div className="absolute top-6 md:top-8 right-4 md:right-8 text-right">
          <p className="text-xs tracking-widest uppercase font-light text-gray-300">
            2024
          </p>
        </div>
      </div>

      {/* Modal */}
{selectedProject && (
  <div
    className={`
      fixed inset-0 z-50 bg-white
      transition-all duration-500 ease-out
      ${isAnimating ? "opacity-0" : "opacity-100"}
    `}
  >
    {/* Close Button */}
    <button
      onClick={closeProject}
      className="fixed top-20 right-4 md:top-8 md:right-8 w-16 h-16 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors duration-300 z-[100] bg-white shadow-lg"
      aria-label="Cerrar"
    >
      <X className="w-9 h-9 text-gray-900" />
    </button>

    {/* Layout del modal */}
    <div className="relative w-full h-full">
      {/* =================== DESKTOP DECORATIVOS (no bloquean clicks) =================== */}
      <div className="hidden md:block absolute inset-0 z-[20] pointer-events-none">
        {/* Esquina sup izq: número */}
        <div className="absolute top-10 left-10 text-xs tracking-widest uppercase font-light text-gray-400">
          ({selectedProject.id.toString().padStart(2, "0")})
        </div>

        {/* Derecha: MAGAZINE vertical */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 text-[10px] tracking-[0.6em] uppercase font-light text-gray-300 rotate-90 origin-right">
          MAGAZINE
        </div>
      </div>

      {/* =================== MODAL GRID (header / video / footer) =================== */}
      <div className="relative z-[10] w-full h-full grid grid-rows-[auto_1fr_auto]">
        {/* ================= HEADER ================= */}
        <div className="pt-10 md:pt-12 pb-5 md:pb-6 text-center pointer-events-none">
          <h3 className="text-3xl md:text-5xl font-light text-gray-900 leading-tight">
            {selectedProject.title}
          </h3>
          <div className="mx-auto mt-3 w-12 h-px bg-gray-300" />
        </div>

        {/* ================= VIDEO ================= */}
        <div className="flex items-center justify-center px-4 md:px-10">
          <div className="w-full max-w-4xl">
            <div className="relative z-[30] aspect-video bg-black shadow-xl">
              <iframe
                src={`https://player.vimeo.com/video/${selectedProject.vimeoId}?autoplay=1&title=0&byline=0&portrait=0&controls=1`}
                className="w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title={selectedProject.title}
              />
            </div>
          </div>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="px-4 md:px-10 pb-6 md:pb-10 pt-5">
          <div className="mx-auto max-w-4xl bg-white/90 backdrop-blur border border-black/10 shadow-lg">
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-sm">
                {/* Date */}
                <div className="md:col-span-3">
                  <p className="text-[9px] tracking-[0.35em] uppercase text-gray-400 mb-1">
                    Date
                  </p>
                  <p className="text-gray-900 font-light">{selectedProject.date}</p>
                </div>

                {/* Location */}
                <div className="md:col-span-3">
                  <p className="text-[9px] tracking-[0.35em] uppercase text-gray-400 mb-1">
                    Location
                  </p>
                  <p className="text-gray-900 font-light">{selectedProject.location}</p>
                </div>

                {/* Notes */}
                <div className="md:col-span-6">
                  <p className="text-[9px] tracking-[0.35em] uppercase text-gray-400 mb-1">
                    Notes
                  </p>
                  <p className="text-[13px] text-gray-700 leading-relaxed font-light">
                    {selectedProject.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 border-t border-black/10 pt-3 flex justify-between">
                <p className="text-[9px] tracking-[0.45em] uppercase text-gray-400">
                  AR WEDDINGS
                </p>
                <p className="text-[9px] tracking-[0.45em] uppercase text-gray-300">
                  ESC TO CLOSE
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =================== MOBILE INFO (se mantiene tu idea, no tapa el video) =================== */}
      <div className="md:hidden absolute inset-x-0 bottom-0 z-[40] bg-white/95 backdrop-blur-sm border-t border-gray-200 px-5 py-5">
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="text-xs tracking-widest uppercase font-light text-gray-400">
            ({selectedProject.id.toString().padStart(2, "0")})
          </span>
          <div className="w-10 h-px bg-gray-300" />
        </div>

        <h3 className="text-2xl font-extralight text-gray-900 text-center mb-2">
          {selectedProject.title}
        </h3>

        <p className="text-xs text-gray-500 tracking-wide text-center mb-3">
          {selectedProject.date} · {selectedProject.location}
        </p>

        <p className="text-sm font-light text-gray-600 leading-relaxed text-center mb-3">
          {selectedProject.description}
        </p>

        <p className="text-xs tracking-widest uppercase font-light text-gray-300 text-center">
          ESC PARA CERRAR
        </p>
      </div>
    </div>
  </div>
)}


    </div>
  );
};

export default Proyectos;