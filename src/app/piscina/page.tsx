// src/app/piscina/page.tsx

import Image from 'next/image';
import Link from 'next/link';
import { FaDownload, FaArrowRight } from 'react-icons/fa'; // Importa l'icona di download e la nuova icona freccia

// URL base della tua installazione WordPress
const WORDPRESS_API_URL = 'http://mattiaf245.sg-host.com/wp-json/wp/v2';

// Interfaccia per i termini di tassonomia
interface CourseTerm {
  id: number;
  name: string;
  slug: string; // es: "piscina", "fitness", "multisport"
  taxonomy: string;
}

// Interfaccia per un singolo corso (Post)
interface Course {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string; alt_text: string }>;
    'wp:term'?: Array<CourseTerm[]>; // Array di array, dove il primo array potrebbe contenere le tipologie_corso
  };
  acf?: {
    sottotitolo?: string;
    brochure_piscina?: string; // Campo ACF per l'URL della brochure di Piscina
    ordine?: number; // Nuovo campo ACF per l'ordinamento
  };
}

// Funzione per recuperare tutti i corsi
async function getAllCourses(): Promise<Course[]> {
  try {
    // Ordiniamo per titolo di default e poi applicheremo l'ordinamento ACF
    const res = await fetch(`${WORDPRESS_API_URL}/corsi?_embed&per_page=100&orderby=title&order=asc&acf_format=standard`, {
      next: { revalidate: 600 } // Revalida ogni 10 minuti
    });

    if (!res.ok) {
      console.error(`Errore nel recupero dei corsi: ${res.statusText}`);
      return [];
    }

    const courses: Course[] = await res.json();
    
    // Ordina i corsi in base al campo ACF 'ordine'
    // I corsi senza 'ordine' o con 'ordine' non numerico verranno posti alla fine (o gestiti come 9999)
    courses.sort((a, b) => {
      const orderA = a.acf?.ordine !== undefined ? a.acf.ordine : 9999; // Valore alto se non definito
      const orderB = b.acf?.ordine !== undefined ? b.acf.ordine : 9999; // Valore alto se non definito
      return orderA - orderB;
    });

    return courses;
  } catch (error) {
    console.error("Errore durante il fetch dei corsi:", error);
    return [];
  }
}

export default async function PiscinaPage() {
  const allCourses = await getAllCourses();
  const pageTitle = "PISCINA"; // Titolo specifico come richiesto

  // Filtra i corsi per la tassonomia 'piscina'
  const piscinaCourses = allCourses.filter(course => {
    const tipologiaCorsoTerms = course._embedded?.['wp:term']?.[0];
    return tipologiaCorsoTerms?.some(term => term.taxonomy === 'tipologia_corso' && term.slug === 'piscina');
  });

  // Trova il primo corso di piscina per recuperare il campo ACF brochure_piscina
  const firstPiscinaCourse = piscinaCourses.length > 0 ? piscinaCourses[0] : null;
  const brochureUrl = firstPiscinaCourse?.acf?.brochure_piscina || '#'; // Usa '#' come fallback

  return (
    <div className="container mx-auto p-4 md:p-8 font-sans">
      {/* Container per Titolo e Bottone allineati */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        {/* TITOLO H1 UNIFORMATO CON CLASSI GLOBALI */}
        <h1 className="page-title mb-4 md:mb-0">
          {pageTitle}
        </h1>

        {/* Bottone per la Brochure */}
        <a
          href={brochureUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-2 bg-[#38b5ad] text-white font-bold text-base rounded-full shadow-lg hover:bg-[#2a9a93] transition-colors duration-300 transform hover:-translate-y-0.5 whitespace-nowrap"
        >
          <FaDownload className="mr-2 text-lg" />
          Scarica Brochure 2025/26
        </a>
      </div>
      <div className="title-separator mb-8"></div>

      {piscinaCourses.length === 0 ? (
        <p className="text-center text-gray-600">Nessun corso di piscina trovato al momento.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {piscinaCourses.map(course => {
            const featuredImage = course._embedded?.['wp:featuredmedia']?.[0]?.source_url;
            const subtitle = course.acf?.sottotitolo ? course.acf.sottotitolo.replace(/<[^>]*>/g, '').trim() : '';

            return (
              <Link key={course.id} href={`/corsi/${course.slug}`} className="block group">
                {/* Card con altezza fissa o minima */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl flex flex-col h-full">
                  {featuredImage && (
                    <div className="relative w-full h-48 overflow-hidden flex-shrink-0">
                      <Image
                        src={featuredImage}
                        alt={course._embedded?.['wp:featuredmedia']?.[0]?.alt_text || course.title.rendered}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        priority
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                    <h2
                      className="text-xl font-bold text-blue-700 mb-2 group-hover:text-[#2a9a93] transition-colors font-heading"
                      dangerouslySetInnerHTML={{ __html: course.title.rendered }}
                    ></h2>
                    {subtitle && (
                      <p className="text-gray-600 text-sm mb-4" dangerouslySetInnerHTML={{ __html: subtitle }} />
                    )}
                    {/* Excerpt con la possibilità di mostrare un frammento più lungo */}
                    <p className="text-gray-700 text-sm mb-4 flex-grow">
                      {course.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 120)}{course.excerpt.rendered.replace(/<[^>]*>/g, '').length > 120 ? '...' : ''}
                    </p>
                    
                    {/* Nuovo bottone "Vai alla scheda del corso" */}
                    <button className="inline-flex items-center mt-auto px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-colors duration-300 self-start">
                      Vai alla scheda del corso <FaArrowRight className="ml-2 text-xs" />
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}