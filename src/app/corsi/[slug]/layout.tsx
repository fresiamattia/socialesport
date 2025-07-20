// src/app/corsi/[slug]/layout.tsx

import type { Metadata } from 'next';

// URL base della tua installazione WordPress
const WORDPRESS_API_URL = 'http://mattiaf245.sg-host.com/wp-json/wp/v2';

// Interfaccia per i campi ACF specifici del CPT Corsi (solo quelli necessari per i metadati)
interface CourseAcfFields {
  sottotitolo?: string;
}

// Interfaccia per un singolo corso (Post) (solo i campi necessari per i metadati)
interface Course {
  id: number;
  slug: string;
  title: { rendered: string };
  acf?: CourseAcfFields;
}

// Funzione per recuperare un corso tramite slug (copia da page.tsx, questa sarà lato server)
async function getCourseBySlugForMetadata(slug: string): Promise<Course | null> {
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
    console.error(`Errore durante il fetch del corso ${slug} per metadati:`, error);
    return null;
  }
}

// Funzione per generare i metadati della pagina (QUESTA È UNA SERVER FUNCTION)
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const course = await getCourseBySlugForMetadata(params.slug);

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

// Il layout per i percorsi [slug] che avvolgerà il page.tsx
export default function CourseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  );
}