import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Comps from './pages/Comps';
import Format from './pages/Format';
import Sponsors from './pages/Sponsors';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';

const Navbar = () => {
  const location = useLocation();
  const [isLight, setIsLight] = useState(() => {
    return localStorage.getItem('theme') === 'light';
  });

  useEffect(() => {
    if (isLight) {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
    }
  }, [isLight]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About AEROSS' },
    { path: '/comps', label: 'The Comps' },
    { path: '/format', label: 'Format & Dates' },
    { path: '/sponsors', label: 'Sponsors' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/contact', label: 'Contact' }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-ink border-b-2 border-bone">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          <div className="flex-shrink-0 flex items-center font-display font-bold text-2xl text-bone tracking-widest uppercase">
            CELESTECON
          </div>
          <div className="hidden md:flex space-x-6">
            {navLinks.map(link => (
              <Link 
                key={link.path} 
                to={link.path}
                className={`text-sm font-label uppercase tracking-widest transition-colors hover:text-crimson ${
                  location.pathname === link.path ? 'text-crimson' : 'text-bone-dim'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="/celestecon_registration.html" 
              className="px-4 py-1.5 bg-crimson text-bone-hi font-label text-sm font-bold uppercase tracking-widest border border-crimson hover:bg-ink hover:text-crimson transition-colors"
            >
              Register
            </a>
            <button
              onClick={() => setIsLight(!isLight)}
              className="p-1.5 text-bone hover:text-crimson transition-colors"
              aria-label="Toggle theme"
            >
              {isLight ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="border-t-4 border-ink-3 mt-24 py-12 bg-bone text-ink">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h3 className="font-display font-bold text-2xl mb-2 text-ink uppercase tracking-wider">AEROSS</h3>
            <p className="font-mono text-xs text-ink-3 uppercase tracking-widest font-bold">"Build rather than watch"</p>
          </div>
          <div>
            <h4 className="font-mono text-[10px] text-crimson-deep mb-3 tracking-[0.2em] font-bold uppercase">Quick Links</h4>
            <ul className="space-y-1 font-label text-sm uppercase tracking-widest font-semibold text-ink-2">
              <li><Link to="/about" className="hover:text-crimson transition-colors border-b border-transparent hover:border-crimson">About AEROSS</Link></li>
              <li><Link to="/comps" className="hover:text-crimson transition-colors border-b border-transparent hover:border-crimson">The Comps</Link></li>
              <li><Link to="/format" className="hover:text-crimson transition-colors border-b border-transparent hover:border-crimson">Format & Dates</Link></li>
              <li><Link to="/sponsors" className="hover:text-crimson transition-colors border-b border-transparent hover:border-crimson">Sponsors</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-[10px] text-crimson-deep mb-3 tracking-[0.2em] font-bold uppercase">Contact</h4>
            <ul className="space-y-1 font-label text-sm uppercase tracking-widest font-semibold text-ink-2">
              <li><a href="mailto:aeross@dpsrkp.net" className="hover:text-crimson transition-colors border-b border-transparent hover:border-crimson">aeross@dpsrkp.net</a></li>
              <li>IG: @aerospace_society</li>
              <li>LI: Aeross: Aerospace Society</li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-[10px] text-crimson-deep mb-3 tracking-[0.2em] font-bold uppercase">Address</h4>
            <address className="not-italic font-label text-sm uppercase tracking-widest font-semibold text-ink-2 leading-relaxed">
              Delhi Public School, R.K. Puram<br />
              New Delhi – 110022
            </address>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t-2 border-ink flex flex-col md:flex-row justify-between items-center">
          <p className="font-mono text-[10px] text-ink-3 font-bold tracking-widest uppercase">DOSSIER № CC-VI-2026</p>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <span className="font-jp text-[10px] text-crimson font-bold tracking-widest">第六回航空宇宙大会</span>
            <span className="font-mono text-[10px] text-ink-3 font-bold tracking-widest uppercase">&copy; {new Date().getFullYear()} AEROSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

function App() {
  return (
    <BrowserRouter>
      <div className="bg-grain"></div>
      <div className="min-h-screen flex flex-col relative z-10">
        <Navbar />
        <main className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/comps" element={<Comps />} />
            <Route path="/format" element={<Format />} />
            <Route path="/sponsors" element={<Sponsors />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
