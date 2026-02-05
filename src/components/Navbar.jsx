// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";

const Navbar = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: "home", short: "H", full: "Home" },
    { id: "proyectos", short: "P", full: "Proyectos" },
    { id: "somos", short: "S", full: "Somos" },
    { id: "contacto", short: "C", full: "Contacto" },
  ];

  const scrollToSection = (sectionId) => {
    console.log("Trying to scroll to:", sectionId); // Debug
    const element = document.getElementById(sectionId);
    console.log("Element found:", element); // Debug

    if (element) {
      const navbarHeight = 80; // Altura del navbar (h-20 = 80px)
      const elementPosition = element.offsetTop - navbarHeight;

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    } else {
      console.warn(`Element with id "${sectionId}" not found`);
    }

    setActiveSection(sectionId);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) => item.id);
      const scrollPosition = window.scrollY + 150;

      let currentSection = "home";

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            currentSection = sectionId;
            break;
          }
        }
      }

      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
        console.log("Active section changed to:", currentSection); // Debug
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection]);

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#F2F2F2] backdrop-blur-sm border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
        {/* Logo */}
        <div className="flex items-baseline space-x-1">
          <span className="text-3xl font-light text-gray-900">A</span>
          <span className="text-3xl italic font-light text-gray-900">R</span>
          <span className="text-lg font-light text-gray-600 ml-2 tracking-wider">
            Weddings
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="!hidden sm:!flex !items-center">
          {navItems.map((item, index) => {
            const isActive = activeSection === item.id;
            const isHovered = hoveredItem === item.id;
            const showFullText = isActive || isHovered;

            return (
              <div key={item.id} className="!relative !flex !items-center">
                {/* Botón con padding grande - ahora el ÁREA CLICKEABLE ES MÁS GRANDE */}
                <button
                  onClick={() => scrollToSection(item.id)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`!relative !cursor-pointer !text-sm !tracking-widest !font-light !uppercase !transition-all !duration-300 !ease-out !block !px-8 sm:!py-12 !py-6
                    ${isActive ? "!text-gray-900" : "!text-gray-400 hover:!text-gray-700"}`}
                >
                  <div
                    className="!relative !transition-all !duration-300 !ease-out !overflow-hidden"
                    style={{
                      width: showFullText
                        ? `${item.full.length * 0.85}em`
                        : "1ch",
                      minWidth: "1ch",
                      height: "1.2em",
                    }}
                  >
                    {/* Letra corta */}
                    <span
                      className={`!absolute !top-0 !left-0 !inline-block !transition-all !duration-300 !ease-out !whitespace-nowrap
                        ${
                          showFullText
                            ? "!transform !-translate-x-full !opacity-0"
                            : "!transform !translate-x-0 !opacity-100"
                        }`}
                    >
                      {item.short}
                    </span>

                    {/* Texto completo */}
                    <span
                      className={`!absolute !top-0 !left-0 !inline-block !transition-all !duration-300 !ease-out !whitespace-nowrap
                        ${
                          showFullText
                            ? "!transform !translate-x-0 !opacity-100"
                            : "!transform !translate-x-full !opacity-0"
                        }`}
                    >
                      {item.full}
                    </span>
                  </div>

                  {/* Indicador activo - ABAJO como subrayado */}
                  <div
                    className={`!relative !-bottom-1 !left-0 !h-px !bg-gray-900 !transition-all !duration-300 !ease-out
                      ${isActive ? "!w-full !opacity-100" : "!w-0 !opacity-0"}`}
                  />
                </button>

                {/* Separador dinámico */}
                {index < navItems.length - 1 && (
                  <span className="!text-gray-300 !font-light !text-sm !mx-2">
                    /
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile menu button */}
        <div className="!flex !items-center sm:!hidden">
          <button
            className="!text-gray-800 focus:!outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div
              className={`!w-6 !h-0.5 !bg-gray-800 !mb-1 !transition-all !duration-300 ${
                isOpen ? "!rotate-45 !translate-y-1.5" : ""
              }`}
            ></div>
            <div
              className={`!w-6 !h-0.5 !bg-gray-800 !mb-1 !transition-all !duration-300 ${
                isOpen ? "!opacity-0" : ""
              }`}
            ></div>
            <div
              className={`!w-6 !h-0.5 !bg-gray-800 !transition-all !duration-300 ${
                isOpen ? "!-rotate-45 !-translate-y-1.5" : ""
              }`}
            ></div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="!block sm:!hidden !bg-white/95 !backdrop-blur-sm !border-t !border-gray-200 !px-6 !py-4 !space-y-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`!block !w-full !text-left !text-lg !font-light !uppercase !transition-all !duration-300 !ease-out
                ${
                  activeSection === item.id
                    ? "!text-gray-900 !font-medium"
                    : "!text-gray-500 hover:!text-gray-800"
                }`}
            >
              {item.full}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;