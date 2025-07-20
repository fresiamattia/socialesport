// components/Layout.js

"use client";
import Header from './Header'; // Assicurati che Header.js esista
import Footer from './footer'; // Assicurati che Footer.js esista

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;