// src/app/corsi/[slug]/layout.tsx

import type { ReactNode } from 'react';
import type { Metadata } from 'next';

const WORDPRESS_API_URL = 'http://mattiaf245.sg-host.com/wp-json/wp/v2';

interface Course {
  id: number;
  slug: string;
  title: { rendered: string };
  acf?: {
    sottotitolo?: string;
  };
}

async function getCourseBySlugForMetadata(slug: string): Promise<Course | null> {
  try {
    const res = await fetch(`${WORDPRESS_API_URL}/corsi?slug=${slug}&_embed&acf_format=standard`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;
    const courses: Course[] = await res.json();
    return courses.length > 0 ? courses[0] : null;
  } catch (err) {
    console.error('Errore fetch corso:', err);
    return null;
  }
}

// ✅ generateMetadata con firma inline — NON usare tipi condivisi
export async function generateMetadata(
  props: { params: { slug: string } }
): Promise<Metadata> {
  const course = await getCourseBySlugForMetadata(props.params.slug);

  if (!course) {
    return {
      title: 'Corso non trovato | Sociale Sport',
      description: 'Il corso richiesto non è stato trovato.',
    };
  }

  return {
    title: `${course.title.rendered} | Corsi | Sociale Sport`,
    description: course.acf?.sottotitolo?.replace(/(<([^>]+)>)/gi, '') ?? course.title.rendered,
  };
}

// ✅ Layout con firma minimale e conforme
export default function CourseLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
