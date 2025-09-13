import React, { useState, useEffect } from 'react';
import { X, Play } from 'lucide-react';

const Proyectos = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const projects = [
    {
      id: 1,
      title: "María & Carlos",
      date: "Octubre 2024",
      location: "Hacienda San Gabriel",
      thumbnail: "bg-stone-200",
      vimeoId: "123456789",
      description: "Una ceremonia íntima rodeada de naturaleza donde cada momento fue capturado con la sensibilidad que merecía su amor.",
      position: { row: 2, col: 3 }
    },
    {
      id: 2,
      title: "Ana & Roberto",
      date: "Septiembre 2024", 
      location: "Casa de Campo",
      thumbnail: "bg-neutral-300",
      vimeoId: "987654321",
      description: "Un día lleno de emociones auténticas, risas espontáneas y lágrimas de felicidad en un entorno campestre.",
      position: { row: 1, col: 7 }
    },
    {
      id: 3,
      title: "Laura & Diego",
      date: "Agosto 2024",
      location: "Viñedo Valle de Guadalupe", 
      thumbnail: "bg-gray-200",
      vimeoId: "456789123",
      description: "Entre viñedos y atardeceres dorados, documentamos una historia de amor que trasciende el tiempo.",
      position: { row: 4, col: 2 }
    },
    {
      id: 4,
      title: "Sofia & Miguel",
      date: "Julio 2024",
      location: "Playa Tulum",
      thumbnail: "bg-stone-300",
      vimeoId: "789123456",
      description: "El sonido de las olas como banda sonora de una ceremonia llena de magia y conexión espiritual.",
      position: { row: 3, col: 6 }
    },
    {
      id: 5,
      title: "Valeria & Andrés",
      date: "Junio 2024",
      location: "Jardín Botánico",
      thumbnail: "bg-zinc-200", 
      vimeoId: "321654987",
      description: "Rodeados de flora exuberante, capturamos la esencia de un amor que florece naturalmente.",
      position: { row: 5, col: 4 }
    },
    {
      id: 6,
      title: "Camila & Sebastián",
      date: "Mayo 2024",
      location: "Rooftop Ciudad",
      thumbnail: "bg-slate-200",
      vimeoId: "654987321", 
      description: "Con la ciudad como testigo, documentamos una celebración urbana llena de estilo y personalidad.",
      position: { row: 1, col: 1 }
    }
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

  // Prevent scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape' && selectedProject) {
        closeProject();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [selectedProject]);

  return (
    <div className="min-h-screen bg-white p-8 relative">
      {/* Grid Container - Experimental Layout */}
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
        {projects.map((project) => (
          <div
            key={project.id}
            className={`
              absolute cursor-pointer group transition-all duration-500 hover:scale-110 hover:z-10
              ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
            `}
            style={{
              top: `${project.position.row * 15}%`,
              left: `${project.position.col * 11}%`,
              width: '120px',
              height: '160px',
            }}
            onClick={() => openProject(project)}
          >
            <div className={`
              w-full h-full ${project.thumbnail} relative overflow-hidden
              group-hover:shadow-2xl transition-all duration-300
            `}>
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                <Play className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-all duration-300" />
              </div>
              
              {/* Project Number */}
              <div className="absolute top-2 left-2 text-xs font-light text-gray-600 opacity-70">
                ({project.id.toString().padStart(2, '0')})
              </div>
            </div>

            {/* Hover Info */}
            <div className="absolute -bottom-8 left-0 opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">
              <p className="text-xs font-light text-gray-900 tracking-wide uppercase">
                {project.title}
              </p>
            </div>
          </div>
        ))}

        {/* Title */}
        <div className="absolute top-8 left-8">
          <h2 className="text-sm tracking-widest uppercase font-light text-gray-400">
            Proyectos Seleccionados
          </h2>
          <div className="w-12 h-px bg-gray-300 mt-2"></div>
        </div>

        {/* Year */}
        <div className="absolute top-8 right-8 text-right">
          <p className="text-xs tracking-widest uppercase font-light text-gray-300">
            2024
          </p>
        </div>
      </div>

      {/* Modal */}
      {selectedProject && (
        <div className={`
          fixed inset-0 z-50 bg-white flex items-center justify-center p-8 lg:!pt-24 lg:!overflow-y-auto
          transition-all duration-500 ease-out
          ${isAnimating ? 'opacity-0' : 'opacity-100'}
        `}>
          {/* Close Button */}
          <button
            onClick={closeProject}
            className="absolute top-8 right-8 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors duration-300"
          >
            <X className="w-4 h-4 text-gray-900" />
          </button>

          {/* Content */}
          <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            {/* Video */}
            <div className="aspect-video h-3/4 w-full">
              <iframe
                src={`https://player.vimeo.com/video/${selectedProject.vimeoId}?autoplay=1&title=0&byline=0&portrait=0&controls=1`}
                className="w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title={selectedProject.title}
              ></iframe>
            </div>

            {/* Info */}
            <div className="space-y-8">
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-xs tracking-widest uppercase font-light text-gray-400">
                    ({selectedProject.id.toString().padStart(2, '0')})
                  </span>
                  <div className="w-8 h-px bg-gray-300"></div>
                </div>
                
                <h3 className="text-4xl font-light text-gray-900 mb-2">
                  {selectedProject.title}
                </h3>
                
                <div className="space-y-1 mb-6">
                  <p className="text-sm text-gray-500 tracking-wide">
                    {selectedProject.date}
                  </p>
                  <p className="text-sm text-gray-500 tracking-wide">
                    {selectedProject.location}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="w-12 h-px bg-gray-300"></div>
                <p className="text-lg font-light text-gray-600 leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              {/* Navigation hint */}
              <div className="pt-8">
                <p className="text-xs tracking-widest uppercase font-light text-gray-300">
                  ESC para cerrar
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Proyectos;