// src/app/corsi/[slug]/page.tsx

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { FaCalendarAlt, FaEuroSign, FaInfoCircle, FaWhatsapp, FaChevronRight, FaChevronLeft, FaArrowRight } from 'react-icons/fa'; // Aggiunta FaArrowRight per il bottone

// URL base della tua installazione WordPress
const WORDPRESS_API_URL = 'http://mattiaf245.sg-host.com/wp-json/wp/v2';

// Definizione dell'interfaccia per i campi ACF specifici del CPT Corsi
interface CourseAcfFields {
    sottotitolo?: string;
    giorni_e_orari?: string;
    prezzi?: string;
    tipologia_corso_multisport_copia?: string; // Per Fitness
    tipologia_corso_multisport?: string; // Per Multisport (nome da ACF)
}

// Interfaccia per i termini di tassonomia (tipologia_corso)
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
    content: { rendered: string };
    excerpt: { rendered: string }; // Aggiunto excerpt per le card del carosello
    featured_media: number;
    _embedded?: {
        'wp:featuredmedia'?: Array<{ source_url: string; alt_text: string }>;
        'wp:term'?: Array<CourseTerm[]>; // Array di array, dove il primo array potrebbe contenere le tipologie_corso
    };
    acf?: CourseAcfFields; // Campi ACF direttamente mappati
}

// Funzione per recuperare un corso tramite slug
async function getCourseBySlug(slug: string): Promise<Course | null> {
    try {
        const res = await fetch(`${WORDPRESS_API_URL}/corsi?slug=${slug}&_embed&acf_format=standard`, {
            next: { revalidate: 3600 } // Revalida ogni ora
        });

        if (!res.ok) {
            console.error(`Errore nel recupero del corso per slug ${slug}: ${res.statusText}`);
            return null;
        }

        const courses: Course[] = await res.json();
        return courses.length > 0 ? courses[0] : null;
    } catch (error) {
        console.error(`Errore durante il fetch del corso ${slug}:`, error);
        return null;
    }
}

// Funzione per recuperare tutti i corsi (per il carosello)
async function getAllCourses(): Promise<Course[]> {
    try {
        const res = await fetch(`${WORDPRESS_API_URL}/corsi?_embed&per_page=100&orderby=title&order=asc&acf_format=standard`, {
            next: { revalidate: 600 } // Revalida ogni 10 minuti
        });

        if (!res.ok) {
            console.error(`Errore nel recupero di tutti i corsi: ${res.statusText}`);
            return [];
        }

        const courses: Course[] = await res.json();
        return courses;
    } catch (error) {
        console.error("Errore durante il fetch di tutti i corsi:", error);
        return [];
    }
}

// Funzione per generare i metadati della pagina
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const course = await getCourseBySlug(params.slug);

    if (!course) {
        return {
            title: 'Corso non trovato | Sociale Sport',
            description: 'Il corso richiesto non è stato trovato.',
        };
    }

    return {
        title: `${course.title.rendered} | Corsi | Sociale Sport`,
        description: course.acf?.sottotitolo ? course.acf.sottotitolo.replace(/(<([^>]+)>)/ig, '') : course.title.rendered,
    };
}

