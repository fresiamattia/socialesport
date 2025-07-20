// src/app/news/page.tsx

import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight, FaCalendarAlt } from 'react-icons/fa'; 

// URL base della tua installazione WordPress
const WORDPRESS_API_URL = 'http://mattiaf245.sg-host.com/wp-json/wp/v2';

interface Post {
  id: number;
  slug: string;
  title: { rendered: string };
  is_sticky: boolean;
  excerpt: { rendered: string };
  date: string;
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string; alt_text: string }>;
    'wp:term'?: Array<Array<{ name: string; slug: string; taxonomy: string }>>;
  };
}

// Funzione per recuperare tutti gli articoli
async function getPosts(): Promise<Post[]> {
  try {
    const res = await fetch(`${WORDPRESS_API_URL}/posts?_embed&per_page=10&orderby=date&order=desc`, {
      next: { revalidate: 600 } // Revalida ogni 10 minuti
    });

    if (!res.ok) {
      console.error(`Errore nel recupero degli articoli: ${res.statusText}`);
      return [];
    }

    const posts: Post[] = await res.json();
    
    const stickyPosts = posts.filter(post => post.is_sticky);
    const nonStickyPosts = posts.filter(post => !post.is_sticky);

    return [...stickyPosts, ...nonStickyPosts];

  } catch (error) {
    console.error("Errore durante il fetch degli articoli:", error);
    return [];
  }
}

export default async function NewsPage() {
  const posts = await getPosts();

  return (
    <div className="container mx-auto p-4 md:p-8 font-sans">
      {/* TITOLO H1 UNIFORMATO CON CLASSI GLOBALI */}
      <h1 className="page-title">
        Ultime News
      </h1>
      <div className="title-separator mb-8"></div> {/* Aggiunto mb-8 per spaziatura */}

      {posts.length === 0 ? (
        <p className="text-center text-gray-600">Nessun articolo trovato.</p>
      ) : (
        <div className="grid grid-cols-1"> 
          {posts.map((post, index) => {
            const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
            const excerptText = post.excerpt.rendered.replace(/<[^>]*>/g, '').trim(); 
            const truncatedExcerpt = excerptText.length > 200 ? excerptText.substring(0, 200) + '...' : excerptText;
            
            const categories = post._embedded?.['wp:term']?.[0]?.filter(term => 
              term.taxonomy === 'category' && term.slug !== 'uncategorized'
            );
            const categoryName = categories && categories.length > 0 ? categories[0].name : 'News';

            return (
              <div key={post.id}>
                <div className="bg-white flex flex-col md:flex-row overflow-hidden rounded-lg relative">
                  {featuredImage && (
                    <div className="relative w-full md:w-1/3 h-48 md:h-auto flex-shrink-0">
                      <Image
                        src={featuredImage}
                        alt={post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || post.title.rendered}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        priority
                      />
                      <p className="absolute top-4 left-4 inline-block bg-black text-white text-xs px-3 py-1 rounded-full font-heading uppercase z-10">
                        {categoryName}
                      </p>
                    </div>
                  )}
                  <div className="p-8 md:p-10 flex flex-col justify-between w-full md:w-2/3">
                    <div>
                      <h2 className="text-2xl font-bold text-[#38b5ad] mb-2 font-heading" dangerouslySetInnerHTML={{ __html: post.title.rendered }}></h2>
                      <p className="flex items-center text-base text-gray-600 mb-4">
                        <FaCalendarAlt className="mr-2 text-gray-500" size={16} />
                        {new Date(post.date).toLocaleDateString('it-IT')}
                      </p>
                      <div className="text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: truncatedExcerpt }} />
                    </div>
                    <div className="flex justify-start">
                      <Link
                        href={`/news/${post.slug}`}
                        className="inline-flex items-center gap-2 bg-[#38b5ad] text-white px-6 py-2 rounded-md hover:bg-[#2a9a93] transition-colors font-heading w-fit"
                      >
                        Leggi di più <FaArrowRight />
                      </Link>
                    </div>
                  </div>
                </div>
                {index < posts.length - 1 && (
                  <div className="my-8 h-px bg-gray-300 w-full"></div> 
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}