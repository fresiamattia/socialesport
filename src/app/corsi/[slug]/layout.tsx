import type { ReactNode } from 'react';
import type { Metadata } from 'next';

// WordPress API
const WORDPRESS_API_URL = 'http://mattiaf245.sg-host.com/wp-json/wp/v2';

interface CourseAcfFields {
  sottotitolo?: string;
}

interface Course {
  id: number;
  slug: string;
  title: { rendered: string };
  acf?: CourseAcfFields;
}

// Recupero dati
async function getCourseBySlugForMetadata(slug: string): Promise<Course | null> {
  try {
    const res = await fetch(`${WORDPRESS_API_URL}/corsi?slug=${slug}&_embed&acf_format=standard`, {
      next: { revalidate: 3600 }
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

// Metadata dinamico
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
    description: course.acf?.sottotitolo?.replace(/(<([^>]+)>)/ig, '') ?? course.title.rendered,
  };
}

// ✅ Layout corretto con tipizzazione esplicita
export default function CourseLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { slug: string };
}) {
  return <>{children}</>;
}
