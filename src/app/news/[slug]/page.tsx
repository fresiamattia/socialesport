// src/app/news/[slug]/page.tsx

import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FaFacebook, FaWhatsapp, FaArrowLeft, FaArrowRight, FaCalendarAlt, FaTelegram, FaFacebookMessenger } from 'react-icons/fa'; 

// URL base della tua installazione WordPress
const WORDPRESS_API_URL = 'http://mattiaf245.sg-host.com/wp-json/wp/v2';

interface Post {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  categories: number[];
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string; alt_text: string }>;
    'wp:term'?: Array<Array<{ name: string; slug: string; taxonomy: string }>>;
  };
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

async function getAllPosts(): Promise<Post[]> {
  try {
    const res = await fetch(`${WORDPRESS_API_URL}/posts?_embed&per_page=100&orderby=date&order=desc`, {
      next: { revalidate: 600 }
    });

    if (!res.ok) {
      console.error(`Errore nel recupero di tutti gli articoli: ${res.statusText}`);
      return [];
    }

    const posts: Post[] = await res.json();
    return posts;
  } catch (error) {
    console.error("Errore durante il fetch di tutti gli articoli:", error);
    return [];
  }
}

async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const res = await fetch(`${WORDPRESS_API_URL}/posts?slug=${slug}&_embed`, {
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
      console.error(`Errore nel recupero del post per slug ${slug}: ${res.statusText}`);
      return null;
    }

    const posts: Post[] = await res.json();
    return posts.length > 0 ? posts[0] : null;
  } catch (error) {
    console.error(`Errore durante il fetch del post ${slug}:`, error);
    return null;
  }
}

export default async function SingleArticlePage({ params }: { params: { slug: string } }) {
  const currentPost = await getPostBySlug(params.slug);

  if (!currentPost) {
    notFound();
  }

  const allPosts = await getAllPosts();
  const currentIndex = allPosts.findIndex(post => post.id === currentPost.id);

  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const featuredImage = currentPost._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const categories = currentPost._embedded?.['wp:term']?.[0]?.filter(term => term.taxonomy === 'category');
  const categoryName = categories && categories.length > 0 ? categories[0].name : 'Senza Categoria';

  const shareUrl = `https://www.socialesport.it/news/${currentPost.slug}`;
  const shareTitle = encodeURIComponent(currentPost.title.rendered);

  return (
    <div className="font-sans"> 
      {featuredImage && (
        <div className="relative w-full h-[300px] md:h-[450px] overflow-hidden">
          <Image
            src={featuredImage}
            alt={currentPost._embedded?.['wp:featuredmedia']?.[0]?.alt_text || currentPost.title.rendered}
            fill
            className="object-cover transform translate-y-[-10%]" 
            priority
          />
        </div>
      )}

      <div className="container mx-auto p-4 md:p-8 bg-white shadow-lg rounded-lg -mt-16 relative z-10 mb-6">
        <article>
          {/* Categoria come etichetta */}
          <p className="inline-block bg-black text-white text-xs px-3 py-1 rounded-full mb-4 font-heading uppercase">
            {categoryName}
          </p>

          {/* DATA: Più grande e più evidente */}
          <p className="flex items-center text-xl font-bold text-gray-700 mb-4">
            <FaCalendarAlt className="mr-2 text-gray-600" size={20} />
            {new Date(currentPost.date).toLocaleDateString('it-IT')}
          </p>

          {/* TITOLO ARTICOLO UNIFORMATO E SEPARATORE */}
          <h1 
            className="text-4xl md:text-5xl font-extrabold text-[#38b5ad] mb-4 font-heading" // Classi per replicare page-title
            dangerouslySetInnerHTML={{ __html: currentPost.title.rendered }}
          ></h1>
          <div className="w-16 h-1 bg-[#38b5ad] mb-8"></div> {/* Separatore orizzontale */}

          {/* Contenuto */}
          <div
            className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: currentPost.content.rendered }}
          />

          {/* SEZIONE SOCIAL SHARE CON SFONDO COLORATO E PADDING IDENTICO */}
          <div className="mt-8 py-6 px-4 md:px-6 border-t border-b border-gray-200 bg-blue-50 rounded-lg">
            <h3 className="text-xl font-bold text-[#38b5ad] mb-4 mt-0 font-heading">Condividi questo articolo:</h3>
            <div className="flex flex-wrap gap-4">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-semibold"
                aria-label="Condividi su Facebook"
              >
                <FaFacebook size={18} className="mr-2" /> <span className="hidden md:inline">Condividi su Facebook</span>
              </a>
              <a
                href={`https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm font-semibold"
                aria-label="Condividi su WhatsApp"
              >
                <FaWhatsapp size={18} className="mr-2" /> <span className="hidden md:inline">Condividi su WhatsApp</span>
              </a>
              <a
                href={`https://www.facebook.com/dialog/send?link=${shareUrl}&app_id=YOUR_FACEBOOK_APP_ID`} 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-semibold"
                aria-label="Condividi su Messenger"
              >
                <FaFacebookMessenger size={18} className="mr-2" /> <span className="hidden md:inline">Condividi su Messenger</span>
              </a>
              <a
                href={`https://t.me/share/url?url=${shareUrl}&text=${shareTitle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-500 transition-colors text-sm font-semibold"
                aria-label="Condividi su Telegram"
              >
                <FaTelegram size={18} className="mr-2" /> <span className="hidden md:inline">Condividi su Telegram</span>
              </a>
            </div>
          </div>
        </article>
      </div>

      {/* --- SEZIONE DI NAVIGAZIONE PRECEDENTE/SUCCESSIVO (SOLO DATA E TITOLO) --- */}
      <div className="container mx-auto p-4 md:p-8 flex justify-between items-center mt-8">
        {prevPost ? (
          <Link href={`/news/${prevPost.slug}`} className="flex items-center text-[#38b5ad] hover:text-[#2a9a93] transition-colors group">
            <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            <div className="flex flex-col">
              <span className="flex items-center text-sm font-semibold text-gray-700">
                <FaCalendarAlt className="mr-1 text-gray-500" size={14} />
                {new Date(prevPost.date).toLocaleDateString('it-IT')}
              </span>
              <span className="font-bold text-lg leading-tight" dangerouslySetInnerHTML={{ __html: prevPost.title.rendered }}></span>
            </div>
          </Link>
        ) : (
          <div className="invisible w-1/2 md:w-auto"></div>
        )}

        {nextPost ? (
          <Link href={`/news/${nextPost.slug}`} className="flex items-center text-[#38b5ad] hover:text-[#2a9a93] transition-colors group ml-auto text-right">
            <div className="flex flex-col">
              <span className="flex items-center justify-end text-sm font-semibold text-gray-700">
                {new Date(nextPost.date).toLocaleDateString('it-IT')}
                <FaCalendarAlt className="ml-1 text-gray-500" size={14} />
              </span>
              <span className="font-bold text-lg leading-tight" dangerouslySetInnerHTML={{ __html: nextPost.title.rendered }}></span>
            </div>
            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        ) : (
          <div className="invisible w-1/2 md:w-auto"></div>
        )}
      </div>
      {/* Fine sezione navigazione */}
    </div>
  );
}