import Image from 'next/image';
import Link from 'next/link';
import { FaDownload, FaPhone, FaEnvelope, FaFacebookF, FaInstagram, FaCalendarAlt, FaExternalLinkAlt, FaArrowRight, FaSwimmer, FaDumbbell, FaFutbol } from 'react-icons/fa'; // Importa le nuove icone
import NewsSlider from '../../components/NewsSlider'; // Import the client component

// URL base della tua installazione WordPress
const WORDPRESS_API_URL = 'http://mattiaf245.sg-host.com/wp-json/wp/v2';

// --- INTERFACES ---

// Interface for News (WordPress Posts)
interface NewsPost {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string; alt_text: string }>;
  };
}

// Interface for Course Terms (Tipologia Corso)
interface CourseTerm {
  id: number;
  name: string;
  slug: string; // e.g., "piscina", "fitness", "multisport"
  taxonomy: string;
}

// Interface for a single Course (CPT 'corsi')
interface Course {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string; alt_text: string }>;
    'wp:term'?: Array<CourseTerm[]>; // Array of arrays, first array might contain tipologie_corso
  };
  acf?: {
    sottotitolo?: string;
    brochure_piscina?: string; // We'll look for a brochure from any course for the CTA
    brochure_multisport?: string;
    brochure_fitness?: string;
  };
}

// --- DATA FETCHING FUNCTIONS ---

