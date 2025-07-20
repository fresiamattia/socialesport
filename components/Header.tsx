// components/Header.tsx

"use client";

import Link from 'next/link';
import Image from 'next/image';
import { FaFacebookF, FaYoutube, FaInstagram } from 'react-icons/fa';
import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { id: 1, title: 'Iscrizioni', url: '/iscrizioni' },
    { id: 2, title: 'Piscina', url: '/piscina' },
    { id: 3, title: 'Fitness', url: '/fitness' },
    { id: 4, title: 'Multisport', url: '/multisport' },
    { id: 5, title: 'News', url: '/news' },
    { id: 6, title: 'Contatti', url: '/contatti' },
  ];

  return (
    <header className="bg-[#38b5ad] text-white p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">

        {/* Logo */}
        <Link href="/">
          <Image
            src="http://mattiaf245.sg-host.com/wp-content/uploads/2025/07/logo-sito.png"
            alt="Logo Il Tuo Sito"
            width={200}
            height={67}
            priority
            className="cursor-pointer"
          />
        </Link>

        {/* Bottone Menu Hamburger (visibile solo su mobile) */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none"
            aria-label={isMenuOpen ? "Chiudi menu" : "Apri menu"}
          >
            {isMenuOpen ? <FiX size={30} /> : <FiMenu size={30} />}
          </button>
        </div>

        {/* Menu Principale (desktop) e Hamburger (mobile - Slide-Out) */}
        <nav
          className={`
            fixed top-0 right-0 h-full w-[80vw] bg-[#38b5ad] transform transition-transform duration-300 ease-in-out z-50 md:relative md:flex md:w-auto md:h-auto md:transform-none md:bg-transparent md:p-0 md:shadow-none
            ${isMenuOpen ? 'translate-x-0 shadow-lg' : 'translate-x-full'}
            md:block
          `}
        >
          {/* Bottone di chiusura all'interno del menu slide-out (solo mobile) */}
          <div className="md:hidden flex justify-end p-4">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-white focus:outline-none"
              aria-label="Chiudi menu"
            >
              <FiX size={30} />
            </button>
          </div>

          {/* Lista degli elementi del menu con padding sinistro aumentato */}
          <ul className="flex flex-col space-y-4 py-4 pl-8 pr-4 md:flex-row md:space-y-0 md:space-x-8 md:items-center md:p-0">
            {menuItems.map((item) => (
              <li key={item.id} onClick={() => setIsMenuOpen(false)}>
                <Link href={item.url}>
                  {/* ******* MODIFICA QUI: AGGIUNTA DI font-heading ******* */}
                  <p className="text-white hover:text-gray-200 text-lg font-medium cursor-pointer font-heading">
                    {item.title}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Overlay (per oscurare il contenuto quando il menu è aperto su mobile) */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          ></div>
        )}

        {/* Icone Social (Molto più piccole) */}
        <div className="hidden md:flex space-x-2 items-center">
          <a
            href="https://www.facebook.com/SocialeSport/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-200 text-xl"
            aria-label="Facebook"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://www.youtube.com/@socialesport"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-200 text-xl"
            aria-label="YouTube"
          >
            <FaYoutube />
          </a>
          <a
            href="https://www.instagram.com/socialesport_to/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-200 text-xl"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
        </div>
      </div>
    </header>
  );
}

export default Header;