import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Star,
  Home,
  CheckCircle,
  ChevronsLeftRight,
  ArrowLeft,
  ArrowRight,
  X,
  Menu,
  Clock,
  MapPin,
  Calendar,
  FileText,
  BadgeCheck,
  PhoneCall,
  Sparkle
} from 'lucide-react';

interface BookingRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  timeSlot: string;
  propertySize: string;
  addons: string[];
  totalPrice: number;
  notes: string;
  timestamp: string;
}

export default function App() {
  // Smart Navbar state
  const [navHidden, setNavHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  // Booking Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [latestBooking, setLatestBooking] = useState<BookingRecord | null>(null);
  const [bookingHistory, setBookingHistory] = useState<BookingRecord[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    timeSlot: 'Morning Slot (09:00 AM - 01:00 PM)',
    notes: '',
  });

  // Price Calculator State
  const [propertyChoice, setPropertyChoice] = useState({
    id: '1bhk',
    label: '1-2 BHK Apartment',
    price: 1999,
  });

  const [activeAddons, setActiveAddons] = useState<{ [key: string]: boolean }>({
    'Italian Marble Polishing': false,
    'Balcony Deep Sanitization': false,
    'Aroma & Anti-Allergen Polish': false,
    'Chandelier Crystal Buffing': false,
  });

  const addonList: { [key: string]: { price: number; desc: string } } = {
    'Italian Marble Polishing': { price: 999, desc: 'Diamond-pad buffing & crystallization' },
    'Balcony Deep Sanitization': { price: 1499, desc: 'High-pressure wash & tile degrease' },
    'Aroma & Anti-Allergen Polish': { price: 699, desc: 'Organic botanical mist & furniture wax' },
    'Chandelier Crystal Buffing': { price: 1199, desc: 'Ultrasonic micro-fiber prism detailing' },
  };

  const calculatedTotal =
    propertyChoice.price +
    Object.keys(activeAddons).reduce(
      (sum, name) => (activeAddons[name] ? sum + addonList[name].price : sum),
      0
    );

  // Before / After Slider State
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const [activeScenario, setActiveScenario] = useState<'bathroom' | 'kitchen' | 'living'>('bathroom');
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  // Stats Counters
  const [stats, setStats] = useState({
    germs: 0,
    transformations: 0,
    auditItems: 0,
    eco: 0,
  });
  const statsRef = useRef<HTMLDivElement>(null);

  // Smart Header Scroll Listener (Hide when scrolling down, show when scrolling up)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 120 && currentScrollY > lastScrollY.current) {
        setNavHidden(true);
      } else {
        setNavHidden(false);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Stats Count-up animation
  useEffect(() => {
    let triggered = false;
    const checkVisibility = () => {
      if (statsRef.current && !triggered) {
        const rect = statsRef.current.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.85) {
          triggered = true;
          const duration = 1800;
          const steps = 45;
          let step = 0;
          const timer = setInterval(() => {
            step++;
            const progress = step / steps;
            const ease = 1 - Math.pow(1 - progress, 3);
            setStats({
              germs: Math.floor(ease * 99),
              transformations: Math.floor(ease * 15),
              auditItems: Math.floor(ease * 140),
              eco: Math.floor(ease * 100),
            });
            if (step >= steps) {
              setStats({ germs: 99, transformations: 15, auditItems: 140, eco: 100 });
              clearInterval(timer);
            }
          }, duration / steps);
        }
      }
    };

    window.addEventListener('scroll', checkVisibility, { passive: true });
    checkVisibility();
    return () => window.removeEventListener('scroll', checkVisibility);
  }, []);

  // Slider Mouse & Touch tracking
  const updateSliderPos = (clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const raw = ((clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, raw)));
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDraggingSlider) updateSliderPos(e.clientX);
    };
    const onMouseUp = () => setIsDraggingSlider(false);

    const onTouchMove = (e: TouchEvent) => {
      if (isDraggingSlider && e.touches[0]) updateSliderPos(e.touches[0].clientX);
    };
    const onTouchEnd = () => setIsDraggingSlider(false);

    if (isDraggingSlider) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', onTouchEnd);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDraggingSlider]);

  // Handle Form Submission
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const chosenAddons = Object.keys(activeAddons).filter((k) => activeAddons[k]);
    const newRecord: BookingRecord = {
      id: `SPK-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      date: formData.date,
      timeSlot: formData.timeSlot,
      propertySize: propertyChoice.label,
      addons: chosenAddons,
      totalPrice: calculatedTotal,
      notes: formData.notes,
      timestamp: new Date().toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setLatestBooking(newRecord);
    setBookingHistory((prev) => [newRecord, ...prev]);
    setBookingConfirmed(true);
  };

  const openBookingModalWithCurrentEstimate = () => {
    setBookingConfirmed(false);
    setIsModalOpen(true);
  };

  // Slider Scenarios
  const scenarioData = {
    bathroom: {
      title: 'Luxury Ensuite & Rainfall Shower Fixtures',
      desc: 'Complete dissolution of stubborn hard-water calcium, crystal glass sealing, and sanitized grout lines.',
      after: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=80',
      before: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1600&q=80',
    },
    kitchen: {
      title: 'Chef Kitchen & Rangehood Degreasing',
      desc: 'Heavy grease baffle extraction, gas burner carbon removal, and food-grade stainless buffing.',
      after: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80',
      before: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80',
    },
    living: {
      title: 'Penthouse Salon & Hardwood Floor Refinish',
      desc: 'Dust-mite extraction, botanical conditioning of fine woodwork, and streak-free panorama glazing.',
      after: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      before: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80',
    },
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-200 font-sans selection:bg-[#C99E52] selection:text-[#07090E] relative overflow-x-hidden">
      {/* Ambient Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="fixed bottom-10 right-0 w-[450px] h-[400px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* ================= SMART FLOATING NAVBAR ================= */}
      <header
        id="navbar"
        className={`smart-navbar fixed top-4 left-0 right-0 z-50 px-4 sm:px-8 ${navHidden ? 'nav-hidden' : ''}`}
      >
        <nav className="max-w-6xl mx-auto glass-card rounded-2xl px-6 py-3.5 flex items-center justify-between shadow-2xl border border-gold-500/25">
          {/* Logo Mark */}
          <a href="#" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-gold-500 to-gold-300 flex items-center justify-center text-noir-950 font-bold shadow-lg shadow-gold-500/20 group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-5 h-5 text-[#07090E]" />
            </div>
            <div>
              <span className="text-lg font-serif tracking-wider text-white font-bold block leading-none">
                Sparkle<span className="gold-gradient">Pro</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-gold-400 font-semibold block mt-0.5">
                Premium Detailing
              </span>
            </div>
          </a>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-8 text-xs uppercase tracking-wider font-semibold text-slate-300">
            <a href="#showcase" className="hover:text-gold-400 transition">
              Showcase
            </a>
            <a href="#comparison" className="hover:text-gold-400 transition">
              Before & After
            </a>
            <a href="#calculator" className="hover:text-gold-400 transition">
              Pricing Estimator
            </a>
          </div>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {bookingHistory.length > 0 && (
              <button
                onClick={() => setShowHistoryModal(true)}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-noir-800 text-gold-400 border border-gold-500/30 hover:border-gold-500 transition flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                Bookings ({bookingHistory.length})
              </button>
            )}
            <button
              onClick={openBookingModalWithCurrentEstimate}
              className="gold-btn px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold cursor-pointer"
            >
              Reserve Service
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 max-w-6xl mx-auto glass-card rounded-2xl p-5 border border-gold-500/25 shadow-2xl space-y-3">
            <a
              href="#showcase"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs uppercase tracking-wider font-semibold text-slate-300 hover:text-gold-400 py-1"
            >
              Showcase
            </a>
            <a
              href="#comparison"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs uppercase tracking-wider font-semibold text-slate-300 hover:text-gold-400 py-1"
            >
              Before & After
            </a>
            <a
              href="#calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs uppercase tracking-wider font-semibold text-slate-300 hover:text-gold-400 py-1"
            >
              Pricing Estimator
            </a>

            {bookingHistory.length > 0 && (
              <button
                onClick={() => {
                  setShowHistoryModal(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-noir-800 border border-gold-500/30 text-gold-400 text-xs font-semibold flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" /> View My Bookings ({bookingHistory.length})
              </button>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openBookingModalWithCurrentEstimate();
              }}
              className="w-full gold-btn py-3 rounded-xl text-xs uppercase tracking-wider font-bold mt-2"
            >
              Reserve Service
            </button>
          </div>
        )}
      </header>

      {/* ================= HERO SECTION WITH FLOATING BADGES ================= */}
      <section id="showcase" className="relative pt-36 pb-20 px-4 sm:px-8 max-w-6xl mx-auto z-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass-pill mb-6">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs uppercase tracking-widest text-gold-300 font-semibold">
              Hospital-Grade Sterilization Protocol
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif text-white font-bold leading-tight mb-6">
            Curating Perfection In <br />
            <span className="gold-gradient italic">Every Luxury Living Space.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 font-light mb-10 max-w-xl mx-auto leading-relaxed">
            Deep sanitization, architectural stone care, and private housekeeping executed with discretion and clinical
            precision.
          </p>
        </div>

        {/* Hero Estate Showcase with Floating Badges */}
        <div className="relative max-w-4xl mx-auto mt-6">
          {/* Main Estate Visual */}
          <div className="relative rounded-3xl overflow-hidden border border-gold-500/20 shadow-2xl group">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
              alt="Luxury Home Detailing"
              className="w-full h-[360px] sm:h-[480px] object-cover filter brightness-95 group-hover:scale-105 transition duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-noir-950/80 via-transparent to-transparent pointer-events-none" />

            {/* Bottom-left inspection pass indicator */}
            <div className="absolute bottom-6 left-6 flex items-center space-x-2 glass-pill px-4 py-2 rounded-xl border border-emerald-500/30">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-white tracking-wide">
                Post-Service 50-Point Inspection Passed
              </span>
            </div>
          </div>

          {/* Floating Badge 1: Rating (Top-Left) */}
          <div className="absolute -top-6 -left-2 sm:-left-8 glass-card p-4 rounded-2xl shadow-2xl border border-gold-500/40 flex items-center space-x-3.5 backdrop-blur-xl animate-bounce-slow">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-400 to-gold-300 flex items-center justify-center text-noir-950 shadow-md shadow-amber-400/20">
              <Star className="w-6 h-6 fill-current text-[#07090E]" />
            </div>
            <div>
              <div className="text-base font-bold text-white font-sans flex items-center gap-1">
                4.96 <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
              </div>
              <p className="text-[11px] text-slate-300 uppercase tracking-wider font-medium">
                Over 2,400+ Verified Reviews
              </p>
            </div>
          </div>

          {/* Floating Badge 2: Completed Homes in 2026 (Bottom-Right) */}
          <div className="absolute -bottom-6 -right-2 sm:-right-8 glass-card p-4 rounded-2xl shadow-2xl border border-emerald-500/30 flex items-center space-x-3.5 backdrop-blur-xl">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base font-bold text-white font-sans">15,000+</div>
              <p className="text-[11px] text-slate-300 uppercase tracking-wider font-medium">Homes Cleaned in 2026</p>
            </div>
          </div>
        </div>

        {/* Verified Stats Grid */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-20 pt-10 border-t border-slate-800/80 text-center"
        >
          <div>
            <p className="text-3xl font-serif font-bold text-white tabular-nums">{stats.germs}%</p>
            <p className="text-xs uppercase tracking-wider text-slate-400 mt-1">Germ & Bacteria Removal</p>
          </div>
          <div>
            <p className="text-3xl font-serif font-bold text-white tabular-nums">{stats.transformations}k+</p>
            <p className="text-xs uppercase tracking-wider text-slate-400 mt-1">Sparkling Transformations</p>
          </div>
          <div>
            <p className="text-3xl font-serif font-bold text-white tabular-nums">{stats.auditItems}+</p>
            <p className="text-xs uppercase tracking-wider text-slate-400 mt-1">Checklist Audit Items</p>
          </div>
          <div>
            <p className="text-3xl font-serif font-bold text-white tabular-nums">{stats.eco}%</p>
            <p className="text-xs uppercase tracking-wider text-slate-400 mt-1">Eco-Safe Formulations</p>
          </div>
        </div>
      </section>

      {/* ================= INTERACTIVE BEFORE / AFTER SLIDER ================= */}
      <section id="comparison" className="py-20 px-4 sm:px-8 max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass-pill mb-3">
            <span className="text-[11px] uppercase tracking-widest text-emerald-400 font-bold">
              Uncompromising Standard
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">Interactive Transformation Showcase</h2>
          <p className="text-xs text-slate-400 mt-2">Drag slider left and right to inspect the sanitization finish</p>
        </div>

        {/* Scenario Switchers */}
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setActiveScenario('bathroom')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition cursor-pointer ${
              activeScenario === 'bathroom'
                ? 'gold-btn'
                : 'glass-card text-slate-400 hover:text-white border-gold-500/20'
            }`}
          >
            Master Bathroom
          </button>
          <button
            onClick={() => setActiveScenario('kitchen')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition cursor-pointer ${
              activeScenario === 'kitchen'
                ? 'gold-btn'
                : 'glass-card text-slate-400 hover:text-white border-gold-500/20'
            }`}
          >
            Gourmet Kitchen
          </button>
          <button
            onClick={() => setActiveScenario('living')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition cursor-pointer ${
              activeScenario === 'living'
                ? 'gold-btn'
                : 'glass-card text-slate-400 hover:text-white border-gold-500/20'
            }`}
          >
            Penthouse Salon
          </button>
        </div>

        <div className="text-center mb-4">
          <h3 className="font-serif font-bold text-white text-lg">{scenarioData[activeScenario].title}</h3>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">{scenarioData[activeScenario].desc}</p>
        </div>

        {/* Slider Frame */}
        <div
          ref={sliderContainerRef}
          onMouseDown={() => setIsDraggingSlider(true)}
          onTouchStart={() => setIsDraggingSlider(true)}
          className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl border border-gold-500/25 select-none touch-none group cursor-ew-resize bg-noir-950"
        >
          {/* Clean "After" Image Layer */}
          <img
            src={scenarioData[activeScenario].after}
            alt="Clean Sparkling Result"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 right-4 bg-emerald-500/90 text-noir-950 font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-wider shadow-lg pointer-events-none">
            After (SparklePro)
          </div>

          {/* Dusty "Before" Image Layer (Clipped Container) */}
          <div
            className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none"
            style={{ width: `${sliderPosition}%` }}
          >
            <img
              src={scenarioData[activeScenario].before}
              alt="Untidy Before State"
              className="absolute top-0 left-0 max-w-none h-full object-cover filter contrast-75 brightness-75 sepia-[.25]"
              style={{
                width: sliderContainerRef.current ? `${sliderContainerRef.current.offsetWidth}px` : '100%',
              }}
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 left-4 bg-noir-950/80 backdrop-blur-md text-slate-300 border border-slate-700 font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-wider">
              Before
            </div>
          </div>

          {/* Interactive Draggable Divider */}
          <div
            className="absolute inset-y-0 w-1 bg-gold-400 flex items-center justify-center -translate-x-1/2 slider-handle-gold pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="w-10 h-10 rounded-full bg-noir-950 border-2 border-gold-400 flex items-center justify-center text-gold-400 shadow-2xl group-hover:scale-110 transition pointer-events-auto">
              <ChevronsLeftRight className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Direction Instructions */}
        <div className="flex justify-between items-center text-xs text-slate-400 mt-4 px-2">
          <span className="flex items-center gap-1.5 font-medium">
            <ArrowLeft className="w-4 h-4 text-gold-400" /> Drag left to view Before state
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            Drag right to view Pristine After <ArrowRight className="w-4 h-4 text-emerald-400" />
          </span>
        </div>
      </section>

      {/* ================= INSTANT PRICE ESTIMATE CALCULATOR ================= */}
      <section id="calculator" className="py-20 px-4 sm:px-8 max-w-4xl mx-auto relative z-10">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-gold-500/30">
          <div className="text-center mb-10">
            <div className="inline-flex items-center space-x-2 px-4 py-1 rounded-full glass-pill mb-3">
              <span className="text-[11px] uppercase tracking-widest text-emerald-400 font-bold">
                Transparent Pricing
              </span>
            </div>
            <h2 className="text-3xl font-serif font-bold text-white">Instant Estimate Calculator</h2>
            <p className="text-xs text-slate-400 mt-1">No surprise fees. Transparent quoting customized for your home.</p>
          </div>

          <div className="space-y-8">
            {/* Step 1: Property Size */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-3 font-semibold">
                1. Property Size
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: '1bhk', label: '1-2 BHK Apartment', price: 1999 },
                  { id: '3bhk', label: '3 BHK Penthouse', price: 3499 },
                  { id: 'villa', label: 'Luxury Duplex/Villa', price: 5999 },
                  { id: 'mansion', label: 'Grand Estate', price: 9999 },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setPropertyChoice({
                        id: item.id,
                        label: item.label,
                        price: item.price,
                      })
                    }
                    className={`py-3 px-3 rounded-xl text-xs font-semibold text-center border transition cursor-pointer ${
                      propertyChoice.id === item.id
                        ? 'border-gold-500 bg-gold-500/10 text-gold-300 shadow-lg shadow-gold-500/10'
                        : 'border-gold-500/20 bg-noir-800 text-slate-300 hover:border-gold-500'
                    }`}
                  >
                    <div>{item.label}</div>
                    <div className="text-[11px] text-gold-400 font-bold mt-1">₹{item.price.toLocaleString('en-IN')}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Specialty Add-ons */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-3 font-semibold">
                2. Specialty Add-ons
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.keys(addonList).map((addonName) => (
                  <label
                    key={addonName}
                    className={`flex items-start space-x-3 p-3.5 rounded-xl border cursor-pointer transition ${
                      activeAddons[addonName]
                        ? 'bg-gold-500/10 border-gold-500/60'
                        : 'bg-noir-800/80 border-slate-800 hover:border-gold-500/40'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={activeAddons[addonName] || false}
                      onChange={(e) =>
                        setActiveAddons((prev) => ({
                          ...prev,
                          [addonName]: e.target.checked,
                        }))
                      }
                      className="accent-[#C99E52] w-4 h-4 rounded mt-0.5 cursor-pointer"
                    />
                    <div>
                      <div className="text-xs text-slate-200 font-medium">{addonName}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{addonList[addonName].desc}</div>
                      <div className="text-[11px] text-gold-400 font-bold mt-1">
                        +₹{addonList[addonName].price.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Total & CTA */}
            <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-xs uppercase text-slate-400 tracking-wider">Estimated Total</p>
                <p className="text-4xl font-serif font-bold text-white mt-1 tabular-nums">
                  ₹<span>{calculatedTotal.toLocaleString('en-IN')}</span>{' '}
                  <span className="text-xs font-sans font-normal text-slate-500">/ Session (all-inclusive)</span>
                </p>
              </div>
              <button
                onClick={openBookingModalWithCurrentEstimate}
                className="gold-btn px-8 py-3.5 rounded-xl text-xs font-bold tracking-wider uppercase w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Book Appointment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= VIP BOOKING MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-noir-950/80 backdrop-blur-md z-50 flex items-center justify-center px-4 overflow-y-auto">
          <div className="glass-card max-w-md w-full p-8 rounded-3xl border border-gold-500/40 relative shadow-2xl my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {!bookingConfirmed ? (
              <div>
                <h3 className="text-2xl font-serif font-bold text-white mb-1">Confirm Service Booking</h3>
                <p className="text-xs text-slate-400 mb-6">
                  Our priority operations desk will confirm your appointment in 15 minutes.
                </p>

                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase text-slate-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Mr. / Ms. Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-noir-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase text-slate-400 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-noir-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase text-slate-400 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="resident@luxuryhome.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-noir-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs uppercase text-slate-400 mb-1">Preferred Slot</label>
                      <input
                        type="date"
                        required
                        value={formData.date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full bg-noir-800 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-slate-400 mb-1">Time Window</label>
                      <select
                        value={formData.timeSlot}
                        onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                        className="w-full bg-noir-800 border border-slate-700 rounded-lg px-2 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500"
                      >
                        <option>Morning (09:00 AM - 01:00 PM)</option>
                        <option>Afternoon (02:00 PM - 06:00 PM)</option>
                        <option>Full Day Master Detail</option>
                      </select>
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="p-3 bg-noir-800/90 rounded-xl border border-gold-500/20 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Selected Layout:</span>
                      <span className="text-gold-300 font-semibold">{propertyChoice.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Price:</span>
                      <span className="text-gold-400 font-bold">₹{calculatedTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase text-slate-400 mb-1">Access Instructions / Notes</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Gate security code, special attention to master bath marble..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full bg-noir-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="gold-btn w-full py-3 rounded-lg text-xs uppercase font-bold tracking-wider mt-4 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Reserve Priority Slot</span>
                    <CheckCircle className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              /* Success View */
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/30 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-gold-400" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-white">Booking Confirmed</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Thank you, <strong className="text-gold-300">{latestBooking?.name}</strong>. Your priority appointment
                  request has been recorded. Our team will contact you within 15 minutes.
                </p>

                {latestBooking && (
                  <div className="bg-noir-800/90 p-4 rounded-2xl border border-gold-500/20 text-left text-xs space-y-2 mt-4">
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                      <span className="text-slate-400">Booking Reference:</span>
                      <span className="font-mono text-gold-400 font-bold">{latestBooking.id}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                      <span className="text-slate-400">Configuration:</span>
                      <span className="text-slate-200">{latestBooking.propertySize}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                      <span className="text-slate-400">Date & Slot:</span>
                      <span className="text-slate-200">
                        {latestBooking.date} ({latestBooking.timeSlot.split(' ')[0]})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Price:</span>
                      <span className="font-bold text-gold-400">₹{latestBooking.totalPrice.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                )}

                <div className="pt-2 flex gap-3 justify-center">
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setBookingConfirmed(false);
                    }}
                    className="px-6 py-2.5 gold-btn rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Done
                  </button>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setShowHistoryModal(true);
                    }}
                    className="px-5 py-2.5 glass-card text-gold-400 hover:text-white rounded-xl text-xs font-semibold cursor-pointer border-gold-500/30"
                  >
                    View All Bookings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= BOOKINGS HISTORY MODAL ================= */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-noir-950/80 backdrop-blur-md z-50 flex items-center justify-center px-4">
          <div className="glass-card max-w-lg w-full p-8 rounded-3xl border border-gold-500/40 relative shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gold-400" />
                <h3 className="font-serif font-bold text-xl text-white">Your Priority Bookings</h3>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 py-4 space-y-4">
              {bookingHistory.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Calendar className="w-10 h-10 mx-auto mb-2 opacity-40 text-gold-400" />
                  <p className="text-sm">No reservations booked in this session.</p>
                </div>
              ) : (
                bookingHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-noir-800/80 border border-gold-500/20 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-gold-400 text-sm">{item.id}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
                        CONFIRMED DISPATCH
                      </span>
                    </div>
                    <div className="font-serif font-bold text-white text-base">{item.propertySize}</div>
                    <div className="text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gold-500" />
                      <span>
                        {item.date} · {item.timeSlot}
                      </span>
                    </div>
                    {item.addons.length > 0 && (
                      <div className="text-slate-400 text-[11px]">
                        Add-ons: <span className="text-slate-200">{item.addons.join(', ')}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-slate-800/80 font-medium">
                      <span className="text-gold-400 font-bold">₹{item.totalPrice.toLocaleString('en-IN')}</span>
                      <span className="text-slate-500">{item.timestamp}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-6 py-2 gold-btn rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= FOOTER ================= */}
      <footer className="py-10 text-center text-slate-500 text-xs border-t border-slate-900 bg-[#07090E] relative z-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-gold-400 flex items-center justify-center text-noir-950 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#07090E]" />
            </div>
            <span className="font-serif font-bold text-white tracking-wider">SparklePro Concierge</span>
          </div>
          <p>&copy; 2026 SparklePro Concierge. Premium Housekeeping Standards.</p>
          <div className="flex items-center space-x-6 text-slate-400">
            <a href="#showcase" className="hover:text-gold-400 transition">
              Showcase
            </a>
            <a href="#comparison" className="hover:text-gold-400 transition">
              Before & After
            </a>
            <a href="#calculator" className="hover:text-gold-400 transition">
              Pricing
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
