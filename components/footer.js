// components/Footer.js

import Image from 'next/image';
import Link from 'next/link';

function Footer() {
  return (
    <footer className="bg-black text-white p-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Prima Colonna */}
        <div className="font-sans"> {/* Applica Open Sans a tutta la colonna */}
          <div className="mb-4">
            {/* Logo Singolo, Due Volte Più Grande */}
            <Image
              src="http://mattiaf245.sg-host.com/wp-content/uploads/2025/07/logo-sito.png"
              alt="Logo Sociale Sport"
              width={240} // 120 * 2 = 240
              height={80} // 40 * 2 = 80
              className="mb-2"
            />
          </div>
          <p className="mb-1 text-sm">Sociale Sport ssd s.r.l.</p>
          <p className="mb-1 text-sm">Corso Siracusa 10, Torino</p>
          <p className="mb-1 text-sm">e-mail: <a href="mailto:segreteria@socialesport.it" className="hover:underline">segreteria@socialesport.it</a></p>
          <p className="mb-4 text-sm">tel: <a href="tel:+39011390240" className="hover:underline">011.390240</a></p>

          <p className="text-sm">P.IVA: 11253240011</p>
        </div>

        {/* Seconda Colonna */}
        <div className="font-sans"> {/* Applica Open Sans a tutta la colonna */}
          {/* Titolo in Maven Pro, maiuscolo, grigio chiaro */}
          <h3 className="text-lg font-bold text-gray-400 mb-4 font-heading uppercase">Regolamento e Privacy</h3>
          <ul className="space-y-2 mb-6">
            <li><Link href="/privacy" className="text-sm hover:underline">Informativa sulla privacy</Link></li>
            <li><Link href="/regolamento-2023-24" className="text-sm hover:underline">Regolamento 2023-24</Link></li>
            <li><Link href="/safeguarding" className="text-sm hover:underline">Safeguarding</Link></li>
          </ul>

          {/* Titolo in Maven Pro, maiuscolo, grigio chiaro */}
          <h3 className="text-lg font-bold text-gray-400 mb-4 font-heading uppercase">Contributi Covid</h3>
          <p className="text-sm mb-2">Sociale Sport ha beneficiato dei seguenti contributi per l&#39;emergenza Covid-19:</p>
          {/* Rimosso l'elenco puntato, ora sono semplici paragrafi */}
          <p className="text-sm">Contributo fondo perduto covid 19 - 2.016,00€ in data 03/07/2020</p>
          <p className="text-sm">Contributo Regione Piemonte- 3.840,00€ in data 06/10/2020</p>
          <p className="text-sm">Contributo a fondo perduto art. 1 DL 137/2020 in data 26/11/2020</p>
        </div>

        {/* Terza Colonna */}
        <div className="font-sans"> {/* Applica Open Sans a tutta la colonna */}
          {/* Titolo in Maven Pro, maiuscolo, grigio chiaro */}
          <h3 className="text-lg font-bold text-gray-400 mb-4 font-heading uppercase">Affiliazioni</h3>
          <p className="text-sm mb-4">Sociale Sport ssd s.r.l. è affiliato a</p>
          <p className="text-sm font-semibold mb-6">UISP · FIN · ACLI · FIJLKAM</p>

          {/* Titolo in Maven Pro, maiuscolo, grigio chiaro */}
          <h3 className="text-lg font-bold text-gray-400 mb-4 font-heading uppercase">SPONSOR</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold">Assicurazioni Generali Torino Bernini</p>
              <p className="text-sm">Via Duchessa Iolanda 25</p>
              <p className="text-sm">10128, Torino</p>
            </div>
            <div>
              <p className="text-sm font-semibold">Studio Bove</p>
              <p className="text-sm">Via Monte Cimone 7</p>
              <p className="text-sm">10142, Torino</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto text-center mt-8 pt-4 border-t border-gray-700 font-sans"> {/* Applica Open Sans qui */}
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Sociale Sport ssd s.r.l. Tutti i diritti riservati.
          <span className="ml-2">
            <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
            {" - "} {/* Spazio corretto qui */}
            <Link href="/cookie-policy" className="hover:underline">Cookie Policy</Link>
          </span>
        </p>
      </div>
    </footer>
  );
}

export default Footer;