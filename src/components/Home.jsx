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

  // Auto-change copy every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCopy((prev) => (prev + 1) % poeticCopy.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [poeticCopy.length]);

  // Handle video loading
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleCanPlay = () => {
        setVideoLoaded(true);
        video.play().catch(() => {}); // fuerza el play al cargar
      };
      
      video.addEventListener('canplay', handleCanPlay);
      
      return () => {
        video.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, []);

  // GSAP Animation on component mount
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
    script.onload = () => {
      if (window.gsap) {
        const masterTl = window.gsap.timeline();

        if (titleRef.current) {
          const titleWords = titleRef.current.querySelectorAll('.word');
          
          window.gsap.set(titleWords, {
            y: 60,
            opacity: 0,
            rotationX: -45
          });
          
          masterTl.to(titleWords, {
            y: 0,
            opacity: 1,
            rotationX: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "back.out(1.4)"
          });
        }

        if (imageContainerRef.current) {
          const getTargetSize = () => {
            const screenWidth = window.innerWidth;
            if (screenWidth >= 1024) {
              return { width: '100vw', height: '100vh' };
            } else if (screenWidth >= 768) {
              return { width: '70rem', height: '60rem' };
            } else {
              return { width: '24rem', height: '40rem' };
            }
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
            window.gsap.set(el, {
              opacity: 0,
              y: 20
            });
            
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
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white relative p-4 lg:p-8 mt-10 overflow-x-hidden">
      
      {/* Top Left - Brand/Year */}
      <div ref={el => elementsRef.current[0] = el} className="absolute top-8 left-8 text-xs tracking-widest text-gray-400 uppercase font-light z-30">
        <div className="mb-2 sm:mb-0">Cinematografía<br className="block sm:hidden" /> Nupcial</div>
        <div className="text-gray-300">Desde 2019</div>
      </div>

      {/* Top Right - Navigation Menu */}
      <div ref={el => elementsRef.current[1] = el} className="absolute top-8 right-8 text-xs tracking-widest text-gray-400 uppercase font-light space-y-1 text-right z-30">
        <div className="sm:inline">Nos adaptamos</div>
        <div className="sm:inline"> a tu gran<br className="block sm:hidden" /> momento.</div>
      </div>

      {/* Main Title */}
      <div ref={el => elementsRef.current[2] = el} className="absolute !absolute top-[45%] !top-[45%] left-1/2 !left-1/2 transform !transform -translate-x-1/2 !-translate-x-1/2 -translate-y-1/2 !-translate-y-1/2 z-20 text-center !text-center lg:z-30">
        <h1 ref={titleRef} className="text-4xl md:text-6xl lg:text-[8rem] xl:text-[11rem] font-light leading-none text-white mb-8 lg:mb-16 text-center !text-center">
          <span className="word inline-block">Momentos</span>
          <br />
          <span className="word italic font-serif inline-block">Eternos</span>
        </h1>
      </div>

      {/* Center Video Container */}
      <div ref={imageContainerRef} className="absolute inset-0 w-full h-full lg:w-screen lg:h-screen overflow-hidden">
        <div className="relative w-full h-full overflow-hidden">
          
          {/* Lazy Loading Image */}
          {!videoLoaded && (
            <img 
              src="img/lazyloadinghome.webp" 
              alt="Loading..."
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* Background Video */}
          <video 
            ref={videoRef}
            src="img/arhomevideo.mp4"
            autoPlay
            muted
            loop
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              videoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Video overlay for better text readability on desktop */}
          <div className="hidden lg:block absolute inset-0 bg-black/20"></div>
        </div>
      </div>

      {/* Bottom Left - Poetic Copy */}
      <div ref={el => elementsRef.current[3] = el} className="absolute bottom-20 left-8 max-w-xs lg:max-w-sm z-30">
        <div className="w-12 h-px bg-gray-300 lg:bg-white mb-4"></div>
        <p className="text-lg lg:text-xl font-light text-gray-600 lg:text-white leading-relaxed mb-6">
          {poeticCopy[currentCopy]}
        </p>
        <button className="group flex items-center space-x-2 text-xs tracking-widest uppercase text-gray-900 lg:text-white hover:text-gray-600 lg:hover:text-gray-300 transition-colors duration-300">
          <span>Descubrir<br className="block sm:hidden" /> nuestro trabajo</span>
          <div className="w-6 h-px bg-gray-900 lg:bg-white group-hover:w-10 transition-all duration-300"></div>
        </button>
      </div>

      {/* Bottom Right - Video Meta */}
      <div ref={el => elementsRef.current[4] = el} className="absolute bottom-20 right-8 text-right z-30">
        <div className="text-xs text-gray-400 lg:text-white/70 font-light mb-2">
          <span>Video Principal</span>
        </div>
        <div className="text-xs tracking-wider uppercase font-light text-gray-400 lg:text-white/70 max-w-32">
          Cinematografía Nupcial
        </div>
      </div>

      {/* Bottom Center - Scroll Hint */}
      <div ref={el => elementsRef.current[5] = el} className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-xs tracking-widest text-gray-300 lg:text-white/50 uppercase font-light z-30">
        Scroll para<br className="block sm:hidden" /> descubrir
      </div>

    </div>
  );
};

export default WeddingVideoComponent;