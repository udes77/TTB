import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Phone, 
  Clock, 
  ShieldCheck, 
  MapPin, 
  Truck, 
  Car, 
  Wrench, 
  ChevronRight, 
  Star,
  Menu,
  X,
  Facebook,
  Instagram,
  Mail,
  Navigation,
  Box,
  Home as HomeIcon,
  Anchor,
  Tent,
  Siren,
  Construction
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'motion/react';
import { PHONE_NUMBER, PHONE_LINK, GITHUB_IMAGE_BASE, GALLERY_IMAGES } from './constants';
import { SanityProvider, useSanity } from './context/SanityContext';
import EmergencyLocation from './pages/EmergencyLocation';
import ServicePage from './pages/ServicePage';
import SuburbPage from './pages/SuburbPage';
import SuburbsList from './pages/SuburbsList';
import Admin from './pages/Admin';
import Gallery from './pages/Gallery';

// --- Components ---

const FlashingLights = () => (
  <div className="flex gap-1">
    <div className="w-3 h-1.5 bg-yellow-400 rounded-full animate-flash-yellow shadow-[0_0_15px_rgba(250,204,21,0.8)]" />
    <div className="w-3 h-1.5 bg-cyan-400 rounded-full animate-flash-blue shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
    <div className="w-3 h-1.5 bg-yellow-400 rounded-full animate-flash-yellow shadow-[0_0_15px_rgba(250,204,21,0.8)]" />
    <div className="w-3 h-1.5 bg-cyan-400 rounded-full animate-flash-blue shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
  </div>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const location = useLocation();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services', href: '/#services' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Areas', href: '/#areas' },
    { name: 'FAQ', href: '/#faq' },
    { name: 'About', href: '/#about' },
    { name: 'Contact', href: '/#contact' },
  ];

  const isHome = location.pathname === '/';

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled || !isHome ? 'bg-slate-950 shadow-md py-2' : 'bg-transparent py-4'}`}>
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-400 origin-left"
        style={{ scaleX }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="flex flex-col items-center gap-1">
              <FlashingLights />
              <div className="flex items-center gap-2">
                <div className="bg-yellow-400 p-1.5 sm:p-2 rounded-lg shadow-[0_0_10px_rgba(250,204,21,0.3)]">
                  <Truck className="text-slate-950 h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <span className={`font-bold text-base sm:text-xl tracking-tight text-white`}>
                  Tow Trucks <span className="text-yellow-400">Brisbane</span>
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className={`text-sm font-medium transition-colors hover:text-cyan-400 ${scrolled || !isHome ? 'text-slate-300' : 'text-white/90'}`}
              >
                {link.name}
              </a>
            ))}
            <a 
              href={PHONE_LINK} 
              className="bg-yellow-400 hover:bg-yellow-500 text-slate-950 px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-yellow-400/20"
            >
              <Phone size={16} />
              {PHONE_NUMBER}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="text-white" /> : <Menu className="text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'calc(100vh - 64px)' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900 border-b border-slate-800 overflow-y-auto"
          >
            <div className="px-4 pt-4 pb-20 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block px-3 py-4 text-base font-medium text-slate-300 hover:text-yellow-400 hover:bg-slate-800 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <a 
                href={PHONE_LINK} 
                className="flex items-center justify-center gap-2 w-full bg-yellow-400 text-slate-950 px-4 py-4 rounded-lg font-bold mt-4"
              >
                <Phone size={18} />
                Call {PHONE_NUMBER}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const ServiceCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-lg hover:border-cyan-400 transition-all group"
  >
    <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center mb-6 group-hover:bg-yellow-400 transition-colors shadow-[0_0_15px_rgba(0,0,0,0.3)]">
      <Icon className="text-yellow-400 group-hover:text-slate-950 transition-colors" size={28} />
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{description}</p>
  </motion.div>
);

const AreaTag: React.FC<{ name: string }> = ({ name }) => (
  <span className="inline-flex items-center px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-700 hover:border-yellow-400 hover:text-yellow-400 transition-colors cursor-default">
    <MapPin size={14} className="mr-2 opacity-50" />
    {name}
  </span>
);

const InsuranceSection = () => {
  const insurers = [
    { name: 'Allianz', logo: '1_Allianz.png' },
    { name: 'Apia', logo: '2_Apia.png' },
    { name: 'Auto & General', logo: '3_Auto.png' },
    { name: 'Budget Direct', logo: '4_Budget.png' },
    { name: 'Coles', logo: '5_coles.png' },
    { name: 'Insure My Ride', logo: '6_Insure-MyRide.png' },
    { name: 'NRMA', logo: '7_NRMA.png' },
    { name: 'QBE', logo: '8_QBE.png' },
    { name: 'RACQ', logo: '9_RacQ.png' },
    { name: 'Shannons', logo: '10_Shannons.png' },
    { name: 'Toyota', logo: '12_Toyota-Logo.png' },
    { name: 'Wesfarmers', logo: '13_wesfarmers.png' },
    { name: 'Youi', logo: '14_youi.png' },
    { name: 'Zurich', logo: '15_zurich-insurance-group-logo.png' },
  ];

  return (
    <section className="py-24 bg-slate-950 overflow-hidden border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center">
          <h2 className="text-yellow-400 font-bold tracking-widest uppercase text-sm mb-4">Insurance Partners</h2>
          <h3 className="text-4xl font-bold text-white mb-6">We Bill Your Insurance Directly</h3>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Had an accident? We work with all major Australian insurance providers to make the recovery process as seamless as possible. We can often bill them directly, so you have one less thing to worry about.
          </p>
        </div>
      </div>

      <div className="relative flex overflow-x-hidden">
        <div className="animate-marquee whitespace-nowrap flex items-center py-4">
          {[...insurers, ...insurers].map((insurer, i) => (
            <div key={i} className="mx-16 flex flex-col items-center justify-center transition-all duration-500 hover:scale-110">
              <div className="w-64 h-32 flex items-center justify-center mb-4 p-4 bg-white rounded-xl shadow-sm border border-slate-200">
                <img 
                  src={`${GITHUB_IMAGE_BASE}${insurer.logo}`} 
                  alt={insurer.name} 
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${insurer.name}&background=f59e0b&color=fff&bold=true&size=128`;
                  }}
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{insurer.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


const Reveal = ({ children, width = "100%" }: { children: React.ReactNode, width?: "100%" | "fit-content" }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 75 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: 0.25 }}
      style={{ width }}
    >
      {children}
    </motion.div>
  );
};

