// src/App.jsx
import React, { Suspense, lazy, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";

import Lenis from "@studio-freight/lenis";

// Lazy components
const HomeToProjectsParallax = lazy(() =>
  import("./components/HomeToProjectsParallax")
);
const Somos = lazy(() => import("./components/Somos"));
const Contacto = lazy(() => import("./components/Contacto"));

function App() {

  // ✅ Smooth cinematic scroll
  useEffect(() => {
    const lenis = new Lenis({
  duration: 1.8,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
  smoothTouch: true,      // ✅ importante para mobile
  touchMultiplier: 0.8,   // ✅ controla velocidad touch
  wheelMultiplier: 0.7,
});


    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <Suspense
      fallback={
        <div className="text-center mt-20 text-xl text-gray-500">
          Cargando...
        </div>
      }
    >
      <Navbar />

      {/* ✅ Home → Proyectos Parallax */}
      <HomeToProjectsParallax />

      <section id="somos">
        <Somos />
      </section>

      <section id="contacto">
        <Contacto />
      </section>
    </Suspense>
  );
}

export default App;
