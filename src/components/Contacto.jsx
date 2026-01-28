import React, { useState } from 'react';
import { MessageCircle, Send, Mail } from 'lucide-react';
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';

const Contacto = () => {
  const [formData, setFormData] = useState({
    parejaNombres: '',
    fechaBoda: '',
    weddingPlanner: '',
    ubicacionVenue: '',
    numeroInvitados: '',
    email: '',
    telefono: '',
    otrosContactos: '',
    visionCreativa: '',
    aspectosEmocionantes: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  
  const EMAILJS_SERVICE_ID = 'service_9ypzsdp';
  const EMAILJS_TEMPLATE_ID = 'template_wf3xtwj';
  const EMAILJS_PUBLIC_KEY = 'JTkgeHf5iUW7v_C28';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const required = [
      'parejaNombres', 
      'fechaBoda', 
      'weddingPlanner', 
      'ubicacionVenue', 
      'numeroInvitados', 
      'email', 
      'telefono', 
      'visionCreativa', 
      'aspectosEmocionantes'
    ];
    
    return required.every(field => {
      const value = formData[field];
      return value !== null && value !== undefined && String(value).trim() !== '';
    });
  };

  const showAlert = (type, title, text) => {
    Swal.fire({
      icon: type,
      title: title,
      text: text,
      confirmButtonColor: '#000000',
      background: '#ffffff',
      color: '#000000',
      customClass: {
        popup: 'rounded-none',
        confirmButton: 'rounded-none px-6 py-2 text-white bg-black hover:bg-gray-800'
      }
    });
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showAlert('error', 'Información incompleta', 'Por favor, completa todos los campos obligatorios marcados con *');
      return;
    }

    setIsLoading(true);

    try {
      const templateParams = {
        pareja_nombres: formData.parejaNombres,
        fecha_boda: formData.fechaBoda,
        wedding_planner: formData.weddingPlanner,
        ubicacion_venue: formData.ubicacionVenue,
        numero_invitados: formData.numeroInvitados,
        email: formData.email,
        telefono: formData.telefono,
        otros_contactos: formData.otrosContactos || 'No especificado',
        vision_creativa: formData.visionCreativa,
        aspectos_emocionantes: formData.aspectosEmocionantes,
      };

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      console.log('EmailJS Response:', response);

      showAlert('success', 'Mensaje enviado', 'Hemos recibido tu información. Te contactaremos pronto para comenzar a planear juntos tu día especial.');
      
      // Reset form
      setFormData({
        parejaNombres: '',
        fechaBoda: '',
        weddingPlanner: '',
        ubicacionVenue: '',
        numeroInvitados: '',
        email: '',
        telefono: '',
        otrosContactos: '',
        visionCreativa: '',
        aspectosEmocionantes: ''
      });
    } catch (error) {
      console.error('Error completo:', error);
      console.error('Error status:', error.status);
      console.error('Error text:', error.text);
      showAlert('error', 'Error al enviar', `Hubo un problema al enviar tu mensaje: ${error.text || error.message}. Por favor, intenta nuevamente.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsAppSubmit = () => {
    if (!validateForm()) {
      showAlert('error', 'Información incompleta', 'Por favor, completa todos los campos obligatorios marcados con *');
      return;
    }

    const message = `¡Hola! Me gustaría consultar sobre sus servicios de fotografía de bodas.

*Información de la pareja:*
Nombres: ${formData.parejaNombres}
Fecha de boda: ${formData.fechaBoda}
Wedding Planner: ${formData.weddingPlanner}
Ubicación y venue: ${formData.ubicacionVenue}
Número de invitados: ${formData.numeroInvitados}

*Contacto:*
Email: ${formData.email}
Teléfono: ${formData.telefono}
${formData.otrosContactos ? `Otros contactos: ${formData.otrosContactos}` : ''}

*Visión creativa:*
${formData.visionCreativa}

*Aspectos más emocionantes:*
${formData.aspectosEmocionantes}

¡Espero su respuesta!`;

    const whatsappUrl = `https://wa.me/+5218110000000?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleWhatsAppCTA = () => {
    const message = "¡Hola! Me gustaría conocer más sobre sus servicios de fotografía de bodas. ¿Podrían enviarme información?";
    const whatsappUrl = `https://wa.me/+5218110000000?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-light text-gray-900 mb-6">
            Contacto
          </h1>
          <p className="text-xl font-light text-gray-600 mb-8">
            Cuéntanos sobre tu día especial y comencemos a crear juntos
          </p>
          
          {/* CTA WhatsApp */}
          <button
            onClick={handleWhatsAppCTA}
            className="inline-flex items-center space-x-3 bg-black text-white px-8 py-4 hover:bg-gray-800 transition-colors duration-300 group"
          >
            <MessageCircle size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-light">Consulta rápida por WhatsApp</span>
          </button>
        </div>

        {/* Form */}
        <div className="bg-white p-8 md:p-12 shadow-sm">
          <h2 className="text-3xl font-light text-gray-900 mb-8 text-center">
            Formulario de consulta
          </h2>
          
          <form onSubmit={handleEmailSubmit} className="space-y-8">
            {/* Nombres de la pareja */}
            <div>
              <label className="block text-sm font-light text-gray-900 mb-2">
                Nombres de la pareja *
              </label>
              <input
                type="text"
                name="parejaNombres"
                value={formData.parejaNombres}
                onChange={handleChange}
                className="w-full border-b border-gray-300 focus:border-black outline-none py-2 font-light text-gray-900 bg-transparent"
                placeholder="Nombre y Nombre"
              />
            </div>

            {/* Fecha de boda - Estilo Apple */}
            <div>
              <label className="block text-sm font-light text-gray-900 mb-3">
                Fecha de la boda *
              </label>
              <input
                type="date"
                name="fechaBoda"
                value={formData.fechaBoda}
                onChange={handleChange}
                className="w-full px-4 py-4 text-lg font-light text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:border-black focus:ring-2 focus:ring-black focus:ring-opacity-20 outline-none transition-all"
                style={{
                  colorScheme: 'light'
                }}
              />
            </div>

            {/* Wedding Planner */}
            <div>
              <label className="block text-sm font-light text-gray-900 mb-2">
                Wedding Planner *
              </label>
              <input
                type="text"
                name="weddingPlanner"
                value={formData.weddingPlanner}
                onChange={handleChange}
                className="w-full border-b border-gray-300 focus:border-black outline-none py-2 font-light text-gray-900 bg-transparent"
                placeholder="Nombre del wedding planner o 'No tengo'"
              />
            </div>

            {/* Ubicación y venue */}
            <div>
              <label className="block text-sm font-light text-gray-900 mb-2">
                Ubicación del evento y venue *
              </label>
              <input
                type="text"
                name="ubicacionVenue"
                value={formData.ubicacionVenue}
                onChange={handleChange}
                className="w-full border-b border-gray-300 focus:border-black outline-none py-2 font-light text-gray-900 bg-transparent"
                placeholder="Ciudad, estado y nombre del venue"
              />
            </div>

            {/* Número de invitados - Estilo Apple con input number mejorado */}
            <div>
              <label className="block text-sm font-light text-gray-900 mb-3">
                Número de invitados *
              </label>
              <input
                type="number"
                name="numeroInvitados"
                value={formData.numeroInvitados}
                onChange={handleChange}
                min="1"
                max="1000"
                className="w-full px-4 py-4 text-lg font-light text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:border-black focus:ring-2 focus:ring-black focus:ring-opacity-20 outline-none transition-all"
                placeholder="Ej: 150"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-light text-gray-900 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border-b border-gray-300 focus:border-black outline-none py-2 font-light text-gray-900 bg-transparent"
                placeholder="tu@email.com"
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-light text-gray-900 mb-2">
                Teléfono *
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full border-b border-gray-300 focus:border-black outline-none py-2 font-light text-gray-900 bg-transparent"
                placeholder="+52 81 1234 5678"
              />
            </div>

            {/* Otros contactos */}
            <div>
              <label className="block text-sm font-light text-gray-900 mb-2">
                Otras formas de contactarte
              </label>
              <input
                type="text"
                name="otrosContactos"
                value={formData.otrosContactos}
                onChange={handleChange}
                className="w-full border-b border-gray-300 focus:border-black outline-none py-2 font-light text-gray-900 bg-transparent"
                placeholder="Instagram, LinkedIn, etc. (opcional)"
              />
            </div>

            {/* Visión creativa */}
            <div>
              <label className="block text-sm font-light text-gray-900 mb-2">
                Describe tu visión creativa para tu boda. ¿Cuáles son los elementos visuales o temáticos clave que imaginas? *
              </label>
              <textarea
                name="visionCreativa"
                value={formData.visionCreativa}
                onChange={handleChange}
                rows={4}
                maxLength={5000}
                className="w-full border-b border-gray-300 focus:border-black outline-none py-2 font-light text-gray-900 bg-transparent resize-none"
                placeholder="Describe tu estilo, colores, ambiente, inspiraciones..."
              />
              <div className="text-xs text-gray-400 mt-1 text-right">
                {formData.visionCreativa.length}/5000
              </div>
            </div>

            {/* Aspectos emocionantes */}
            <div>
              <label className="block text-sm font-light text-gray-900 mb-2">
                ¿Qué aspectos específicos de tu día de boda te emocionan más y por qué? *
              </label>
              <textarea
                name="aspectosEmocionantes"
                value={formData.aspectosEmocionantes}
                onChange={handleChange}
                rows={4}
                className="w-full border-b border-gray-300 focus:border-black outline-none py-2 font-light text-gray-900 bg-transparent resize-none"
                placeholder="Los momentos que más esperas, tradiciones especiales, sorpresas..."
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-black text-white py-4 px-8 hover:bg-gray-800 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Mail size={18} />
                <span className="font-light">
                  {isLoading ? 'Enviando...' : 'Enviar formulario'}
                </span>
              </button>
              
              <button
                type="button"
                onClick={handleWhatsAppSubmit}
                className="flex-1 border border-black text-black py-4 px-8 hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <MessageCircle size={18} />
                <span className="font-light">Enviar por WhatsApp</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contacto;