const Home = () => {
  const { services, suburbs, isSanityConnected } = useSanity();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const [formState, setFormState] = React.useState({
    name: '',
    phone: '',
    service: 'General Towing',
    message: ''
  });
  const [formStatus, setFormStatus] = React.useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState)
      });
      if (res.ok) {
        setFormStatus({ type: 'success', message: 'Thank you! We will contact you shortly.' });
        setFormState({ name: '', phone: '', service: 'General Towing', message: '' });
      } else {
        throw new Error();
      }
    } catch (error) {
      setFormStatus({ type: 'error', message: 'Something went wrong. Please call us directly.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Tow Trucks Brisbane",
    "image": `${GITHUB_IMAGE_BASE}Tow-trucks-brisbane1.jpg`,
    "@id": "https://towtrucksbrisbane.com.au",
    "url": "https://towtrucksbrisbane.com.au",
    "telephone": PHONE_NUMBER,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "2/460 Beaudesert Rd",
      "addressLocality": "Salisbury",
      "addressRegion": "QLD",
      "postalCode": "4107",
      "addressCountry": "AU"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -27.5524,
      "longitude": 153.0261
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "sameAs": [
      "https://www.facebook.com/towtrucksbrisbane",
      "https://www.instagram.com/towtrucksbrisbane"
    ]
  };

  return (
    <>
      <Helmet>
        <title>Tow Trucks Brisbane | 24/7 Emergency Towing & Roadside Assistance</title>
        <meta name="description" content={`Reliable 24/7 towing services in Brisbane since 1992. We offer emergency breakdown towing, car transport, and roadside assistance. Call ${PHONE_NUMBER} for fast response.`} />
        <meta name="keywords" content="towing brisbane, tow trucks brisbane, emergency towing, roadside assistance brisbane, car transport brisbane, cheap towing brisbane" />
        <link rel="canonical" href="https://towtrucksbrisbane.com.au" />
        <meta property="og:title" content="Tow Trucks Brisbane | 24/7 Emergency Towing" />
        <meta property="og:description" content="Reliable 24/7 towing services in Brisbane since 1992. Fast response for breakdowns and accidents." />
        <meta property="og:image" content={`${GITHUB_IMAGE_BASE}Tow-trucks-brisbane1.jpg`} />
        <meta property="og:url" content="https://towtrucksbrisbane.com.au" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[85vh] md:h-[90vh] flex items-center overflow-hidden bg-slate-900">
        <motion.div 
          style={{ y: y1 }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={`${GITHUB_IMAGE_BASE}Tow-trucks-brisbane1.jpg`} 
            alt="Tow truck in Brisbane" 
            className="w-full h-full object-cover brightness-[0.4]"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=2000";
            }}
          />
        </motion.div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-12 md:pt-20">
          <motion.div 
            style={{ opacity }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
          <div className="inline-flex items-center gap-2 bg-yellow-400/20 backdrop-blur-md border border-yellow-400/30 px-4 py-2 rounded-full text-yellow-400 text-xs sm:text-sm font-bold mb-6">
            <Clock size={16} />
            24/7 EMERGENCY RESPONSE
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
            Fast, Reliable <span className="text-yellow-400">Towing</span> Across Brisbane
          </h1>
          <p className="text-lg sm:text-xl text-slate-200 mb-10 leading-relaxed max-w-2xl">
            Stranded on the side of the road? Our professional team provides rapid 24/7 towing and roadside assistance to get you and your vehicle home safely.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href={PHONE_LINK} 
              className="bg-yellow-400 hover:bg-yellow-500 text-slate-950 px-8 py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-xl shadow-yellow-400/20"
            >
              <Phone size={24} />
              Call {PHONE_NUMBER}
            </a>
            <Link 
              to="/emergency-gps" 
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-3 transition-all"
            >
              <Navigation size={24} />
              Pinpoint My Location
            </Link>
          </div>
          
          <div className="mt-12 flex items-center gap-8 border-t border-white/10 pt-8">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <img 
                  key={i}
                  src={`https://i.pravatar.cc/100?img=${i+10}`} 
                  className="w-12 h-12 rounded-full border-2 border-slate-900" 
                  alt="Customer"
                />
              ))}
            </div>
            <div>
              <div className="flex text-yellow-400 mb-1">
                {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-white text-sm font-medium">Trusted by 5,000+ Brisbane Drivers</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Stats Bar */}
    <Reveal>
      <section className="bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Response Time', value: '20-40 Min' },
              { label: 'Years Experience', value: '34' },
              { label: 'Vehicles Towed', value: '100k+' },
              { label: 'Service Rating', value: '4.9/5' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-yellow-400 text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-slate-400 text-sm uppercase tracking-widest font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Reveal>

    {/* Services Section */}
    <section id="services" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-yellow-400 font-bold tracking-widest uppercase text-sm mb-4">What We Do</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">Professional Towing Services</h3>
            <p className="text-lg text-slate-400">
              We provide a comprehensive range of towing and transport solutions tailored to your needs, available 24 hours a day, 7 days a week.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = {
              Truck,
              Car,
              Wrench,
              ShieldCheck,
              Box,
              Home: HomeIcon,
              Anchor,
              Tent,
              Siren,
              Construction
            }[service.iconName as string] || Truck;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/service/${service.id}`}>
                  <ServiceCard 
                    icon={IconComponent}
                    title={service.title}
                    description={service.description}
                  />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>

    {/* Areas Section */}
    <Reveal>
      <section id="areas" className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-yellow-400 font-bold tracking-widest uppercase text-sm mb-4">Service Coverage</h2>
              <h3 className="text-4xl font-bold text-white mb-6">Serving All of Brisbane & Beyond</h3>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                Our fleet is strategically positioned across the city to ensure the fastest possible response times. Whether you're in the heart of the CBD or the outer suburbs, we've got you covered.
              </p>
              
              <div className="flex flex-wrap gap-3 mb-10">
                {suburbs.slice(0, 15).map(suburb => (
                  <Link key={suburb.id} to={`/suburb/${suburb.id}`}>
                    <AreaTag name={suburb.name} />
                  </Link>
                ))}
                <Link to="/suburbs" className="inline-flex items-center px-4 py-2 rounded-full bg-yellow-400 text-slate-950 text-sm font-bold hover:bg-yellow-500 transition-colors">
                  View All {suburbs.length} Areas
                </Link>
              </div>

              <div className="bg-slate-900 rounded-2xl p-8 text-white border border-slate-800">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-yellow-400 p-2 rounded-lg">
                    <Phone className="text-slate-950" size={20} />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Immediate Assistance</p>
                    <p className="text-2xl font-bold">{PHONE_NUMBER}</p>
                  </div>
                </div>
                <p className="text-slate-400 text-sm">Average response time in Brisbane metro: 25 minutes.</p>
              </div>
            </div>
            
            <div className="lg:w-1/2 w-full">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-slate-800 group">
                <img 
                  src={`${GITHUB_IMAGE_BASE}Tow-trucks-brisbane12.jpg`} 
                  alt="Tow Trucks Brisbane Fleet" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white font-bold text-lg">24/7 Coverage Across All Suburbs</p>
                  <p className="text-yellow-400 text-sm">Rapid response guaranteed.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Reveal>

    <Reveal>
      <InsuranceSection />
    </Reveal>

    {/* About Section */}
    <Reveal>
      <section id="about" className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src={`${GITHUB_IMAGE_BASE}Tow-trucks-brisbane2.jpg`} 
                  alt="Tow truck detail" 
                  className="rounded-2xl shadow-lg border-2 border-slate-800" 
                  referrerPolicy="no-referrer" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1562141989-c5c79ac8f576?auto=format&fit=crop&q=80&w=600";
                  }}
                />
                <img 
                  src={`${GITHUB_IMAGE_BASE}Tow-trucks-brisbane3.jpg`} 
                  alt="Mechanic working" 
                  className="rounded-2xl shadow-lg mt-8 border-2 border-slate-800" 
                  referrerPolicy="no-referrer" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&q=80&w=600";
                  }}
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-yellow-400 font-bold tracking-widest uppercase text-sm mb-4">About Us</h2>
              <h3 className="text-4xl font-bold text-white mb-6">34 Years of Excellence in Brisbane Towing</h3>
              <p className="text-lg text-slate-400 mb-6 leading-relaxed">
                Founded in 1992, Tow Trucks Brisbane started with a single truck and a simple mission: to provide honest, reliable, and affordable towing services to our local community.
              </p>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                Today, we operate one of the most modern fleets in South East Queensland, but our commitment to old-fashioned customer service remains unchanged. We treat every vehicle as if it were our own.
              </p>
              
              <ul className="space-y-4">
                {[
                  'Fully Licensed & Insured Operators',
                  'Modern Fleet with Latest Safety Equipment',
                  'Transparent Pricing - No Hidden Fees',
                  'Available 24/7, 365 Days a Year'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                    <div className="bg-yellow-400 rounded-full p-1">
                      <ChevronRight size={14} className="text-slate-950" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </Reveal>

    <Reveal>
      <FAQSection />
    </Reveal>

    {/* Contact Section */}
    <Reveal>
      <section id="contact" className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-950 rounded-[3rem] overflow-hidden shadow-2xl border border-slate-800">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/2 p-12 lg:p-20">
                <h3 className="text-4xl font-bold text-white mb-6">Get a Free Quote</h3>
                <p className="text-slate-400 mb-10 text-lg">
                  Need a non-emergency tow or transport? Fill out the form and we'll get back to you with a competitive quote within 30 minutes.
                </p>
                
                <form className="space-y-6" onSubmit={handleFormSubmit}>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-300 mb-2">Full Name</label>
                      <input 
                        required
                        type="text" 
                        value={formState.name}
                        onChange={(e) => setFormState({...formState, name: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400 transition-colors" 
                        placeholder="John Doe" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-300 mb-2">Phone Number</label>
                      <input 
                        required
                        type="tel" 
                        value={formState.phone}
                        onChange={(e) => setFormState({...formState, phone: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400 transition-colors" 
                        placeholder={PHONE_NUMBER} 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">Service Needed</label>
                    <select 
                      value={formState.service}
                      onChange={(e) => setFormState({...formState, service: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400 transition-colors appearance-none"
                    >
                      <option className="bg-slate-900">General Towing</option>
                      <option className="bg-slate-900">Car Transport</option>
                      <option className="bg-slate-900">Machinery Move</option>
                      <option className="bg-slate-900">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">Message / Details</label>
                    <textarea 
                      required
                      rows={4} 
                      value={formState.message}
                      onChange={(e) => setFormState({...formState, message: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400 transition-colors" 
                      placeholder="Tell us about your vehicle and location..."
                    ></textarea>
                  </div>
                  {formStatus && (
                    <div className={`p-4 rounded-xl text-sm font-bold ${formStatus.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                      {formStatus.message}
                    </div>
                  )}
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-bold py-4 rounded-xl transition-all shadow-xl shadow-yellow-400/20 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Request'}
                  </button>
                </form>
              </div>
              
              <div className="lg:w-1/2 bg-yellow-400 p-12 lg:p-20 flex flex-col justify-center">
                <div className="mb-12">
                  <h4 className="text-3xl font-bold text-slate-950 mb-4">Emergency?</h4>
                  <p className="text-slate-900 text-lg mb-8">Don't wait for a form response. Call our 24/7 dispatch line immediately for priority service.</p>
                  <a href={PHONE_LINK} className="inline-flex items-center gap-4 bg-slate-950 text-white px-8 py-6 rounded-2xl text-3xl font-black hover:scale-105 transition-transform shadow-2xl">
                    <Phone size={32} />
                    {PHONE_NUMBER}
                  </a>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-slate-950/10 p-2 rounded-lg mt-1">
                      <MapPin size={20} className="text-slate-950" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-950">Our Depot</p>
                      <p className="text-slate-900">2/460 Beaudesert Rd, Salisbury QLD 4107</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-slate-950/10 p-2 rounded-lg mt-1">
                      <Mail size={20} className="text-slate-950" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-950">Email Us</p>
                      <p className="text-slate-900">info@towtrucksbrisbane.com.au</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  </>
);
};

