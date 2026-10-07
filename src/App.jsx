import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Comps from './pages/Comps';
import Format from './pages/Format';
import Sponsors from './pages/Sponsors';
import Contact from './pages/Contact';
import PromptsPortal from './pages/PromptsPortal';
import SubmissionPortal from './pages/SubmissionPortal';
import RocketryPrompt from './pages/RocketryPrompt';
import AerossPrixPrompt from './pages/AerossPrixPrompt';
import {
  GenericPromptPortal,
  SettlementPrompt,
  VolatusPrompt,
  DisputePrompt,
  BppPrompt,
  TheatrePrompt,
  GameJamPrompt
} from './pages/prompts';

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [registerDropdownOpen, setRegisterDropdownOpen] = useState(false);
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

  // Close mobile menu and dropdown whenever the route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setRegisterDropdownOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About AEROSS' },
    { path: '/comps', label: 'The Comps' },
    { path: '/format', label: 'Format & Dates' },
    { path: '/sponsors', label: 'Sponsors' },
    { path: '/contact', label: 'Contact' }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-ink border-b-2 border-bone">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          <Link to="/" className="flex-shrink-0 flex items-center font-display font-bold text-xl sm:text-2xl text-bone tracking-widest uppercase hover:text-crimson transition-colors">
            CELESTECON
          </Link>
          <div className="hidden md:flex space-x-6">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-label uppercase tracking-widest transition-colors hover:text-crimson ${location.pathname === link.path ? 'text-crimson' : 'text-bone-dim'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-1.5 sm:gap-4">
            {/* Desktop Registration Dropdown */}
            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setRegisterDropdownOpen(!registerDropdownOpen)}
                className="px-3 sm:px-4 py-1.5 bg-crimson text-bone-hi font-label text-xs sm:text-sm font-bold uppercase tracking-widest border border-crimson hover:bg-ink hover:text-crimson transition-colors flex items-center gap-1.5 cursor-pointer"
                aria-haspopup="true"
                aria-expanded={registerDropdownOpen}
              >
                <span>Register</span>
                <svg className={`w-3.5 h-3.5 transition-transform ${registerDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {registerDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-ink border-2 border-bone shadow-2xl p-2 z-50"
                  onMouseLeave={() => setRegisterDropdownOpen(false)}
                >
                  <a
                    href="/celestecon_registration.html"
                    onClick={() => setRegisterDropdownOpen(false)}
                    className="block p-2.5 hover:bg-bone/10 transition-colors border-b border-bone/20 text-left"
                  >
                    <div className="font-label font-bold text-sm text-bone uppercase tracking-wider">
                      School Contingent
                    </div>
                    <p className="font-label text-xs text-bone-dim mt-0.5">Official school delegation entry portal.</p>
                  </a>
                  <Link
                    to="/prompts"
                    onClick={() => setRegisterDropdownOpen(false)}
                    className="block p-2.5 hover:bg-bone/10 transition-colors border-b border-bone/20 text-left"
                  >
                    <div className="font-label font-bold text-sm text-crimson uppercase tracking-wider">
                      Prompts Portal
                    </div>
                    <p className="font-label text-xs text-bone-dim mt-0.5">Problem statements &amp; event dossiers.</p>
                  </Link>
                  <Link
                    to="/submissions"
                    onClick={() => setRegisterDropdownOpen(false)}
                    className="block p-2.5 hover:bg-bone/10 transition-colors border-b border-bone/20 text-left"
                  >
                    <div className="font-label font-bold text-sm text-bone uppercase tracking-wider">
                      Submission Portal
                    </div>
                    <p className="font-label text-xs text-bone-dim mt-0.5">Upload deliverables &amp; verify UID.</p>
                  </Link>
                  <a
                    href="https://drive.google.com/file/d/182Nn4qDwSNomM5a5mVBkEI7Q_xTQBAWH/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setRegisterDropdownOpen(false)}
                    className="block p-2.5 hover:bg-bone/10 transition-colors text-left group"
                  >
                    <div className="font-label font-bold text-xs text-bone uppercase tracking-wider flex items-center justify-between group-hover:text-crimson">
                      <span>Participant Brochure (PDF)</span>
                      <span>↗</span>
                    </div>
                    <p className="font-label text-[11px] text-bone-dim mt-0.5">Complete guidelines, rules &amp; dossiers.</p>
                  </a>
                </div>
              )}
            </div>

            {/* Mobile Direct Register Button */}
            <a
              href="/celestecon_registration.html"
              className="md:hidden px-2.5 py-1 bg-crimson text-bone-hi font-label text-xs font-bold uppercase tracking-wider border border-crimson hover:bg-ink hover:text-crimson transition-colors"
            >
              Register
            </a>

            <button
              onClick={() => setIsLight(!isLight)}
              className="p-1.5 text-bone hover:text-crimson transition-colors flex items-center justify-center"
              aria-label="Toggle theme"
            >
              {isLight ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></svg>
              )}
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-bone hover:text-crimson transition-colors md:hidden border border-bone/40 flex items-center justify-center"
              aria-label="Toggle Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Full-Screen Overlay Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-14 bottom-0 z-50 bg-ink border-b-2 border-bone p-4 overflow-y-auto flex flex-col justify-between animate-in fade-in duration-150">
            <div className="flex flex-col space-y-2">
              <div className="font-mono text-[10px] text-bone-dim uppercase tracking-[0.2em] px-3 pt-1 pb-1 border-b border-bone/20 font-bold">
                Navigation // 目次
              </div>
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-lg font-label uppercase tracking-widest py-3 px-3 border-l-4 transition-colors ${
                    location.pathname === link.path
                      ? 'border-crimson text-crimson font-bold bg-bone/10'
                      : 'border-transparent text-bone-dim hover:text-bone hover:border-bone/50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t-2 border-bone/30 mt-6 flex flex-col gap-2.5 pb-6">
              <div className="font-mono text-[10px] text-bone-dim uppercase tracking-[0.2em] px-1 font-bold">
                Registration &amp; Documents // 登録
              </div>
              <a
                href="/celestecon_registration.html"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-label uppercase tracking-widest py-3 px-4 bg-crimson text-bone-hi font-bold border-2 border-crimson hover:bg-ink hover:text-crimson transition-colors flex justify-between items-center"
              >
                <span>School Contingent Registration</span>
                <span>↗</span>
              </a>
              <Link
                to="/prompts"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-label uppercase tracking-widest py-2.5 px-4 border border-bone/40 text-bone hover:border-crimson hover:text-crimson transition-colors flex justify-between items-center bg-bone/5"
              >
                <span>Prompts Portal</span>
                <span>&rarr;</span>
              </Link>
              <Link
                to="/submissions"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-label uppercase tracking-widest py-2.5 px-4 border border-crimson/60 text-crimson hover:border-crimson hover:bg-crimson hover:text-bone-hi transition-colors flex justify-between items-center bg-crimson/5 font-bold"
              >
                <span>Submission Portal</span>
                <span>&rarr;</span>
              </Link>
              <a
                href="https://drive.google.com/file/d/182Nn4qDwSNomM5a5mVBkEI7Q_xTQBAWH/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-label uppercase tracking-widest py-2 px-4 border border-bone/40 text-bone-dim hover:border-crimson hover:text-crimson transition-colors flex justify-between items-center bg-bone/5 text-xs"
              >
                <span>Participant Brochure (PDF)</span>
                <span>↗</span>
              </a>

              <div className="pt-3 border-t border-bone/20 flex items-center justify-between font-mono text-[11px] px-1">
                <a
                  href="https://www.instagram.com/aerospace_society/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bone-dim hover:text-crimson transition-colors flex items-center gap-0.5"
                >
                  <span>Instagram</span>
                  <span className="text-[9px]">↗</span>
                </a>
                <span className="text-bone-dim/40">•</span>
                <a
                  href="https://www.linkedin.com/company/aeross-aerospace-society"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bone-dim hover:text-crimson transition-colors flex items-center gap-0.5"
                >
                  <span>LinkedIn</span>
                  <span className="text-[9px]">↗</span>
                </a>
                <span className="text-bone-dim/40">•</span>
                <a
                  href="mailto:aeross@dpsrkp.net"
                  className="text-bone-dim hover:text-crimson transition-colors flex items-center gap-0.5"
                >
                  <span>Email</span>
                  <span className="text-[9px]">↗</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="border-t-4 border-ink-3 mt-12 md:mt-24 py-8 md:py-12 bg-bone text-ink">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div className="sm:col-span-2 md:col-span-1">
            <h3 className="font-display font-bold text-2xl mb-1 text-ink uppercase tracking-wider">AEROSS</h3>
            <p className="font-mono text-xs text-ink-3 uppercase tracking-widest font-bold">"Sky is not the Limit"</p>
          </div>
          <div>
            <h4 className="font-mono text-[10px] text-crimson-deep mb-2 tracking-[0.2em] font-bold uppercase">Quick Links</h4>
            <ul className="space-y-1.5 font-label text-sm uppercase tracking-widest font-semibold text-ink-2">
              <li><Link to="/about" className="hover:text-crimson transition-colors border-b border-transparent hover:border-crimson">About AEROSS</Link></li>
              <li><Link to="/comps" className="hover:text-crimson transition-colors border-b border-transparent hover:border-crimson">The Comps</Link></li>
              <li><Link to="/prompts" className="hover:text-crimson transition-colors border-b border-transparent hover:border-crimson">Prompts Portal</Link></li>
              <li><Link to="/submissions" className="hover:text-crimson transition-colors border-b border-transparent hover:border-crimson">Submission Portal</Link></li>
              <li><Link to="/format" className="hover:text-crimson transition-colors border-b border-transparent hover:border-crimson">Format & Dates</Link></li>
              <li><Link to="/sponsors" className="hover:text-crimson transition-colors border-b border-transparent hover:border-crimson">Sponsors & Partners</Link></li>
              <li><a href="https://drive.google.com/file/d/182Nn4qDwSNomM5a5mVBkEI7Q_xTQBAWH/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="hover:text-crimson transition-colors border-b border-transparent hover:border-crimson">Participant Brochure (PDF) ↗</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-[10px] text-crimson-deep mb-2 tracking-[0.2em] font-bold uppercase">Contact &amp; Social</h4>
            <ul className="space-y-1.5 font-label text-sm uppercase tracking-widest font-semibold text-ink-2">
              <li><a href="mailto:aeross@dpsrkp.net" className="hover:text-crimson transition-colors border-b border-transparent hover:border-crimson">aeross@dpsrkp.net</a></li>
              <li>
                <a
                  href="https://www.instagram.com/aerospace_society/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-crimson transition-colors border-b border-transparent hover:border-crimson inline-flex items-center gap-1"
                >
                  <span>IG: @aerospace_society</span>
                  <span className="text-[10px]">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/aeross-aerospace-society"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-crimson transition-colors border-b border-transparent hover:border-crimson inline-flex items-center gap-1"
                >
                  <span>LI: Aeross: Aerospace Society</span>
                  <span className="text-[10px]">↗</span>
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-[10px] text-crimson-deep mb-2 tracking-[0.2em] font-bold uppercase">Address</h4>
            <address className="not-italic font-label text-sm uppercase tracking-widest font-semibold text-ink-2 leading-relaxed">
              Delhi Public School, R.K. Puram<br />
              New Delhi – 110022
            </address>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t-2 border-ink flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <p className="font-mono text-[10px] text-ink-3 font-bold tracking-widest uppercase">№ CC-VI-2026</p>
          <div className="flex items-center gap-3">
            <span className="font-jp text-[10px] text-crimson font-bold tracking-widest">第六回航空宇宙大会</span>
            <span className="font-mono text-[10px] text-ink-3 font-bold tracking-widest uppercase">&copy; {new Date().getFullYear()} AEROSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const RedirectTo = ({ to }) => {
  useEffect(() => {
    window.location.href = to;
  }, [to]);
  return (
    <div className="py-20 text-center font-mono text-sm text-bone">
      Redirecting to registration portal...
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <div className="bg-grain"></div>
      <div className="min-h-screen flex flex-col relative z-10">
        <Navbar />
        <main className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/comps" element={<Comps />} />
            <Route path="/format" element={<Format />} />
            <Route path="/sponsors" element={<Sponsors />} />
            <Route path="/gallery" element={<Navigate to="/" replace />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/register" element={<RedirectTo to="/celestecon_registration.html" />} />
            <Route path="/register-school" element={<RedirectTo to="/celestecon_registration.html" />} />
            <Route path="/register-individual" element={<RedirectTo to="/celestecon_registration.html" />} />
            <Route path="/prompts" element={<PromptsPortal />} />
            <Route path="/submissions" element={<SubmissionPortal />} />
            <Route path="/portal" element={<SubmissionPortal />} />
            <Route path="/prompts/settlement" element={<SettlementPrompt />} />
            <Route path="/prompts/smt" element={<SettlementPrompt />} />
            <Route path="/prompts/01" element={<SettlementPrompt />} />
            <Route path="/prompts/volatus" element={<VolatusPrompt />} />
            <Route path="/prompts/vol" element={<VolatusPrompt />} />
            <Route path="/prompts/02" element={<VolatusPrompt />} />
            <Route path="/prompts/dispute" element={<DisputePrompt />} />
            <Route path="/prompts/ipod" element={<DisputePrompt />} />
            <Route path="/prompts/03" element={<DisputePrompt />} />
            <Route path="/prompts/bpp" element={<BppPrompt />} />
            <Route path="/prompts/pitch" element={<BppPrompt />} />
            <Route path="/prompts/04" element={<BppPrompt />} />
            <Route path="/prompts/theatre" element={<TheatrePrompt />} />
            <Route path="/prompts/ath" element={<TheatrePrompt />} />
            <Route path="/prompts/05" element={<TheatrePrompt />} />
            <Route path="/prompts/gamejam" element={<GameJamPrompt />} />
            <Route path="/prompts/cjam" element={<GameJamPrompt />} />
            <Route path="/prompts/celestejam" element={<GameJamPrompt />} />
            <Route path="/prompts/06" element={<GameJamPrompt />} />
            <Route path="/prompts/rocketry" element={<RocketryPrompt />} />
            <Route path="/prompts/roc" element={<RocketryPrompt />} />
            <Route path="/prompts/07" element={<RocketryPrompt />} />
            <Route path="/prompts/prix" element={<AerossPrixPrompt />} />
            <Route path="/prompts/f1" element={<AerossPrixPrompt />} />
            <Route path="/prompts/aeross-prix" element={<AerossPrixPrompt />} />
            <Route path="/prompts/aprix" element={<AerossPrixPrompt />} />
            <Route path="/prompts/08" element={<AerossPrixPrompt />} />
            <Route path="/prompts/:eventId" element={<GenericPromptPortal />} />
            <Route path="/Rocketry_CelesteCon2026.html" element={<Navigate to="/prompts/rocketry" replace />} />
            <Route path="/AEROSS_Prix_CelesteCon2026.html" element={<Navigate to="/prompts/prix" replace />} />
            <Route path="/brochure" element={<RedirectTo to="https://drive.google.com/file/d/182Nn4qDwSNomM5a5mVBkEI7Q_xTQBAWH/view?usp=sharing" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
