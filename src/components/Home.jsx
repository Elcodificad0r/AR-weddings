import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const WeddingVideoComponent = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const imageContainerRef = useRef(null);
  const titleRef = useRef(null);
  const elementsRef = useRef([]);
  
  const images = [
    { color: "bg-stone-200", alt: "Pareja en ceremonia" },
    { color: "bg-neutral-300", alt: "Intercambio de anillos" },
    { color: "bg-gray-200", alt: "Primer baile" },
    { color: "bg-stone-300", alt: "Momento íntimo" }
  ];

  const poeticCopy = [
    "Capturamos la esencia de tu amor",
    "Cada mirada, un verso eterno",
    "Tu historia merece ser inmortal",
    "Donde el tiempo se detiene"
  ];

  // Auto-change images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  // GSAP Animation on component mount
  useEffect(() => {
    // Load GSAP from CDN
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
    script.onload = () => {
      if (window.gsap) {
        // Create master timeline for orchestrated sequence
        const masterTl = window.gsap.timeline();

        // Title animation - FIRST and fastest
        if (titleRef.current) {
          const titleWords = titleRef.current.querySelectorAll('.word');
          
          // Set initial state for title words
          window.gsap.set(titleWords, {
            y: 60,
            opacity: 0,
            rotationX: -45
          });
          
          // Add title animation to master timeline (starts immediately)
          masterTl.to(titleWords, {
            y: 0,
            opacity: 1,
            rotationX: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "back.out(1.4)"
          });
        }

        // Image container animation - OVERLAPPING with title
        if (imageContainerRef.current) {
          // Get current screen size to determine target dimensions
          const getTargetSize = () => {
            const screenWidth = window.innerWidth;
            if (screenWidth >= 1024) { // lg breakpoint
              return { width: '90rem', height: '70rem' };
            } else if (screenWidth >= 768) { // md breakpoint
              return { width: '70rem', height: '60rem' };
            } else {
              return { width: '24rem', height: '40rem' }; // mobile w-96 h-[40rem]
            }
          };
          
          const targetSize = getTargetSize();
          
          // Set initial state - 1:1 aspect ratio (square)
          window.gsap.set(imageContainerRef.current, {
            width: '18rem',
            height: '18rem',
            opacity: 0,
            scale: 0.9
          });
          
          // Add image animation to master timeline (starts at 0.4s)
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

        // Other elements animation - STAGGERED elegantly
        const elementDelays = [0.9, 1.1, 0.5, 1.3, 1.5, 1.7]; // Custom delays for each element
        
        elementsRef.current.forEach((el, index) => {
          if (el) {
            window.gsap.set(el, {
              opacity: 0,
              y: 20
            });
            
            // Add each element to master timeline with custom delay
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
    
    // Cleanup
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="min-h-screen bg-white !bg-white relative p-4 lg:p-8 !p-4 lg:!p-8 mt-10">
      
      {/* Top Left - Brand/Year */}
      <div ref={el => elementsRef.current[0] = el} className="absolute !absolute top-8 !top-8 left-8 !left-8 text-xs !text-xs tracking-widest !tracking-widest text-gray-400 !text-gray-400 uppercase !uppercase font-light !font-light">
        <div className="mb-2 !mb-2 sm:mb-0 !sm:mb-0">Cinematografía<br className="block sm:hidden !block sm:!hidden" /> Nupcial</div>
        <div className="text-gray-300 !text-gray-300">Desde 2019</div>
      </div>

      {/* Top Right - Navigation Menu */}
      <div ref={el => elementsRef.current[1] = el} className="absolute !absolute top-8 !top-8 right-8 !right-8 text-xs !text-xs tracking-widest !tracking-widest text-gray-400 !text-gray-400 uppercase !uppercase font-light !font-light space-y-1 !space-y-1 text-right !text-right">
        <div className="sm:inline !sm:inline">Nos adaptamos</div>
        <div className="sm:inline !sm:inline"> a tu gran<br className="block sm:hidden !block sm:!hidden" /> momento.</div>
      </div>

      {/* Main Title */}
      <div ref={el => elementsRef.current[2] = el} className="absolute !absolute top-1/2 !top-1/2 left-1/2 !left-1/2 transform !transform -translate-x-1/2 !-translate-x-1/2 -translate-y-full !-translate-y-full z-20 !z-20 text-center !text-center">
        <h1 ref={titleRef} className="text-5xl !text-5xl md:text-6xl !md:text-6xl lg:text-[9rem] !lg:text-[9rem] xl:text-[12rem] !xl:text-[12rem] font-light !font-light leading-none !leading-none text-gray-900 !text-gray-900 mb-8 !mb-8 lg:mb-16 !lg:mb-16">
          <span className="word inline-block">Momentos</span>
          <br className="!block" />
          <span className="word italic !italic font-serif !font-serif inline-block">Eternos</span>
        </h1>
      </div>

      {/* Center Image - MÁS GRANDE */}
      <div ref={imageContainerRef} className="absolute !absolute top-1/2 !top-1/2 left-1/2 !left-1/2 transform !transform -translate-x-1/2 !-translate-x-1/2 -translate-y-1/2 !-translate-y-1/2 w-96 !w-96 h-[40rem] !h-[40rem] md:w-[70rem] !md:w-[70rem] md:h-[60rem] !md:h-[60rem] lg:w-[90rem] !lg:w-[90rem] lg:h-[70rem] !lg:h-[70rem]">
        <div className="relative !relative w-full !w-full h-full !h-full overflow-hidden !overflow-hidden">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute !absolute inset-0 !inset-0 w-full !w-full h-full !h-full ${image.color} transition-opacity !transition-opacity duration-1000 !duration-1000 ${
                index === currentImage ? 'opacity-100 !opacity-100' : 'opacity-0 !opacity-0'
              }`}
            />
          ))}

          {/* Navigation Arrows */}
          <button
            onClick={prevImage}
            className="absolute !absolute left-4 !left-4 top-1/2 !top-1/2 transform !transform -translate-y-1/2 !-translate-y-1/2 w-8 !w-8 h-8 !h-8 flex !flex items-center !items-center justify-center !justify-center bg-white/10 !bg-white/10 backdrop-blur-sm !backdrop-blur-sm hover:bg-white/20 !hover:bg-white/20 transition-all !transition-all duration-300 !duration-300 group !group"
          >
            <ChevronLeft className="w-4 !w-4 h-4 !h-4 text-white !text-white group-hover:scale-110 !group-hover:scale-110 transition-transform !transition-transform duration-300 !duration-300" />
          </button>
          
          <button
            onClick={nextImage}
            className="absolute !absolute right-4 !right-4 top-1/2 !top-1/2 transform !transform -translate-y-1/2 !-translate-y-1/2 w-8 !w-8 h-8 !h-8 flex !flex items-center !items-center justify-center !justify-center bg-white/10 !bg-white/10 backdrop-blur-sm !backdrop-blur-sm hover:bg-white/20 !hover:bg-white/20 transition-all !transition-all duration-300 !duration-300 group !group"
          >
            <ChevronRight className="w-4 !w-4 h-4 !h-4 text-white !text-white group-hover:scale-110 !group-hover:scale-110 transition-transform !transition-transform duration-300 !duration-300" />
          </button>

          {/* Image Counter */}
          <div className="absolute !absolute bottom-4 !bottom-4 left-1/2 !left-1/2 transform !transform -translate-x-1/2 !-translate-x-1/2 flex !flex space-x-2 !space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`w-2 !w-2 h-2 !h-2 rounded-full !rounded-full transition-all !transition-all duration-300 !duration-300 ${
                  index === currentImage ? 'bg-white !bg-white' : 'bg-white/40 !bg-white/40 hover:bg-white/70 !hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Left - Poetic Copy */}
      <div ref={el => elementsRef.current[3] = el} className="absolute !absolute bottom-20 !bottom-20 left-8 !left-8 max-w-xs !max-w-xs lg:max-w-sm !lg:max-w-sm">
        <div className="w-12 !w-12 h-px !h-px bg-gray-300 !bg-gray-300 mb-4 !mb-4"></div>
        <p className="text-lg !text-lg lg:text-xl !lg:text-xl font-light !font-light text-gray-600 !text-gray-600 leading-relaxed !leading-relaxed mb-6 !mb-6">
          {poeticCopy[currentImage]}
        </p>
        <button className="group !group flex !flex items-center !items-center space-x-2 !space-x-2 text-xs !text-xs tracking-widest !tracking-widest uppercase !uppercase text-gray-900 !text-gray-900 hover:text-gray-600 !hover:text-gray-600 transition-colors !transition-colors duration-300 !duration-300">
          <span className="!inline sm:inline !sm:inline">Descubrir<br className="block sm:hidden !block sm:!hidden" /> nuestro trabajo</span>
          <div className="w-6 !w-6 h-px !h-px bg-gray-900 !bg-gray-900 group-hover:w-10 !group-hover:w-10 transition-all !transition-all duration-300 !duration-300"></div>
        </button>
      </div>

      {/* Bottom Right - Image Meta */}
      <div ref={el => elementsRef.current[4] = el} className="absolute !absolute bottom-20 !bottom-20 right-8 !right-8 text-right !text-right">
        <div className="text-xs !text-xs text-gray-400 !text-gray-400 font-light !font-light mb-2 !mb-2">
          <span className="!inline">
            {String(currentImage + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
          </span>
        </div>
        <div className="text-xs !text-xs tracking-wider !tracking-wider uppercase !uppercase font-light !font-light text-gray-400 !text-gray-400 max-w-32 !max-w-32">
          {images[currentImage].alt}
        </div>
      </div>

      {/* Bottom Center - Scroll Hint */}
      <div ref={el => elementsRef.current[5] = el} className="absolute !absolute bottom-8 !bottom-8 left-1/2 !left-1/2 transform !transform -translate-x-1/2 !-translate-x-1/2 text-xs !text-xs tracking-widest !tracking-widest text-gray-300 !text-gray-300 uppercase !uppercase font-light !font-light">
        Scroll para<br className="block sm:hidden !block sm:!hidden" /> descubrir
      </div>

    </div>
  );
};

export default WeddingVideoComponent;