// Function to get the latest 3 news posts
async function getLatestNews(): Promise<NewsPost[]> {
  try {
    const res = await fetch(`${WORDPRESS_API_URL}/posts?_embed&per_page=3&orderby=date&order=desc`, {
      next: { revalidate: 300 } // Revalidate every 5 minutes
    });
    if (!res.ok) {
      console.error(`Error fetching news: ${res.statusText}`);
      return [];
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

// Function to get all courses (for featured courses and brochure URL)
async function getAllCourses(): Promise<Course[]> {
  try {
    const res = await fetch(`${WORDPRESS_API_URL}/corsi?_embed&per_page=100&acf_format=standard`, {
      next: { revalidate: 600 } // Revalidate every 10 minutes
    });
    if (!res.ok) {
      console.error(`Error fetching courses: ${res.statusText}`);
      return [];
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}

export default async function HomePage() {
  const latestNews = await getLatestNews();
  const allCourses = await getAllCourses();

  // Pick 6 random courses for "in evidenza" section
  const featuredCourses = allCourses.sort(() => 0.5 - Math.random()).slice(0, 6);

  // Find a brochure URL from any course for the CTA (prioritize one if available)
  const brochureUrl =
    allCourses.find(c => c.acf?.brochure_piscina)?.acf?.brochure_piscina ||
    allCourses.find(c => c.acf?.brochure_multisport)?.acf?.brochure_multisport ||
    allCourses.find(c => c.acf?.brochure_fitness)?.acf?.brochure_fitness ||
    '#'; // Fallback to '#' if no brochure URL is found anywhere


  return (
    <div className="font-sans">
      {/* 1) Slider with latest 3 news */}
      {/* Rimosso il mb-12 qui, dato che lo slider ha la sua altezza definita */}
      <section>
        <NewsSlider news={latestNews} />
      </section>

      {/* 2) Numbers Row - Removed py-12 for no top/bottom spacing */}
      <section className="bg-[#f0f9f8]">
        <div className="container mx-auto px-4 md:px-8 py-12"> {/* Added py-12 to inner container for content padding */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <span className="text-6xl font-extrabold text-[#38b5ad] font-heading">8</span>
              <p className="text-xl font-semibold text-gray-700 mt-2">spazi sportivi</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-6xl font-extrabold text-[#38b5ad] font-heading">30</span>
              <p className="text-xl font-semibold text-gray-700 mt-2">attività sportive</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-6xl font-extrabold text-[#38b5ad] font-heading">1°</span>
              <p className="text-xl font-semibold text-gray-700 mt-2">in affidabilità</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3) Call to Action (CTA) */}
      <section className="bg-[#38b5ad] text-white py-16 mt-0">
        <div className="container mx-auto px-4 md:px-8 text-center">
          {/* Changed text color to white */}
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 font-heading text-white">
            È online la nuova brochure dei corsi 2025/26
          </h2>
          <p className="text-xl md:text-2xl mb-8">
            Scaricala ora, e scopri il corso giusto per te!
          </p>
          <a
            href={brochureUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-10 py-4 bg-white text-[#38b5ad] font-bold text-lg rounded-full shadow-xl hover:bg-gray-100 transition-colors duration-300 transform hover:-translate-y-1"
          >
            <FaDownload className="mr-3 text-2xl" />
            Scarica la brochure
          </a>
        </div>
      </section>

      {/* 4) Featured Courses Grid */}
      <section className="container mx-auto p-4 md:p-8 mt-12">
        {/* Title formatted like other pages */}
        <h2 className="page-title">In evidenza</h2>
        <div className="title-separator mb-8"></div>
        {featuredCourses.length === 0 ? (
          <p className="text-center text-gray-600">Nessun corso in evidenza trovato al momento.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"> {/* Changed to 3 columns */}
            {featuredCourses.map(course => {
              const featuredImage = course._embedded?.['wp:featuredmedia']?.[0]?.source_url;
              const subtitle = course.acf?.sottotitolo ? course.acf.sottotitolo.replace(/<[^>]*>/g, '').trim() : '';

              // Determine card colors based on typology slug
              const tipologiaCorsoTerms = course._embedded?.['wp:term']?.[0]?.filter(
                (term: CourseTerm) => term.taxonomy === 'tipologia_corso'
              );
              const mainTipologiaCorsoSlug = tipologiaCorsoTerms && tipologiaCorsoTerms.length > 0
                ? tipologiaCorsoTerms[0].slug
                : 'default'; // 'default' if not found

              let cardTitleColorClass = 'text-[#38b5ad]'; // Default color
              let cardBgColor = 'bg-[#f0f9f8]'; // Default light background for card
              let cardButtonColorClass = 'bg-[#38b5ad] hover:bg-[#2a9a93]';

              switch (mainTipologiaCorsoSlug) {
                case 'piscina':
                  cardTitleColorClass = 'text-blue-700';
                  cardBgColor = 'bg-blue-50'; // Very light blue
                  cardButtonColorClass = 'bg-blue-600 hover:bg-blue-700';
                  break;
                case 'fitness':
                  cardTitleColorClass = 'text-red-700';
                  cardBgColor = 'bg-red-50'; // Very light red
                  cardButtonColorClass = 'bg-red-600 hover:bg-red-700';
                  break;
                case 'multisport':
                  cardTitleColorClass = 'text-green-700';
                  cardBgColor = 'bg-green-50'; // Very light green
                  cardButtonColorClass = 'bg-green-600 hover:bg-green-700';
                  break;
                default:
                  // Default to original lighter teal color
                  cardTitleColorClass = 'text-[#38b5ad]';
                  cardBgColor = 'bg-[#f0f9f8]';
                  cardButtonColorClass = 'bg-[#38b5ad] hover:bg-[#2a9a93]';
                  break;
              }


              return (
                <Link key={course.id} href={`/corsi/${course.slug}`} className="block group">
                  <div className={`rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl flex flex-col h-full ${cardBgColor}`}>
                    {featuredImage && (
                      <div className="relative w-full h-48 overflow-hidden flex-shrink-0">
                        <Image
                          src={featuredImage}
                          alt={course._embedded?.['wp:featuredmedia']?.[0]?.alt_text || course.title.rendered}
                          fill
                          style={{ objectFit: 'cover' }}
                          sizes="(max-width: 768px) 100vw, 33vw"
                          priority
                          className="transition-transform duration-300 group-hover:scale-105" // Lieve zoom all'hover
                        />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-grow">
                      <h3
                        className={`text-xl font-bold ${cardTitleColorClass} mb-2 group-hover:text-[#2a9a93] transition-colors font-heading`}
                        dangerouslySetInnerHTML={{ __html: course.title.rendered }}
                      ></h3>
                      {subtitle && (
                        <p className="text-gray-600 text-sm mb-4" dangerouslySetInnerHTML={{ __html: subtitle }} />
                      )}
                      <p className="text-gray-700 text-sm mb-4 flex-grow">
                        {course.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 100)}{course.excerpt.rendered.replace(/<[^>]*>/g, '').length > 100 ? '...' : ''}
                      </p>
                      <button className={`inline-flex items-center mt-auto px-4 py-2 ${cardButtonColorClass} text-white text-sm font-semibold rounded-md transition-colors duration-300 self-start`}>
                        Vai alla scheda del corso <FaArrowRight className="ml-2 text-xs" />
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* NUOVA SEZIONE: Box Categorie Corsi */}
      <section className="mt-12 mb-8">
        <div className="container mx-auto px-4 md:px-8">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Box Piscina */}
            <Link href="/corsi?tipologia_corso=piscina" className="block group">
              <div className="bg-blue-600 text-white rounded-lg shadow-md overflow-hidden p-6 text-center flex flex-col items-center justify-center transform transition-transform duration-300 hover:scale-105 hover:shadow-xl h-full">
                <FaSwimmer className="text-6xl mb-4" />
                <h3 className="text-3xl font-bold mb-4 font-heading text-white">PISCINA</h3>
                <span className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-bold rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-300 transform hover:-translate-y-1">
                  Scopri di più <FaArrowRight className="ml-2" />
                </span>
              </div>
            </Link>

            {/* Box Fitness */}
            <Link href="/corsi?tipologia_corso=fitness" className="block group">
              <div className="bg-red-600 text-white rounded-lg shadow-md overflow-hidden p-6 text-center flex flex-col items-center justify-center transform transition-transform duration-300 hover:scale-105 hover:shadow-xl h-full">
                <FaDumbbell className="text-6xl mb-4" />
                <h3 className="text-3xl font-bold mb-4 font-heading text-white">FITNESS</h3>
                <span className="inline-flex items-center px-6 py-3 bg-white text-red-600 font-bold rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-300 transform hover:-translate-y-1">
                  Scopri di più <FaArrowRight className="ml-2" />
                </span>
              </div>
            </Link>

            {/* Box Multisport */}
            <Link href="/corsi?tipologia_corso=multisport" className="block group">
              <div className="bg-green-600 text-white rounded-lg shadow-md overflow-hidden p-6 text-center flex flex-col items-center justify-center transform transition-transform duration-300 hover:scale-105 hover:shadow-xl h-full">
                <FaFutbol className="text-6xl mb-4" /> 
                <h3 className="text-3xl font-bold mb-4 font-heading text-white">MULTISPORT</h3>
                <span className="inline-flex items-center px-6 py-3 bg-white text-green-600 font-bold rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-300 transform hover:-translate-y-1">
                  Scopri di più <FaArrowRight className="ml-2" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>


      {/* 5) Contacts Section */}
      <section className="bg-gray-100 py-12 mt-12">
        <div className="container mx-auto px-4 md:px-8">
          {/* Title formatted like other pages */}
          <h2 className="page-title">Contatti</h2>
          <div className="title-separator mb-8"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Orari Segreteria */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <FaCalendarAlt className="mr-3 text-xl text-[#38b5ad]" /> ORARI SEGRETERIA
              </h3>
              <p className="text-gray-700 font-bold mb-2"> {/* Added font-bold */}
                Lunedì – Venerdì: 9:00 – 13:00 e 14:00 – 20:00
              </p>
              <p className="text-gray-700 font-bold"> {/* Added font-bold */}
                Sabato: 8:30 – 12:30
              </p>
            </div>

            {/* Calendario Chiusure */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <FaCalendarAlt className="mr-3 text-xl text-[#38b5ad]" /> CALENDARIO CHIUSURE
              </h3>
              {/* Trasformato in un vero bottone */}
              <Link href="/calendario-chiusure" className="btn-primary">
                Vai al calendario <FaExternalLinkAlt className="ml-2 text-sm" />
              </Link>
            </div>
          </div>

          {/* New 4-column grid for other contacts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Numero Segreteria */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col items-center justify-center">
              <FaPhone className="text-5xl text-[#38b5ad] mb-3" />
              <h3 className="text-lg font-bold text-gray-800 mb-2">NUMERO SEGRETERIA</h3>
              <a href="tel:+39011390240" className="text-gray-700 hover:text-[#38b5ad] transition-colors font-semibold">
                011 390240
              </a>
            </div>

            {/* Email Segreteria */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col items-center justify-center">
              <FaEnvelope className="text-5xl text-[#38b5ad] mb-3" />
              <h3 className="text-lg font-bold text-gray-800 mb-2">E-MAIL SEGRETERIA</h3>
              <a href="mailto:segreteria@socialesport.it" className="text-gray-700 hover:text-[#38b5ad] transition-colors font-semibold">
                segreteria@socialesport.it
              </a>
            </div>

            {/* Seguici su Facebook */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col items-center justify-center">
              <FaFacebookF className="text-5xl text-[#38b5ad] mb-3" />
              <h3 className="text-lg font-bold text-gray-800 mb-2">SEGUICI SU FACEBOOK</h3>
              <a href="https://www.facebook.com/SocialeSport" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-[#38b5ad] transition-colors font-semibold inline-flex items-center">
                SocialeSport <FaExternalLinkAlt className="ml-2 text-sm" />
              </a>
            </div>

            {/* Seguici su Instagram */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col items-center justify-center">
              <FaInstagram className="text-5xl text-[#38b5ad] mb-3" />
              <h3 className="text-lg font-bold text-gray-800 mb-2">SEGUICI SU INSTAGRAM</h3>
              <a href="https://www.instagram.com/socialesport_to/" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-[#38b5ad] transition-colors font-semibold inline-flex items-center">
                @socialesport_to <FaExternalLinkAlt className="ml-2 text-sm" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6) Map Section */}
      <section className="mt-12 mb-8">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="page-title">Dove Siamo</h2>
          <div className="title-separator mb-8"></div>
          <div className="aspect-w-16 aspect-h-9 w-full rounded-lg shadow-xl overflow-hidden">
            {/* Google Maps Embed - Replace with your actual embed code iframe */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2817.817457490059!2d7.669896776949319!3d45.09355427103632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47886d9972b22e7d%3A0x6a1f1b0a8f8b0e77!2sSociet%C3%A0%20Canottieri%20Armida!5e0!3m2!1sit!2sit!4v1700000000000!5m2!1sit!2sit"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Sociale Sport Map"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}