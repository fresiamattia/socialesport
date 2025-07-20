'use client'; 

import { useState, FormEvent } from 'react';
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaClock } from 'react-icons/fa'; 

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    // Qui dovresti inviare i dati a un'API Route di Next.js o a un servizio esterno
    try {
      // Simula una chiamata API
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      
      console.log('Dati del modulo inviati:', formData);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' }); 
    } catch (error) {
      console.error('Errore nell\'invio del modulo:', error);
      setStatus('error');
      setErrorMessage('Si è verificato un errore durante l\'invio. Riprova più tardi.');
    }
  };

  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2817.3486395353147!2d7.636906476483441!3d45.048384271068886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478812c3f5a2f85b%3A0xc665b16e45b4c19a!2sCorso%20Siracusa%2C%2010%2C%2010137%20Torino%20TO!5e0!3m2!1sit!2sit!4v1700000000000!5m2!1sit!2sit";

  return (
    <div className="container mx-auto p-4 md:p-8 font-sans">
      {/* TITOLO H1 UNIFORMATO CON CLASSI GLOBALI */}
      <h1 className="page-title">
        Contatti
      </h1>
      <div className="title-separator mb-8"></div> {/* Aggiunto mb-8 per spaziatura */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Colonna delle Informazioni di Contatto */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6 font-heading">Dove Trovarci</h2>
          
          <div className="space-y-4 text-lg text-gray-700 mb-8">
            <p className="flex items-center">
              <FaMapMarkerAlt className="mr-3 text-[#38b5ad] text-2xl flex-shrink-0" />
              Corso Siracusa 10, 10137 Torino
            </p>
            <p className="flex items-center">
              <FaEnvelope className="mr-3 text-[#38b5ad] text-2xl flex-shrink-0" />
              <a href="mailto:segreteria@socialesport.it" className="hover:underline text-blue-600">segreteria@socialesport.it</a>
            </p>
            <p className="flex items-center">
              <FaPhone className="mr-3 text-[#38b5ad] text-2xl flex-shrink-0" />
              <a href="tel:+39011390240" className="hover:underline text-blue-600">011.390240</a>
            </p>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-6 font-heading">Orari Segreteria</h2>
          <div className="space-y-4 text-lg text-gray-700">
            <p className="flex items-start">
              <FaClock className="mr-3 text-[#38b5ad] text-2xl mt-1 flex-shrink-0" />
              <div>
                <span className="font-semibold block">Lunedì – Venerdì:</span>
                <span>9:00 – 13:00 e 14:00 – 20:00</span>
              </div>
            </p>
            <p className="flex items-start">
              <FaClock className="mr-3 text-[#38b5ad] text-2xl mt-1 flex-shrink-0" />
              <div>
                <span className="font-semibold block">Sabato:</span>
                <span>8:30 – 12:30</span>
              </div>
            </p>
          </div>
        </div>

        {/* Colonna del Modulo di Contatto */}
        <div className="bg-gray-50 p-6 md:p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 font-heading">Inviaci un Messaggio</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                Nome:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#38b5ad]"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#38b5ad]"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">
                Messaggio:
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#38b5ad]"
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="bg-[#38b5ad] text-white font-bold py-3 px-6 rounded-md hover:bg-[#2a9a93] transition-colors focus:outline-none focus:shadow-outline w-full text-lg"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Invio in corso...' : 'Invia Messaggio'}
            </button>

            {status === 'success' && (
              <p className="text-green-600 text-center mt-4">Messaggio inviato con successo! Ti risponderemo al più presto.</p>
            )}
            {status === 'error' && (
              <p className="text-red-600 text-center mt-4">{errorMessage}</p>
            )}
          </form>
        </div>
      </div>

      {/* Mappa - In fondo alla pagina */}
      <div className="mt-12 rounded-lg shadow-md overflow-hidden">
        <iframe
          src={mapEmbedUrl}
          width="100%"
          height="450" 
          style={{ border: 0 }}
          allowFullScreen={false} 
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Posizione di Sociale Sport ssd s.r.l. su Google Maps"
        ></iframe>
      </div>
    </div>
  );
}