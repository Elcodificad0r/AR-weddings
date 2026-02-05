// ✅ SOLO CAMBIOS: el recuadro ahora usa un STILL (lazy) y luego carga/reproduce el video
// ✅ No se toca nada más del componente

import React, { useEffect, useRef, useState } from "react";
import { MessageCircle, Mail } from "lucide-react";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";
import gsap from "gsap";

const Contacto = () => {
  const [formData, setFormData] = useState({
    parejaNombres: "",
    fechaBoda: "",
    email: "",
    telefono: "",
    mensaje: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  // Refs GSAP
  const wrapRef = useRef(null);
  const formColRef = useRef(null);
  const imageColRef = useRef(null);

  // ✅ Wrapper = posicionamiento, Inner = animación (para que GSAP no rompa el translate)
  const collageRef = useRef(null);
  const collageAnimRef = useRef(null);

  const BG_IMAGE = "img/contact-bg.webp";
  const VIDEO_SRC = "img/contact-loop.mp4";
  const VIDEO_STILL = "img/contact-loop-still.webp"; // ✅ nuevo still

  const EMAILJS_SERVICE_ID = "service_9ypzsdp";
  const EMAILJS_TEMPLATE_ID = "template_wf3xtwj";
  const EMAILJS_PUBLIC_KEY = "JTkgeHf5iUW7v_C28";

  // ✅ Lazy control del video overlay
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([formColRef.current, imageColRef.current], { opacity: 0 });
      gsap.set(formColRef.current, { x: 18 });
      gsap.set(imageColRef.current, { x: -18 });

      // ✅ Animamos SOLO el inner
      gsap.set(collageAnimRef.current, {
        opacity: 0,
        scale: 0.96,
        transformOrigin: "50% 50%",
      });

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      tl.to(imageColRef.current, { opacity: 1, x: 0, duration: 0.9 }, 0)
        .to(formColRef.current, { opacity: 1, x: 0, duration: 0.9 }, 0.05)
        .to(collageAnimRef.current, { opacity: 1, scale: 1, duration: 0.8 }, 0.4);
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  // ✅ IntersectionObserver: carga video cuando el recuadro entra en viewport
  useEffect(() => {
    const el = collageRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const isIn = entries[0]?.isIntersecting;
        if (isIn) {
          setVideoReady(true);
          io.disconnect();
        }
      },
      { root: null, threshold: 0.15 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  // ✅ cuando el video esté listo, intenta reproducir (por si el navegador lo permite)
  useEffect(() => {
    if (!videoReady) return;
    const v = videoRef.current;
    if (!v) return;
    const play = async () => {
      try {
        await v.play();
      } catch {
        // si el navegador bloquea autoplay, no hacemos nada (sigue el still / primer frame)
      }
    };
    play();
  }, [videoReady]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const required = ["parejaNombres", "fechaBoda", "email", "telefono", "mensaje"];
    return required.every((field) => String(formData[field] ?? "").trim() !== "");
  };

  const showAlert = (type, title, text) => {
    Swal.fire({
      icon: type,
      title,
      text,
      confirmButtonColor: "#000000",
      background: "#ffffff",
      color: "#000000",
      customClass: {
        popup: "rounded-none",
        confirmButton: "rounded-none px-6 py-2 text-white bg-black hover:bg-gray-800",
      },
    });
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showAlert("error", "Información incompleta", "Por favor, completa todos los campos obligatorios marcados con *");
      return;
    }

    setIsLoading(true);

    try {
      const templateParams = {
        pareja_nombres: formData.parejaNombres,
        fecha_boda: formData.fechaBoda,
        email: formData.email,
        telefono: formData.telefono,
        mensaje: formData.mensaje,
      };

      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);

      showAlert("success", "Mensaje enviado", "Hemos recibido tu información. Te contactaremos pronto para comenzar a planear juntos tu día especial.");

      setFormData({
        parejaNombres: "",
        fechaBoda: "",
        email: "",
        telefono: "",
        mensaje: "",
      });
    } catch (error) {
      showAlert("error", "Error al enviar", `Hubo un problema al enviar tu mensaje: ${error.text || error.message}. Por favor, intenta nuevamente.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsAppSubmit = () => {
    if (!validateForm()) {
      showAlert("error", "Información incompleta", "Por favor, completa todos los campos obligatorios marcados con *");
      return;
    }

    const message = `¡Hola! Me gustaría consultar sobre sus servicios de fotografía de bodas.

*Información de la pareja:*
Nombres: ${formData.parejaNombres}
Fecha de boda: ${formData.fechaBoda}

*Contacto:*
Email: ${formData.email}
Teléfono: ${formData.telefono}

*Mensaje:*
${formData.mensaje}

¡Espero su respuesta!`;

    const whatsappUrl = `https://wa.me/5218180772959?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleWhatsAppCTA = () => {
    const message = "¡Hola! Me gustaría conocer más sobre sus servicios de fotografía de bodas. ¿Podrían enviarme información?";
    const whatsappUrl = `https://wa.me/5218180772959?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div ref={wrapRef} className="bg-[#F2F2F2] w-full">
      {/* Formato 21:9 - Muy horizontal y compacto */}
      <div className="relative grid md:grid-cols-2 h-auto md:h-[70vh] overflow-hidden bg-[#F2F2F2]">
        {/* LEFT: IMAGE */}
        <div
          ref={imageColRef}
          className="relative min-h-[320px] md:min-h-0 md:h-full overflow-hidden bg-black order-1 md:order-1"
        >
          <img src={BG_IMAGE} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/10" />

          {/* Botones en la esquina inferior izquierda */}
          <div className="absolute bottom-6 left-6 flex flex-col gap-2 z-20">
            <button
              type="button"
              onClick={() => window.open("https://www.instagram.com/ar_weddingfilms/", "_blank")}
              className="
                inline-flex items-center justify-center
                px-4 py-1.5
                border border-white/50
                text-white
                text-[10px] tracking-[0.2em] uppercase font-light
                hover:bg-white hover:text-black transition-all duration-300
                w-fit
              "
            >
              Instagram
            </button>
            <button
              type="button"
              onClick={() => window.open("https://vimeo.com/arweddings", "_blank")}
              className="
                inline-flex items-center justify-center
                px-4 py-1.5
                border border-white/50
                text-white
                text-[10px] tracking-[0.2em] uppercase font-light
                hover:bg-white hover:text-black transition-all duration-300
                w-fit
              "
            >
              Vimeo
            </button>
          </div>
        </div>

        {/* RIGHT: FORM - Compacto y alineado a la derecha */}
        <div
          ref={formColRef}
          className="
            bg-[#F2F2F2]
            px-6 sm:px-8 md:px-10 lg:px-16
            pt-6 md:pt-8
            pb-6 md:pb-8
            flex items-center justify-end
            order-2 md:order-2
          "
        >
          <div className="w-full max-w-md ml-auto md:mr-12">
            {/* Header muy compacto */}
            <div className="mb-5">
              <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-1.5">Contacto</h1>
              <p className="text-xs md:text-sm font-light text-gray-600 mb-3">
                Cuéntanos sobre tu día especial y comencemos a crear juntos.
              </p>

              <button
                onClick={handleWhatsAppCTA}
                className="
                  inline-flex items-center gap-2
                  bg-black text-white px-5 py-2.5
                  hover:bg-gray-800 transition-colors duration-300
                  text-xs
                "
              >
                <MessageCircle size={16} />
                <span className="font-light">Consulta rápida por WhatsApp</span>
              </button>
            </div>

            {/* Form super compacto */}
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-gray-900 mb-1.5 uppercase tracking-[0.15em]">
                  Nombres de la pareja *
                </label>
                <input
                  type="text"
                  name="parejaNombres"
                  value={formData.parejaNombres}
                  onChange={handleChange}
                  required
                  className="w-full border-b border-gray-300 focus:border-black outline-none py-1 font-light text-gray-900 bg-transparent text-sm"
                  placeholder="Tu nombre y el de tu pareja"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-gray-900 mb-1.5 uppercase tracking-[0.15em]">
                  Fecha de la boda *
                </label>
                <input
                  type="date"
                  name="fechaBoda"
                  value={formData.fechaBoda}
                  onChange={handleChange}
                  required
                  className="w-full border-b border-gray-300 focus:border-black outline-none py-1 font-light text-gray-900 bg-transparent text-sm"
                  style={{ colorScheme: "light" }}
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-gray-900 mb-1.5 uppercase tracking-[0.15em]">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border-b border-gray-300 focus:border-black outline-none py-1 font-light text-gray-900 bg-transparent text-sm"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-gray-900 mb-1.5 uppercase tracking-[0.15em]">
                  Celular *
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  className="w-full border-b border-gray-300 focus:border-black outline-none py-1 font-light text-gray-900 bg-transparent text-sm"
                  placeholder="+52 81 1234 5678"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-gray-900 mb-1.5 uppercase tracking-[0.15em]">
                  Cuéntennos sobre su boda *
                </label>
                <textarea
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                  rows={3}
                  maxLength={5000}
                  className="w-full border-b border-gray-300 focus:border-black outline-none py-1 font-light text-gray-900 bg-transparent resize-none text-sm"
                  placeholder="Lugar, ciudad, invitados, estilo..."
                />
                <div className="text-[10px] text-gray-400 mt-0.5 text-right">{formData.mensaje.length}/5000</div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="
                    flex-1 border border-black text-black
                    py-2.5 px-4
                    hover:bg-black hover:text-white transition-all duration-300
                    disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2
                    text-xs
                  "
                >
                  <Mail size={16} />
                  <span className="font-light">{isLoading ? "Enviando..." : "Enviar"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppSubmit}
                  className="
                    flex-1 border border-black text-black
                    py-2.5 px-4
                    hover:bg-black hover:text-white transition-all duration-300
                    flex items-center justify-center gap-2
                    text-xs
                  "
                >
                  <MessageCircle size={16} />
                  <span className="font-light">WhatsApp</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ✅ VIDEO OVERLAY: wrapper centrado estable (GSAP NO toca su transform) */}
        <div
          ref={collageRef}
          className="
            pointer-events-none
            absolute

            /* Mobile */
            right-4 top-[15%]
            w-[45%]
            max-w-[180px]

            /* ✅ Desktop: centrado EXACTO entre columnas y un poco hacia la izquierda para no tapar form */
            md:!left-1/2
            md:!top-1/2
            md:!-translate-y-1/2
            md:!-translate-x-1/2
            md:!ml-[-15px]
            md:!w-[20vw] lg:!w-[20vw]
            md:!max-w-[600px]

            aspect-square
            z-10 md:z-50
          "
        >
          {/* ✅ Inner: aquí animamos opacity/scale */}
          <div
            ref={collageAnimRef}
            className="
              w-full h-full
              shadow-2xl
              overflow-hidden
              rounded-xs
              relative
            "
          >
            {/* ✅ STILL (siempre visible) */}
            <img
              src={VIDEO_STILL}
              alt="Video preview"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover grayscale"
            />

            {/* ✅ VIDEO (se monta cuando entra a viewport) */}
            {videoReady && (
              <video
                ref={videoRef}
                src={VIDEO_SRC}
                className="absolute inset-0 w-full h-full object-cover grayscale"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            )}

            <div className="absolute inset-0 bg-black/5" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
