import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactGA from "react-ga4";
import guidesData from "./guides.json";

// Use the imported guides data
const guides = [...guidesData].sort((a, b) => a.game.localeCompare(b.game));

// Initialize Google Analytics
const TRACKING_ID = "G-MG5Y6K584M"; // Replace with your actual Google Analytics tracking ID
ReactGA.initialize(TRACKING_ID);

function App() {
  const [expandedGames, setExpandedGames] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGuides, setFilteredGuides] = useState(guides);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  
  // Refs for scroll animations
  const heroRef = useRef(null);
  const searchRef = useRef(null);
  const aboutRef = useRef(null);
  const gameListRef = useRef(null);
  const tutorialRef = useRef(null);
  const footerRef = useRef(null);

  // Initialize all games as expanded and set up analytics
  useEffect(() => {
    // Track page view on initial load
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
    
    const initialExpandState = {};
    guides.forEach(guide => {
      initialExpandState[guide.game] = true; // Start expanded
    });
    setExpandedGames(initialExpandState);
    
    // Add scroll event listener
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle search functionality
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredGuides(guides);
    } else {
      const filtered = guides.filter(guide => 
        guide.game.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredGuides(filtered);
      
      // Track search events
      if (searchTerm.trim().length > 2) {
        ReactGA.event({
          category: "Search",
          action: "Game Search",
          label: searchTerm
        });
      }
    }
  }, [searchTerm]);
  
  // Scroll to section with analytics tracking
  const scrollToSection = useCallback((ref) => {
    setMobileMenuOpen(false);
    
    // Get section name for analytics
    let sectionName = "";
    if (ref === heroRef) sectionName = "Home";
    else if (ref === aboutRef) sectionName = "About";
    else if (ref === gameListRef) sectionName = "Games";
    else if (ref === tutorialRef) sectionName = "Tutorial";
    else if (ref === footerRef) sectionName = "Contact";
    
    // Track navigation event
    ReactGA.event({
      category: "Navigation",
      action: "Section Click",
      label: sectionName
    });
    
    ref.current.scrollIntoView({ behavior: 'smooth' });
  }, [heroRef, aboutRef, gameListRef, tutorialRef, footerRef]);

  // Toggle expansion state for a game with analytics
  const toggleExpand = useCallback((game) => {
    setExpandedGames(prev => {
      const newState = { ...prev, [game]: !prev[game] };
      
      // Track expand/collapse events
      ReactGA.event({
        category: "User Interaction",
        action: newState[game] ? "Expand Game" : "Collapse Game",
        label: game
      });
      
      return newState;
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#181818] pt-24 sm:pt-32 pb-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ opacity: 1 }}>
      {/* Lingkaran kuning di kiri atas */}
      {/* <div className="fixed top-0 left-0 w-[600px] h-[600px] bg-[#fccc46]/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div> */}
      {/* Lingkaran emas di kanan bawah */}
      {/* <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-[#b18100]/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div> */}
      {/* Glow kiri atas */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-[#fccc46]/20 rounded-full blur-3xl animate-float"></div>
      {/* Glow kanan bawah */}
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-[#b18100]/20 rounded-full blur-3xl animate-float-alt"></div>

      <div className="min-h-screen bg-transparent text-white font-sans">
        {/* Navigation - Popup style with rounded shape */}
        <div className="fixed top-0 left-0 w-full z-50 px-4 py-6">
          <div className="container mx-auto">
            <nav className="bg-black bg-opacity-70 backdrop-blur-md rounded-xl py-3 px-6 shadow-lg border border-yellow-900">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <img src="/logo.webp" alt="Cleone.ID Logo" className="h-10 mr-3" />
                  <div className="font-caveat text-xl font-bold text-yellow-500">Cleone.ID</div>
                </div>
                
                {/* Mobile menu button */}
                <button 
                  className="md:hidden text-yellow-400 focus:outline-none"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
                
                {/* Desktop menu */}
                <div className="hidden md:flex space-x-8">
                  <button onClick={() => scrollToSection(heroRef)} className="text-yellow-400 hover:text-yellow-300 transition">Home</button>
                  {/* <button onClick={() => scrollToSection(aboutRef)} className="text-yellow-400 hover:text-yellow-300 transition">About</button> */}
                  <button onClick={() => scrollToSection(gameListRef)} className="text-yellow-400 hover:text-yellow-300 transition">Games</button>
                  <button onClick={() => scrollToSection(tutorialRef)} className="text-yellow-400 hover:text-yellow-300 transition">Tutorial</button>
                  <button onClick={() => scrollToSection(footerRef)} className="text-yellow-400 hover:text-yellow-300 transition">Contact</button>
                </div>
              </div>
              
              {/* Mobile menu */}
              {mobileMenuOpen && (
                <div className="md:hidden mt-4 py-4 border-t border-yellow-900 animate-fadeIn">
                  <div className="flex flex-col space-y-4">
                    <button onClick={() => scrollToSection(heroRef)} className="text-yellow-400 hover:text-yellow-300 transition text-left">Home</button>
                    {/* <button onClick={() => scrollToSection(aboutRef)} className="text-yellow-400 hover:text-yellow-300 transition text-left">About</button> */}
                    <button onClick={() => scrollToSection(gameListRef)} className="text-yellow-400 hover:text-yellow-300 transition text-left">Games</button>
                    <button onClick={() => scrollToSection(tutorialRef)} className="text-yellow-400 hover:text-yellow-300 transition text-left">Tutorial</button>
                    <button onClick={() => scrollToSection(footerRef)} className="text-yellow-400 hover:text-yellow-300 transition text-left">Contact</button>
                  </div>
                </div>
              )}
            </nav>
          </div>
        </div>
        
        {/* Empty space to compensate for fixed navbar */}
        <div className="pt-24"></div>
        
        {/* Hero Section */}
        <header ref={heroRef} className="py-28 transition-all duration-700 transform" style={{ opacity: scrollY > 0 ? 1 : 0.95, transform: `translateY(${scrollY > 0 ? '0' : '20px'})` }}>
          <div className="container mx-auto px-4 text-center">
            <div className="bg-black bg-opacity-60 backdrop-blur-md rounded-2xl py-12 px-6 shadow-lg border border-yellow-800 max-w-4xl mx-auto">
              <h1 className="font-caveat text-6xl md:text-7xl font-bold mb-4 text-yellow-500">Guide Cleone.ID</h1>
              <p className="font-caveat text-lg text-yellow-400 max-w-2xl mx-auto mt-4 tracking-wide uppercase">
                RAMAIKAN, LALU MAINKAN
              </p>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto mt-8">
                Ingin mencari panduan game favorit? atau game teman mu? Guide Cleone.ID adalah jawaban untukmu!
              </p>
            </div>
          </div>
        </header>
        
        {/* Search Bar */}
        <div ref={searchRef} className="py-8 transition-all duration-700 transform" style={{ opacity: scrollY > 100 ? 1 : 0.7, transform: `translateY(${scrollY > 100 ? '0' : '20px'})` }}>
          <div className="container mx-auto px-4">
            <div className="bg-black bg-opacity-60 backdrop-blur-md rounded-2xl py-8 px-6 shadow-lg border border-yellow-800 max-w-2xl mx-auto">
              <div className="max-w-md mx-auto relative">
                <input
                  type="text"
                  placeholder="Cari game..."
                  className="w-full bg-gray-900 border-2 border-yellow-600 rounded-full py-3 px-6 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <main className="container mx-auto px-4 py-12">
          <div ref={aboutRef} className="max-w-4xl mx-auto transition-all duration-700 transform" style={{ opacity: scrollY > 200 ? 1 : 0.7, transform: `translateY(${scrollY > 200 ? '0' : '30px'})` }}>
            {/* <div className="bg-black bg-opacity-60 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl border border-yellow-800 mb-16">
              <div className="px-8 py-6">
                <h2 className="text-3xl font-bold text-yellow-500 mb-4">Apa Itu Guide Cleone.ID?</h2>
                <p className="text-gray-300 mb-4">
                  Guide Cleone.ID adalah platform inovatif yang menyediakan kumpulan panduan terbaik untuk berbagai game populer.
                  Setiap panduan dipilih dengan cermat untuk membantu meningkatkan pengalaman bermain game Anda.
                </p>
              </div>
            </div> */}
            
            {filteredGuides.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-xl text-yellow-400">Tidak ada game yang ditemukan. Coba kata kunci lain.</p>
              </div>
            ) : (
              <div ref={gameListRef} className="space-y-6 transition-all duration-700 transform" style={{ opacity: scrollY > 300 ? 1 : 0.7, transform: `translateY(${scrollY > 300 ? '0' : '30px'})` }}>
                <h2 className="font-caveat text-3xl font-bold text-yellow-500 text-center mb-8">Daftar Game</h2>
                
                {filteredGuides.map((group) => (
                  <div key={group.game} className="bg-black bg-opacity-60 backdrop-blur-md rounded-xl overflow-hidden shadow-lg border border-yellow-800 hover:border-yellow-600 transition duration-300">
                    <div 
                      className="px-4 sm:px-6 py-4 flex justify-between items-center cursor-pointer"
                      onClick={() => toggleExpand(group.game)}
                    >
                      <h2 className="text-lg sm:text-xl font-bold text-yellow-400">{group.game}</h2>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-5 w-5 text-yellow-500 transform transition-transform ${expandedGames[group.game] ? 'rotate-180' : ''}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    {expandedGames[group.game] && (
                      <div className="px-6 pb-6">
                        <div className="border-t border-yellow-900 pt-4">
                          <ul className="space-y-3">
                            {group.links.map((link) => (
                              <li key={link.url} className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <a
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-yellow-400 hover:text-yellow-300 transition"
                                >
                                  {link.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
        
        {/* Tutorial Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div ref={tutorialRef} className="bg-black bg-opacity-60 backdrop-blur-md rounded-2xl py-10 px-8 shadow-lg border border-yellow-800 max-w-5xl mx-auto transition-all duration-700 transform" style={{ opacity: scrollY > 500 ? 1 : 0.7, transform: `translateY(${scrollY > 500 ? '0' : '30px'})` }}>
              <h2 className="font-caveat text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-yellow-500">Tutorial</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
                <div className="font-caveat bg-black bg-opacity-60 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-yellow-800 text-center hover:border-yellow-600 transition duration-300 transform hover:scale-105">
                  <h3 className="text-lg sm:text-xl font-bold text-yellow-400 mb-3 sm:mb-4">1. Cari Game</h3>
                  <p className="text-gray-300 text-sm sm:text-base">Pakai fitur pencarian untuk menemukan game yang dimainkan</p>
                </div>
                
                <div className="font-caveat bg-black bg-opacity-60 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-yellow-800 text-center hover:border-yellow-600 transition duration-300 transform hover:scale-105">
                  <h3 className="text-lg sm:text-xl font-bold text-yellow-400 mb-3 sm:mb-4">2. Pilih Panduan</h3>
                  <p className="text-gray-300 text-sm sm:text-base">Klik nama game dan pilih panduan yang mau dilihat</p>
                </div>
                
                <div className="font-caveat bg-black bg-opacity-60 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-yellow-800 text-center hover:border-yellow-600 transition duration-300 transform hover:scale-105">
                  <h3 className="text-lg sm:text-xl font-bold text-yellow-400 mb-3 sm:mb-4">3. Nikmati</h3>
                  <p className="text-gray-300 text-sm sm:text-base">Baca panduan dan tingkatkan skill dalam game</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="py-10">
          <div className="container mx-auto px-4">
            <div ref={footerRef} className="bg-black bg-opacity-60 backdrop-blur-md rounded-2xl py-10 px-8 shadow-lg border border-yellow-800 max-w-5xl mx-auto transition-all duration-700 transform" style={{ opacity: scrollY > 700 ? 1 : 0.7, transform: `translateY(${scrollY > 700 ? '0' : '30px'})` }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-bold text-yellow-500 mb-3 sm:mb-4">About</h3>
                  <p className="text-gray-400 text-sm sm:text-base">Guide Cleone.ID adalah platform untuk mengumpulkan panduan game terbaik dalam satu tempat.</p>
                </div>
                
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-bold text-yellow-500 mb-3 sm:mb-4">Quick Links</h3>
                  <ul className="space-y-2">
                    <li><button onClick={() => scrollToSection(heroRef)} className="text-gray-400 hover:text-yellow-400 transition text-sm sm:text-base">Home</button></li>
                    <li><button onClick={() => scrollToSection(aboutRef)} className="text-gray-400 hover:text-yellow-400 transition text-sm sm:text-base">About</button></li>
                    <li><button onClick={() => scrollToSection(gameListRef)} className="text-gray-400 hover:text-yellow-400 transition text-sm sm:text-base">Games</button></li>
                  </ul>
                </div>
                
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-bold text-yellow-500 mb-3 sm:mb-4">Connect</h3>
                  <ul className="space-y-2">
                    <li><a href="https://cleone.id/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition text-sm sm:text-base">Cleone.ID</a></li>
                  </ul>
                </div>
              </div>
              
              <div className="border-t border-yellow-900 mt-8 pt-8 text-center">
                <p className="text-sm text-yellow-700">© 2025 Guide Cleone.ID. All rights reserved.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
