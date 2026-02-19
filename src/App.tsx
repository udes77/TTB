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
  Navigation
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PHONE_NUMBER, PHONE_LINK, SERVICES, SUBURBS } from './constants';
import BrisbaneMap from './components/BrisbaneMap';
import EmergencyLocation from './pages/EmergencyLocation';
import ServicePage from './pages/ServicePage';
import SuburbPage from './pages/SuburbPage';

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services', href: '/#services' },
    { name: 'Areas', href: '/#areas' },
    { name: 'About', href: '/#about' },
    { name: 'Contact', href: '/#contact' },
  ];

  const isHome = location.pathname === '/';

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled || !isHome ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-amber-500 p-2 rounded-lg">
              <Truck className="text-white h-6 w-6" />
            </div>
            <span className={`font-bold text-xl tracking-tight ${scrolled || !isHome ? 'text-slate-900' : 'text-white'}`}>
              Tow Trucks <span className="text-amber-500">Brisbane</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className={`text-sm font-medium transition-colors hover:text-amber-500 ${scrolled || !isHome ? 'text-slate-600' : 'text-white/90'}`}
              >
                {link.name}
              </a>
            ))}
            <a 
              href={PHONE_LINK} 
              className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20"
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
            {isOpen ? <X className={scrolled || !isHome ? 'text-slate-900' : 'text-white'} /> : <Menu className={scrolled || !isHome ? 'text-slate-900' : 'text-white'} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-b border-slate-100"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block px-3 py-4 text-base font-medium text-slate-700 hover:text-amber-500 hover:bg-slate-50 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <a 
                href={PHONE_LINK} 
                className="flex items-center justify-center gap-2 w-full bg-amber-500 text-white px-4 py-4 rounded-lg font-bold mt-4"
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
    className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
  >
    <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors">
      <Icon className="text-amber-500 group-hover:text-white transition-colors" size={28} />
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </motion.div>
);

const AreaTag: React.FC<{ name: string }> = ({ name }) => (
  <span className="inline-flex items-center px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 transition-colors cursor-default">
    <MapPin size={14} className="mr-2 opacity-50" />
    {name}
  </span>
);