const FAQSection = () => {
  const faqs = [
    {
      question: "How much does towing cost in Brisbane?",
      answer: "Towing costs vary based on distance, vehicle type, and time of day. We offer transparent, no-haggle pricing starting from competitive rates. Call us for an instant, accurate quote."
    },
    {
      question: "How long will it take for a tow truck to arrive?",
      answer: "Our average response time in the Brisbane metro area is 20-40 minutes, depending on traffic and your specific location."
    },
    {
      question: "Do you offer 24/7 towing?",
      answer: "Yes, we are available 24 hours a day, 7 days a week, including public holidays and late-night emergencies."
    },
    {
      question: "Can you tow my car if it's in an underground car park?",
      answer: "Yes, we have specialized low-clearance tow trucks specifically designed for underground car parks and tight spaces."
    },
    {
      question: "Are you fully insured?",
      answer: "Absolutely. We are fully licensed and comprehensively insured, providing total peace of mind for every vehicle we transport."
    }
  ];

  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-yellow-400 font-bold tracking-widest uppercase text-sm mb-4">Common Questions</h2>
          <h3 className="text-4xl font-bold text-white mb-6">Frequently Asked Questions</h3>
          <p className="text-lg text-slate-400">Everything you need to know about our towing services in Brisbane.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-slate-800 transition-colors"
              >
                <span className="font-bold text-white text-lg">{faq.question}</span>
                <ChevronRight 
                  className={`text-yellow-400 transition-transform duration-300 ${openIndex === i ? 'rotate-90' : ''}`} 
                  size={20} 
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-8 pb-6 text-slate-400 leading-relaxed border-t border-slate-800 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, rotateY: 15, scale: 0.95, translateZ: -100 }}
    animate={{ opacity: 1, rotateY: 0, scale: 1, translateZ: 0 }}
    exit={{ opacity: 0, rotateY: -15, scale: 0.95, translateZ: -100 }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
  >
    {children}
  </motion.div>
);