// Componente della pagina del singolo corso
export default async function SingleCoursePage({ params }: { params: { slug: string } }) {
    const course = await getCourseBySlug(params.slug);
    const allCourses = await getAllCourses(); // Pre-fetch di tutti i corsi per il carosello

    if (!course) {
        notFound();
    }

    const featuredImage = course._embedded?.['wp:featuredmedia']?.[0]?.source_url;

    // Estrai la tassonomia 'tipologia_corso'
    const tipologiaCorsoTerms = course._embedded?.['wp:term']?.[0]?.filter(
        (term: CourseTerm) => term.taxonomy === 'tipologia_corso'
    );
    const mainTipologiaCorsoSlug = tipologiaCorsoTerms && tipologiaCorsoTerms.length > 0
        ? tipologiaCorsoTerms[0].slug
        : 'default'; // 'default' se non trovata

    // Definisci i colori in base alla tipologia
    let titleColorClass = 'text-[#38b5ad]'; // Colore primario di default
    let labelBgColorClass = 'bg-[#38b5ad]'; // Colore primario di default per le etichette
    let labelText = ''; // Testo per l'etichetta condizionale

    switch (mainTipologiaCorsoSlug) {
        case 'piscina':
            titleColorClass = 'text-blue-700'; // Blu scuro per piscina
            labelBgColorClass = 'bg-blue-700'; 
            break;
        case 'fitness':
            titleColorClass = 'text-red-700'; // Rosso scuro per fitness
            labelBgColorClass = 'bg-red-700';
            if (course.acf?.tipologia_corso_multisport_copia) {
                labelText = course.acf.tipologia_corso_multisport_copia;
            }
            break;
        case 'multisport':
            titleColorClass = 'text-green-700'; // Verde scuro per multisport
            labelBgColorClass = 'bg-green-700';
            if (course.acf?.tipologia_corso_multisport) {
                labelText = course.acf.tipologia_corso_multisport;
            }
            break;
        default:
            // Mantieni i colori di default o gestisci altri casi
            break;
    }

    // Filtra i corsi correlati (stessa tipologia, escludendo il corso corrente)
    const relatedCourses = allCourses.filter(relatedCourse => {
        if (relatedCourse.slug === course.slug) {
            return false; // Escludi il corso corrente
        }
        const relatedTerms = relatedCourse._embedded?.['wp:term']?.[0];
        return relatedTerms?.some(term => term.taxonomy === 'tipologia_corso' && term.slug === mainTipologiaCorsoSlug);
    }).slice(0, 8); // Limita a un numero ragionevole per il carosello

    return (
        <div className="font-sans">
            {/* Immagine in evidenza */}
            {featuredImage && (
                <div className="relative w-full h-[300px] md:h-[450px] overflow-hidden">
                    <Image
                        src={featuredImage}
                        alt={course._embedded?.['wp:featuredmedia']?.[0]?.alt_text || course.title.rendered}
                        fill
                        className="object-cover transform translate-y-[-10%]" // Piccola traslazione per un effetto visivo
                        priority
                    />
                </div>
            )}

            <div className="container mx-auto p-4 md:p-8 bg-white shadow-lg rounded-lg -mt-16 relative z-10 mb-6">
                <article>
                    {/* Etichetta condizionale per Fitness e Multisport */}
                    {(mainTipologiaCorsoSlug === 'fitness' || mainTipologiaCorsoSlug === 'multisport') && labelText && (
                        <p className={`inline-block ${labelBgColorClass} text-white text-sm px-4 py-2 rounded-full mb-4 font-heading uppercase`}>
                            {labelText}
                        </p>
                    )}

                    {/* Titolo del Corso (H1) con colore dinamico */}
                    <h1
                        className={`text-4xl md:text-5xl font-extrabold ${titleColorClass} mb-4 font-heading`}
                        dangerouslySetInnerHTML={{ __html: course.title.rendered }}
                    ></h1>
                    {/* Separatore orizzontale */}
                    <div className={`w-16 h-1 ${labelBgColorClass} mb-8`}></div> {/* Il separatore prende il colore dell'etichetta */}

                    {/* Sottotitolo (campo ACF) - Reso più piccolo */}
                    {course.acf?.sottotitolo && (
                        <div
                            className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed italic" // Ridotto da text-xl/text-2xl
                            dangerouslySetInnerHTML={{ __html: course.acf.sottotitolo }}
                        />
                    )}

                    {/* Contenuto principale del corso da WordPress */}
                    <div
                        className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: course.content.rendered }}
                    />

                    {/* Sezione GIORNI E ORARI */}
                    {course.acf?.giorni_e_orari && (
                        <div className="mt-10 pt-8 border-t-2 border-gray-300"> {/* Separatore più evidente */}
                            <h2 className={`text-3xl font-bold ${titleColorClass} mb-6 font-heading flex items-center`}>
                                <FaCalendarAlt className="mr-3 text-2xl" /> GIORNI E ORARI 2025/26
                            </h2>
                            <div
                                className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: course.acf.giorni_e_orari }}
                            />
                        </div>
                    )}

                    {/* Sezione PREZZI */}
                    {course.acf?.prezzi && (
                        <div className="mt-10 pt-8 border-t-2 border-gray-300"> {/* Separatore più evidente */}
                            <h2 className={`text-3xl font-bold ${titleColorClass} mb-6 font-heading flex items-center`}>
                                <FaEuroSign className="mr-3 text-2xl" /> PREZZI
                            </h2>
                            <div
                                className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: course.acf.prezzi }}
                            />
                        </div>
                    )}

                    {/* Sezione RICHIEDI INFORMAZIONI */}
                    <div className="mt-10 pt-8 border-t-2 border-gray-300">
                        <h2 className={`text-3xl font-bold ${titleColorClass} mb-6 font-heading flex items-center`}>
                            <FaInfoCircle className="mr-3 text-2xl" /> RICHIEDI INFORMAZIONI
                        </h2>
                        <p className="text-gray-700 mb-6 leading-relaxed">
                            Hai domande sui nostri corsi? Compila il form qui sotto o contattaci direttamente su WhatsApp per ricevere tutte le informazioni di cui hai bisogno!
                        </p>

                        {/* Placeholder per il FORM */}
                        <div className="bg-gray-100 p-6 rounded-lg mb-6 border border-gray-200">
                            <p className="text-gray-600 italic">
                            </p>
                            {/* Esempio di un campo input e textarea */}
                            <input type="text" placeholder="Nome" className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b5ad]" />
                            <input type="email" placeholder="Email" className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b5ad]" />
                            <textarea placeholder="Il tuo messaggio..." rows={4} className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b5ad]"></textarea>
                            <button className="w-full px-6 py-3 bg-[#38b5ad] text-white font-bold rounded-md hover:bg-[#2a9a93] transition-colors">Invia Richiesta</button>
                        </div>

                        {/* Bottone WhatsApp */}
                        <div className="flex justify-center mt-6">
                            <a
                                href="https://wa.me/XXXXXXXXXX" // Sostituisci XXXXXXXXXX con il tuo numero WhatsApp
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-8 py-3 bg-green-500 text-white font-bold text-lg rounded-full shadow-lg hover:bg-green-600 transition-colors duration-300 transform hover:-translate-y-1"
                            >
                                <FaWhatsapp className="mr-3 text-2xl" />
                                Contattaci su WhatsApp
                            </a>
                        </div>
                    </div>

                </article>
            </div>

            {/* Carosello orizzontale ALTRI CORSI DELLA STESSA TIPOLOGIA */}
            {relatedCourses.length > 0 && (
                <div className="container mx-auto p-4 md:p-8 mt-10">
                    {/* Titolo modificato per essere più generico */}
                    <h2 className={`text-3xl font-bold ${titleColorClass} mb-8 font-heading text-center`}>
                        Potrebbero interessarti anche
                    </h2>
                    <div className="relative">
                        {/* Contenitore della griglia per il carosello. Useremo `overflow-x-auto` per lo scrolling orizzontale */}
                        <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide-custom"> {/* Custom scrollbar-hide-custom in globals.css */}
                            {relatedCourses.map(relatedCourse => {
                                // Determina il colore del titolo della card correlata in base alla sua tipologia
                                const relatedCourseTitleColorClass = (relatedCourse._embedded?.['wp:term']?.[0]?.some(term => term.slug === 'piscina')) ? 'text-blue-700' :
                                                                  (relatedCourse._embedded?.['wp:term']?.[0]?.some(term => term.slug === 'fitness')) ? 'text-red-700' :
                                                                  (relatedCourse._embedded?.['wp:term']?.[0]?.some(term => term.slug === 'multisport')) ? 'text-green-700' :
                                                                  'text-[#38b5ad]';

                                // Determina il colore del bottone della card correlata in base alla sua tipologia
                                const relatedCourseButtonColorClass = (relatedCourse._embedded?.['wp:term']?.[0]?.some(term => term.slug === 'piscina')) ? 'bg-blue-600 hover:bg-blue-700' :
                                                                      (relatedCourse._embedded?.['wp:term']?.[0]?.some(term => term.slug === 'fitness')) ? 'bg-red-600 hover:bg-red-700' :
                                                                      (relatedCourse._embedded?.['wp:term']?.[0]?.some(term => term.slug === 'multisport')) ? 'bg-green-600 hover:bg-green-700' :
                                                                      'bg-[#38b5ad] hover:bg-[#2a9a93]';

                                return (
                                    <Link key={relatedCourse.id} href={`/corsi/${relatedCourse.slug}`} className="block group flex-shrink-0 w-[calc(100%/1)] sm:w-[calc(100%/2-12px)] lg:w-[calc(100%/3-16px)] xl:w-[calc(100%/4-18px)]">
                                        <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl flex flex-col h-full">
                                            {relatedCourse._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                                                <div className="relative w-full h-40 overflow-hidden flex-shrink-0">
                                                    <Image
                                                        src={relatedCourse._embedded['wp:featuredmedia'][0].source_url}
                                                        alt={relatedCourse._embedded['wp:featuredmedia'][0].alt_text || relatedCourse.title.rendered}
                                                        fill
                                                        style={{ objectFit: 'cover' }}
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                                    />
                                                </div>
                                            )}
                                            <div className="p-4 flex flex-col flex-grow">
                                                <h3
                                                    className={`text-lg font-bold ${relatedCourseTitleColorClass} mb-2 group-hover:text-[#2a9a93] transition-colors font-heading`}
                                                    dangerouslySetInnerHTML={{ __html: relatedCourse.title.rendered }}
                                                ></h3>
                                                {/* Inserimento del div con excerpt e bottone */}
                                                <div className="text-gray-700 text-sm mb-4 flex-grow">
                                                    <p className="mb-4">
                                                        {relatedCourse.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 120)}{relatedCourse.excerpt.rendered.replace(/<[^>]*>/g, '').length > 120 ? '' : ''}
                                                    </p>
                                                    <button className={`inline-flex items-center px-4 py-2 ${relatedCourseButtonColorClass} text-white text-sm font-semibold rounded-md transition-colors duration-300 self-start`}>
                                                        Vai alla scheda del corso <FaArrowRight className="ml-2 text-xs" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                        {/* Frecce di navigazione rimosse come richiesto, dato che `overflow-x-auto` gestisce lo scroll */}
                    </div>
                </div>
            )}
        </div>
    );
}