const InsuranceSection = () => {
  const insurers = [
    { name: 'NRMA', domain: 'nrma.com.au' },
    { name: 'RACQ', domain: 'racq.com.au' },
    { name: 'Allianz', domain: 'allianz.com.au' },
    { name: 'Suncorp', domain: 'suncorp.com.au' },
    { name: 'QBE', domain: 'qbe.com' },
    { name: 'AAMI', domain: 'aami.com.au' },
    { name: 'GIO', domain: 'gio.com.au' },
    { name: 'Budget Direct', domain: 'budgetdirect.com.au' },
  ];

  return (
    <section className="py-24 bg-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center">
          <h2 className="text-amber-500 font-bold tracking-widest uppercase text-sm mb-4">Insurance Partners</h2>
          <h3 className="text-4xl font-bold text-white mb-6">We Bill Your Insurance Directly</h3>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Had an accident? We work with all major Australian insurance providers to make the recovery process as seamless as possible. We can often bill them directly, so you have one less thing to worry about.
          </p>
        </div>
      </div>

      <div className="relative flex overflow-x-hidden">
        <div className="animate-marquee whitespace-nowrap flex items-center py-4">
          {[...insurers, ...insurers].map((insurer, i) => (
            <div key={i} className="mx-12 flex flex-col items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 opacity-60 hover:opacity-100">
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 w-40 h-24 flex items-center justify-center mb-3">
                <img 
                  src={`https://logo.clearbit.com/${insurer.domain}`} 
                  alt={insurer.name} 
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${insurer.name}&background=f59e0b&color=fff&bold=true&size=128`;
                  }}
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">{insurer.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Home = () => (
  <>
    <Helmet>
      <title>Tow Trucks Brisbane | 24/7 Emergency Towing & Roadside Assistance</title>
      <meta name="description" content={`Reliable 24/7 towing services in Brisbane. We offer emergency breakdown towing, car transport, and roadside assistance. Call ${PHONE_NUMBER} for fast response.`} />
      <meta name="keywords" content="towing brisbane, tow trucks brisbane, emergency towing, roadside assistance brisbane, car transport brisbane, cheap towing brisbane" />
      <link rel="canonical" href="https://towtrucksbrisbane.com.au" />
    </Helmet>

    {/* Hero Section */}
    <section className="relative h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=2000" 
          alt="Tow truck in Brisbane" 
          className="w-full h-full object-cover brightness-[0.4]"
          referrerPolicy="no-referrer"
        />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 bg-amber-500/20 backdrop-blur-md border border-amber-500/30 px-4 py-2 rounded-full text-amber-400 text-sm font-bold mb-6">
            <Clock size={16} />
            24/7 EMERGENCY RESPONSE
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
            Fast, Reliable <span className="text-amber-500">Towing</span> Across Brisbane
          </h1>
          <p className="text-xl text-slate-200 mb-10 leading-relaxed max-w-2xl">
            Stranded on the side of the road? Our professional team provides rapid 24/7 towing and roadside assistance to get you and your vehicle home safely.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href={PHONE_LINK} 
              className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-xl shadow-amber-500/20"
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
              <div className="flex text-amber-400 mb-1">
                {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-white text-sm font-medium">Trusted by 5,000+ Brisbane Drivers</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Stats Bar */}
    <section className="bg-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Response Time', value: '20-40 Min' },
            { label: 'Years Experience', value: '15+' },
            { label: 'Vehicles Towed', value: '50k+' },
            { label: 'Service Rating', value: '4.9/5' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-amber-500 text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-slate-400 text-sm uppercase tracking-widest font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Services Section */}
    <section id="services" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-amber-500 font-bold tracking-widest uppercase text-sm mb-4">What We Do</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Professional Towing Services</h3>
          <p className="text-lg text-slate-600">
            We provide a comprehensive range of towing and transport solutions tailored to your needs, available 24 hours a day, 7 days a week.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service) => (
            <Link key={service.id} to={`/service/${service.id}`}>
              <ServiceCard 
                icon={Truck}
                title={service.title}
                description={service.description}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>

    {/* Areas Section */}
    <section id="areas" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <h2 className="text-amber-500 font-bold tracking-widest uppercase text-sm mb-4">Service Coverage</h2>
            <h3 className="text-4xl font-bold text-slate-900 mb-6">Serving All of Brisbane & Beyond</h3>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Our fleet is strategically positioned across the city to ensure the fastest possible response times. Whether you're in the heart of the CBD or the outer suburbs, we've got you covered.
            </p>
            
            <div className="flex flex-wrap gap-3 mb-10">
              {SUBURBS.map(suburb => (
                <Link key={suburb.id} to={`/suburb/${suburb.id}`}>
                  <AreaTag name={suburb.name} />
                </Link>
              ))}
            </div>

            <div className="bg-slate-900 rounded-2xl p-8 text-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-amber-500 p-2 rounded-lg">
                  <Phone size={20} />
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
            <BrisbaneMap />
          </div>
        </div>
      </div>
    </section>

    <InsuranceSection />

    {/* About Section */}
    <section id="about" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1562141989-c5c79ac8f576?auto=format&fit=crop&q=80&w=600" alt="Tow truck detail" className="rounded-2xl shadow-lg" referrerPolicy="no-referrer" />
              <img src="https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&q=80&w=600" alt="Mechanic working" className="rounded-2xl shadow-lg mt-8" referrerPolicy="no-referrer" />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-amber-500 font-bold tracking-widest uppercase text-sm mb-4">About Us</h2>
            <h3 className="text-4xl font-bold text-slate-900 mb-6">Brisbane's Most Trusted Towing Team</h3>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Founded in 2010, Tow Trucks Brisbane started with a single truck and a simple mission: to provide honest, reliable, and affordable towing services to our local community.
            </p>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Today, we operate one of the most modern fleets in South East Queensland, but our core values remain the same. We treat every vehicle as if it were our own and every customer with the respect they deserve during a stressful time.
            </p>
            
            <ul className="space-y-4">
              {[
                'Fully Licensed & Insured Operators',
                'Modern Fleet with Latest Safety Equipment',
                'Transparent Pricing - No Hidden Fees',
                'Available 24/7, 365 Days a Year'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                  <div className="bg-amber-500 rounded-full p-1">
                    <ChevronRight size={14} className="text-white" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>

    {/* Contact Section */}
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/2 p-12 lg:p-20">
              <h3 className="text-4xl font-bold text-white mb-6">Get a Free Quote</h3>
              <p className="text-slate-400 mb-10 text-lg">
                Need a non-emergency tow or transport? Fill out the form and we'll get back to you with a competitive quote within 30 minutes.
              </p>
              
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">Full Name</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">Phone Number</label>
                    <input type="tel" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors" placeholder={PHONE_NUMBER} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Service Needed</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors appearance-none">
                    <option className="bg-slate-900">General Towing</option>
                    <option className="bg-slate-900">Car Transport</option>
                    <option className="bg-slate-900">Machinery Move</option>
                    <option className="bg-slate-900">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Message / Details</label>
                  <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors" placeholder="Tell us about your vehicle and location..."></textarea>
                </div>
                <button type="button" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-amber-500/20">
                  Send Request
                </button>
              </form>
            </div>
            
            <div className="lg:w-1/2 bg-amber-500 p-12 lg:p-20 flex flex-col justify-center">
              <div className="mb-12">
                <h4 className="text-3xl font-bold text-slate-900 mb-4">Emergency?</h4>
                <p className="text-slate-800 text-lg mb-8">Don't wait for a form response. Call our 24/7 dispatch line immediately for priority service.</p>
                <a href={PHONE_LINK} className="inline-flex items-center gap-4 bg-slate-900 text-white px-8 py-6 rounded-2xl text-3xl font-black hover:scale-105 transition-transform shadow-2xl">
                  <Phone size={32} />
                  {PHONE_NUMBER}
                </a>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-slate-900/10 p-2 rounded-lg mt-1">
                    <MapPin size={20} className="text-slate-900" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Our Depot</p>
                    <p className="text-slate-800">2/460 Beaudesert Rd, Salisbury QLD 4107</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-slate-900/10 p-2 rounded-lg mt-1">
                    <Mail size={20} className="text-slate-900" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Email Us</p>
                    <p className="text-slate-800">info@towtrucksbrisbane.com.au</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
);

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

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </HelmetProvider>
  );
}

function AppContent() {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-amber-100 selection:text-amber-900 overflow-x-hidden">
      <Navbar />
      
      <AnimatePresence mode="wait">
        <div key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/emergency-gps" element={<PageWrapper><EmergencyLocation /></PageWrapper>} />
            <Route path="/service/:id" element={<PageWrapper><ServicePage /></PageWrapper>} />
            <Route path="/suburb/:id" element={<PageWrapper><SuburbPage /></PageWrapper>} />
          </Routes>
        </div>
      </AnimatePresence>

      {/* Footer */}
          <footer className="bg-slate-50 pt-20 pb-10 border-t border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                <div className="col-span-1 lg:col-span-1">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="bg-amber-500 p-2 rounded-lg">
                      <Truck className="text-white h-5 w-5" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-slate-900">
                      Tow Trucks <span className="text-amber-500">Brisbane</span>
                    </span>
                  </div>
                  <p className="text-slate-500 mb-6 leading-relaxed">
                    Providing professional 24/7 towing and roadside assistance across Brisbane and South East Queensland since 2010.
                  </p>
                  <div className="flex gap-4">
                    <a href="#" className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-amber-500 hover:border-amber-500 transition-all">
                      <Facebook size={18} />
                    </a>
                    <a href="#" className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-amber-500 hover:border-amber-500 transition-all">
                      <Instagram size={18} />
                    </a>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Quick Links</h5>
                  <ul className="space-y-4">
                    <li><Link to="/#services" className="text-slate-500 hover:text-amber-500 transition-colors text-sm">Services</Link></li>
                    <li><Link to="/#areas" className="text-slate-500 hover:text-amber-500 transition-colors text-sm">Areas Covered</Link></li>
                    <li><Link to="/#about" className="text-slate-500 hover:text-amber-500 transition-colors text-sm">About Us</Link></li>
                    <li><Link to="/#contact" className="text-slate-500 hover:text-amber-500 transition-colors text-sm">Contact</Link></li>
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Our Services</h5>
                  <ul className="space-y-4">
                    {SERVICES.map(service => (
                      <li key={service.id}>
                        <Link to={`/service/${service.id}`} className="text-slate-500 hover:text-amber-500 transition-colors text-sm">{service.title}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Newsletter</h5>
                  <p className="text-slate-500 text-sm mb-4">Get seasonal car care tips and local traffic updates.</p>
                  <div className="flex gap-2">
                    <input type="email" placeholder="Email" className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-amber-500" />
                    <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold">Join</button>
                  </div>
                </div>
              </div>
              
              <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-slate-400 text-xs">
                  © {new Date().getFullYear()} Tow Trucks Brisbane. All rights reserved.
                </p>
                <div className="flex gap-6">
                  <a href="#" className="text-slate-400 hover:text-slate-600 text-xs">Terms of Service</a>
                  <a href="#" className="text-slate-400 hover:text-slate-600 text-xs">Sitemap</a>
                </div>
              </div>
            </div>
          </footer>

          {/* Floating Call Button for Mobile */}
          <div className="md:hidden fixed bottom-6 right-6 z-50">
            <a 
              href={PHONE_LINK} 
              className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-2xl animate-bounce"
            >
              <Phone size={28} />
            </a>
          </div>
        </div>
  );
}