function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <HelmetProvider>
      <SanityProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AppContent />
        </BrowserRouter>
      </SanityProvider>
    </HelmetProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const { services } = useSanity();
  
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white selection:bg-cyan-400 selection:text-slate-950 overflow-x-hidden">
      <Navbar />
      
      <AnimatePresence mode="wait">
        <div key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/emergency-gps" element={<PageWrapper><EmergencyLocation /></PageWrapper>} />
            <Route path="/service/:id" element={<PageWrapper><ServicePage /></PageWrapper>} />
            <Route path="/suburb/:id" element={<PageWrapper><SuburbPage /></PageWrapper>} />
            <Route path="/suburbs" element={<PageWrapper><SuburbsList /></PageWrapper>} />
            <Route path="/gallery" element={<PageWrapper><Gallery /></PageWrapper>} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
      </AnimatePresence>

      {/* Footer */}
          <footer className="bg-slate-950 pt-20 pb-10 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                <div className="col-span-1 lg:col-span-1">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="bg-yellow-400 p-2 rounded-lg">
                      <Truck className="text-slate-950 h-5 w-5" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-white">
                      Tow Trucks <span className="text-yellow-400">Brisbane</span>
                    </span>
                  </div>
                  <p className="text-slate-400 mb-6 leading-relaxed">
                    Providing professional 24/7 towing and roadside assistance across Brisbane and South East Queensland since 1992.
                  </p>
                  <div className="flex gap-4">
                    <a href="#" className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-yellow-400 hover:border-yellow-400 transition-all">
                      <Facebook size={18} />
                    </a>
                    <a href="#" className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-yellow-400 hover:border-yellow-400 transition-all">
                      <Instagram size={18} />
                    </a>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Quick Links</h5>
                  <ul className="space-y-4">
                    <li><Link to="/#services" className="text-slate-400 hover:text-yellow-400 transition-colors text-sm">Services</Link></li>
                    <li><Link to="/gallery" className="text-slate-400 hover:text-yellow-400 transition-colors text-sm">Gallery</Link></li>
                    <li><Link to="/#areas" className="text-slate-400 hover:text-yellow-400 transition-colors text-sm">Areas Covered</Link></li>
                    <li><Link to="/#faq" className="text-slate-400 hover:text-yellow-400 transition-colors text-sm">FAQ</Link></li>
                    <li><Link to="/suburbs" className="text-slate-400 hover:text-yellow-400 transition-colors text-sm">All Locations</Link></li>
                    <li><Link to="/#about" className="text-slate-400 hover:text-yellow-400 transition-colors text-sm">About Us</Link></li>
                    <li><Link to="/#contact" className="text-slate-400 hover:text-yellow-400 transition-colors text-sm">Contact</Link></li>
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Our Services</h5>
                  <ul className="space-y-4">
                    {services.map(service => (
                      <li key={service.id}>
                        <Link to={`/service/${service.id}`} className="text-slate-400 hover:text-yellow-400 transition-colors text-sm">{service.title}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Newsletter</h5>
                  <p className="text-slate-400 text-sm mb-4">Get seasonal car care tips and local traffic updates.</p>
                  <div className="flex gap-2">
                    <input type="email" placeholder="Email" className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm w-full text-white focus:outline-none focus:border-yellow-400" />
                    <button className="bg-yellow-400 text-slate-950 px-4 py-2 rounded-lg text-sm font-bold">Join</button>
                  </div>
                </div>
              </div>
              
              <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-slate-500 text-xs text-center md:text-left">
                  © 1992 - {new Date().getFullYear()} Tow Trucks Brisbane. All rights reserved. 
                  <a href="https://udesign.com.au" target="_blank" rel="noopener noreferrer" className="ml-2 hover:text-yellow-400 transition-colors">Website by U-Design</a>
                </p>
                <div className="flex gap-6">
                  <a href="#" className="text-slate-500 hover:text-slate-300 text-xs">Terms of Service</a>
                  <a href="#" className="text-slate-500 hover:text-slate-300 text-xs">Sitemap</a>
                </div>
              </div>
            </div>
          </footer>

          {/* Floating Call Button for Mobile */}
          <div className="md:hidden fixed bottom-6 right-6 z-50">
            <a 
              href={PHONE_LINK} 
              className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-slate-950 shadow-2xl animate-bounce"
            >
              <Phone size={28} />
            </a>
          </div>
        </div>
  );
}
