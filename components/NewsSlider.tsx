// src/components/NewsSlider.tsx
'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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

interface NewsSliderProps {
  news: NewsPost[];
}

export default function NewsSlider({ news }: NewsSliderProps) {
  if (!news || news.length === 0) {
    return <p className="text-center text-gray-600 py-12">Nessuna news trovata al momento.</p>;
  }

  return (
    <div className="relative w-full overflow-hidden h-[70vh] min-h-[500px] max-h-[900px]">
      <Swiper
        modules={[Navigation, Pagination, A11y, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="h-full"
      >
        {news.map((newsItem) => {
          const featuredImage = newsItem._embedded?.['wp:featuredmedia']?.[0]?.source_url;
          const altText = newsItem._embedded?.['wp:featuredmedia']?.[0]?.alt_text || newsItem.title.rendered;

          return (
            <SwiperSlide key={newsItem.id}>
              <div className="relative w-full h-full overflow-hidden">
                {featuredImage && (
                  <Image
                    src={featuredImage}
                    alt={altText}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="100vw"
                    priority
                    className="transition-transform duration-500 ease-in-out ken-burns-effect"
                  />
                )}
                {/* Overlay per testo e bottone */}
                {/* Aumentato il padding laterale (px-12 md:px-24) */}
                {/* Il contenuto ora è centrato orizzontalmente con justify-center e flex items-end */}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end justify-center px-8 md:px-12 lg:px-24 py-8 md:py-12 lg:py-16 transition-opacity duration-300 group-hover:bg-opacity-70">
                  <div className="text-white text-center max-w-2xl"> {/* Aumentato max-w-2xl per un testo più centrato */}
                    <h3
                      className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-2 md:mb-3 drop-shadow-lg font-heading"
                      dangerouslySetInnerHTML={{ __html: newsItem.title.rendered }}
                    ></h3>
                    <p
                      className="text-base md:text-lg mb-4 drop-shadow line-clamp-2 md:line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: newsItem.excerpt.rendered.replace(/<[^>]*>/g, '') }}
                    ></p>
                    <Link
                      href={`/news/${newsItem.slug}`}
                      className="inline-flex items-center px-6 py-3 bg-[#38b5ad] text-white font-bold text-base rounded-full shadow-lg hover:bg-[#2a9a93] transition-colors duration-300 transform hover:-translate-y-1"
                    >
                      Leggi la news <FaArrowRight className="ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}