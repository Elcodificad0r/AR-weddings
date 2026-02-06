import React, { useState, useEffect, useRef } from 'react';

const WeddingVideoComponent = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const imageContainerRef = useRef(null);
  const titleRef = useRef(null);
  const elementsRef = useRef([]);
  const videoRef = useRef(null);

  const poeticCopy = [
    "Capturamos la esencia de tu amor",
    "Cada mirada, un verso eterno",
    "Tu historia merece ser inmortal",
    "Donde el tiempo se detiene"
  ];

  const [currentCopy, setCurrentCopy] = useState(0);

  const STILL_SRC = "img/lazyloadinghome.webp";
  const LOW_SRC = "img/arhomevideolowres.mp4";
  const MID_SRC = "img/arhomevideo.mp4";
  const HIGH_SRC = "img/arhomevideohighres.mp4";

  const [videoSrc, setVideoSrc] = useState(LOW_SRC);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCopy((prev) => (prev + 1) % poeticCopy.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [poeticCopy.length]);

  const preloadVideo = (src) =>
    new Promise((resolve, reject) => {
      const v = document.createElement("video");
      v.src = src;
      v.muted = true;
      v.playsInline = true;
      v.preload = "auto";

      const done = () => {
        cleanup();
        resolve(src);
      };
      const fail = (e) => {
        cleanup();
        reject(e);
      };
      const cleanup = () => {
        v.removeEventListener("loadeddata", done);
        v.removeEventListener("canplay", done);
        v.removeEventListener("error", fail);
      };

      // ✅ loadeddata suele llegar antes que canplaythrough y ayuda a arrancar rápido
      v.addEventListener("loadeddata", done, { once: true });
      v.addEventListener("canplay", done, { once: true });
      v.addEventListener("error", fail, { once: true });

      v.load();
    });

  const swapVideoSource = async (nextSrc) => {
    const video = videoRef.current;
    if (!video) return;

    const wasPlaying = !video.paused;
    const t = video.currentTime || 0;

    setVideoSrc(nextSrc);

    requestAnimationFrame(() => {
      const v = videoRef.current;
      if (!v) return;

      const onReady = () => {
        v.removeEventListener("loadedmetadata", onReady);
        v.removeEventListener("loadeddata", onReady);
        v.removeEventListener("canplay", onReady);

        try { v.currentTime = t; } catch {}
        if (wasPlaying) v.play().catch(() => {});
      };

      v.addEventListener("loadedmetadata", onReady, { once: true });
      v.addEventListener("loadeddata", onReady, { once: true });
      v.addEventListener("canplay", onReady, { once: true });
    });
  };

  // ✅ pipeline low -> mid -> high
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setVideoSrc(LOW_SRC);

      const video = videoRef.current;
      if (!video) return;

      // ✅ fuerza el inicio de fetch lo más pronto posible
      try { video.load(); } catch {}

      const waitFirstPlayable = () =>
        new Promise((resolve) => {
          const onReady = () => {
            cleanup();
            resolve();
          };
          const cleanup = () => {
            video.removeEventListener("loadeddata", onReady);
            video.removeEventListener("canplay", onReady);
          };
          video.addEventListener("loadeddata", onReady);
          video.addEventListener("canplay", onReady);
        });

      await waitFirstPlayable();
      if (cancelled) return;

      setVideoLoaded(true);
      video.play().catch(() => {});

      try {
        await preloadVideo(MID_SRC);
        if (cancelled) return;
        await swapVideoSource(MID_SRC);
      } catch {}

      try {
        await preloadVideo(HIGH_SRC);
        if (cancelled) return;
        await swapVideoSource(HIGH_SRC);
      } catch {}
    };

    run();
    return () => { cancelled = true; };
  }, []);

  // ✅ click al título => scroll a #contacto
  const goToContacto = () => {
    const el = document.getElementById("contacto");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.location.hash = "#contacto";
  };

  // GSAP (sin cambios)
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
    script.onload = () => {
      if (window.gsap) {
        const masterTl = window.gsap.timeline();

        if (titleRef.current) {
          const titleWords = titleRef.current.querySelectorAll('.word');

          window.gsap.set(titleWords, {
            y: 80,
            opacity: 0,
            rotationX: -45
          });

          masterTl.to(titleWords, {
            y: 0,
            opacity: 1,
            rotationX: 0,
            duration: 8.8,
            stagger: 0.35,
            ease: "back.out(1.4)"
          });
        }

        if (imageContainerRef.current) {
          const getTargetSize = () => {
            const screenWidth = window.innerWidth;
            if (screenWidth >= 1024) return { width: '100%', height: '100%' };
            if (screenWidth >= 768) return { width: '100%', height: '100%' };
            return { width: '100%', height: '100%' };
          };

          const targetSize = getTargetSize();

          window.gsap.set(imageContainerRef.current, {
            width: '18rem',
            height: '18rem',
            opacity: 0,
            scale: 0.9
          });

          masterTl.to(imageContainerRef.current, {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "power2.out"
          }, 0.4)
          .to(imageContainerRef.current, {
            width: targetSize.width,
            height: targetSize.height,
            duration: 1.2,
            ease: "power3.inOut"
          }, 0.7);
        }

        const elementDelays = [0.9, 1.1, 0.5, 1.3, 1.5, 1.7];

        elementsRef.current.forEach((el, index) => {
          if (el) {
            window.gsap.set(el, { opacity: 0, y: 20 });
            masterTl.to(el, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out"
            }, elementDelays[index] || 1.0 + (index * 0.1));
          }
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#F2F2F2] relative overflow-hidden isolate">
      {/* Top Center - Brand */}
      <div
        ref={el => elementsRef.current[0] = el}
        className="absolute top-24 inset-x-0 z-30 flex justify-center"
      >
        <div className="text-xs tracking-widest text-white uppercase font-light drop-shadow-lg text-center">
          Cinematografía Nupcial
        </div>
      </div>

      {/* Main Title */}
      <div
        className="absolute left-1/2 z-30 w-screen px-4"
        style={{
          top: "calc(80px + (100vh - 80px) / 2)",
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* ✅ hover grande + click a contacto */}
        <div ref={el => elementsRef.current[2] = el} className="w-full flex justify-center">
          <button
            type="button"
            onClick={goToContacto}
            className="
              group text-left
              cursor-pointer
              select-none
              focus:outline-none
              focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
            "
            aria-label="Ir a contacto"
          >
            <h1
              ref={titleRef}
              className="
                font-light text-[#F2F2F2] mb-8 lg:mb-16 text-center leading-[0.9] max-w-[92vw]
                transition-transform duration-300 ease-out
                group-hover:scale-[1.03]
              "
            >
              <span className="word inline-block text-xl transition-all duration-300 group-hover:tracking-[0.22em]">
                Presente
              </span>
              <br />
              <span
                className="word italic font-serif inline-block transition-transform duration-300 group-hover:scale-[1.02]"
                style={{ fontSize: "clamp(2.5rem, 4vw, 11rem)" }}
              >
                Nuestro
              </span>
            </h1>
          </button>
        </div>
      </div>

      {/* Center Video Container */}
      <div ref={imageContainerRef} className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="relative w-full h-full overflow-hidden">
          {!videoLoaded && (
            <img
              src={STILL_SRC}
              alt="Loading..."
              loading="eager"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          <video
            ref={videoRef}
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              videoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />

          <div className="absolute inset-0 bg-black/30"></div>
        </div>
      </div>

      {/* Bottom Center - Scroll Hint */}
      <div
        ref={el => elementsRef.current[5] = el}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-xs tracking-widest text-white uppercase font-light z-30"
      >
        Scroll para descubrir
      </div>
    </div>
  );
};

export default WeddingVideoComponent;
