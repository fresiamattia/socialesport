// src/app/iscrizioni/page.tsx

import type { Metadata } from 'next';
import Link from 'next/link';
import { FaDownload, FaUserPlus, FaChild } from 'react-icons/fa';

interface AcfFields {
  lezione_di_prova?: string;
  iscrizione_minorenni?: string;
  iscrizione_maggiorenni?: string;
}

interface WpPageData {
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  acf?: AcfFields;
}

async function getIscrizioniPageData(): Promise<WpPageData | null> {
    const WP_API_URL = 'https://mattiaf245.sg-host.com/wp-json/wp/v2/pages';

    try {
        const res = await fetch(`${WP_API_URL}?slug=iscrizioni&_embed&acf_format=standard`, {
            next: { revalidate: 60 }
        });

        if (!res.ok) {
            console.error(`Errore nel fetching della pagina: ${res.status} ${res.statusText}`);
            return null;
        }

        const pages = await res.json();

        if (!pages || pages.length === 0) {
            console.warn("Nessuna pagina 'iscrizioni' trovata dall'API di WordPress.");
            return null;
        }

        return pages[0];
    } catch (error) {
        console.error("Errore durante il fetching della pagina 'iscrizioni':", error);
        return null;
    }
}

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getIscrizioniPageData();

  if (!pageData) {
    return {
      title: 'Pagina non trovata | Sociale Sport',
      description: 'La pagina delle iscrizioni non è al momento disponibile.',
    };
  }

  const descriptionText = pageData.excerpt.rendered.replace(/(<([^>]+)>)/ig, '');

  return {
    title: `${pageData.title.rendered} | Sociale Sport`,
    description: descriptionText,
  };
}

export default async function IscrizioniPage() {
  const pageData = await getIscrizioniPageData();

  if (!pageData) {
    return (
      <div className="text-center py-10 px-4">
        {/* Titolo di fallback - non usa 'page-title' */}
        <h1 className="text-4xl font-extrabold text-red-600 mb-4 font-heading">
          Ops! Pagina non trovata.
        </h1>
        <p className="text-lg text-gray-700">
          Ci scusiamo, ma la pagina delle iscrizioni non è disponibile al momento.
          Per favorire, prova più tardi o contatta la segreteria.
        </p>
      </div>
    );
  }

  const lezioneDiProvaUrl = pageData.acf?.lezione_di_prova;
  const iscrizioneMinorenniUrl = pageData.acf?.iscrizione_minorenni;
  const iscrizioneMaggiorenniUrl = pageData.acf?.iscrizione_maggiorenni;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="prose lg:prose-xl max-w-none mb-10">
        {/* Titolo H1 della pagina con la classe page-title */}
        <h1 className="page-title">
          {pageData.title.rendered}
        </h1>
        {/* Separatore orizzontale sotto l'H1 */}
        <div className="title-separator"></div>

        {/* Renderizza il contenuto HTML proveniente da WordPress */}
        <div dangerouslySetInnerHTML={{ __html: pageData.content.rendered }} />
      </div>

      {/* Sezione Bottoni ACF */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {lezioneDiProvaUrl && (
          <Link
            href={lezioneDiProvaUrl}
            target="_blank"
            rel="noopener noreferrer"
            // Usa 'bg-primary' definito in tailwind.config.js
            className="flex flex-col items-center justify-center p-6 bg-primary text-white rounded-lg shadow-lg hover:bg-[#2a9f97] transition-colors duration-200 text-center no-underline"
          >
            <FaDownload className="text-4xl mb-3" />
            <span className="text-lg font-bold font-heading">LEZIONE DI PROVA</span>
          </Link>
        )}

        {iscrizioneMinorenniUrl && (
          <Link
            href={iscrizioneMinorenniUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-6 bg-primary text-white rounded-lg shadow-lg hover:bg-[#2a9f97] transition-colors duration-200 text-center no-underline"
          >
            <FaChild className="text-4xl mb-3" />
            <span className="text-lg font-bold font-heading">ISCRIZIONE MINORENNI</span>
          </Link>
        )}

        {iscrizioneMaggiorenniUrl && (
          <Link
            href={iscrizioneMaggiorenniUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-6 bg-primary text-white rounded-lg shadow-lg hover:bg-[#2a9f97] transition-colors duration-200 text-center no-underline"
          >
            <FaUserPlus className="text-4xl mb-3" />
            <span className="text-lg font-bold font-heading">ISCRIZIONE MAGGIORENNI</span>
          </Link>
        )}
      </div>
    </div>
  );
}