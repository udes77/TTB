import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MapPin, ChevronRight, Phone, Clock, Truck, Star, Car, Wrench, ShieldCheck, Box, Home, Anchor, Tent, Siren, Construction } from 'lucide-react';
import { SUBURBS, PHONE_NUMBER, PHONE_LINK, SERVICES, IMAGE_BASE_URL, GALLERY_IMAGES } from '../constants';

const SuburbPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const suburb = SUBURBS.find(s => s.id === id);
  
  const suburbIndex = SUBURBS.findIndex(s => s.id === id);
  const localImage = GALLERY_IMAGES[suburbIndex % GALLERY_IMAGES.length];

  const displayTitle = suburb?.name.toLowerCase().includes('towing') ? suburb.name : `Towing ${suburb?.name}`;
  const metaTitle = `${displayTitle} | 24/7 Towing Services | Tow Trucks Brisbane`;

  if (!suburb) return <div className="py-20 text-center">Suburb not found</div>;

  return (
    <div className="min-h-screen bg-slate-950">
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={`Reliable 24/7 towing in ${suburb.name}. Fast response times for breakdowns and accidents in ${suburb.name} and surrounding areas. Call ${PHONE_NUMBER}.`} />
      </Helmet>

      {/* Hero */}
      <section className="bg-slate-900 py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-2/3">
              <div className="flex items-center gap-2 text-yellow-400 font-bold text-sm uppercase tracking-widest mb-4">
                <Link to="/" className="hover:underline text-slate-500">Home</Link>
                <ChevronRight size={14} className="text-slate-700" />
                <span>Service Areas</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6">{displayTitle}</h1>
              <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
                Need a tow truck in <span className="font-bold text-white">{suburb.name}</span>? We provide rapid 24/7 emergency response across the {suburb.region} Brisbane region.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href={PHONE_LINK} className="bg-yellow-400 text-slate-950 px-8 py-4 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-yellow-400/20 hover:bg-yellow-500 transition-colors">
                  <Phone size={20} />
                  Call {PHONE_NUMBER}
                </a>
                <Link to="/emergency-gps" className="bg-slate-800 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-700 transition-colors border border-slate-700">
                  <MapPin size={20} />
                  Send GPS Location
                </Link>
              </div>
            </div>
            <div className="lg:w-1/3">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-8 border-slate-800">
                <img 
                  src={`${IMAGE_BASE_URL}${localImage}`} 
                  alt={`Tow truck in ${suburb.name}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://picsum.photos/seed/suburb/800/600";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="prose prose-lg prose-invert text-slate-400 max-w-none">
                <h2 className="text-3xl font-bold text-white mb-6">Fast Towing Response in {suburb.name}</h2>
                <p>
                  If you're stuck in {suburb.name}, you don't want to be waiting for hours. Our drivers are strategically located throughout {suburb.region} Brisbane to ensure we can reach you in as little as 20-30 minutes.
                </p>
                <p>
                  Whether you've had an accident on a main road or a breakdown in a quiet residential street, Tow Trucks Brisbane has the local knowledge and equipment to get you moving again.
                </p>
                
                <h3 className="text-2xl font-bold text-white mt-10 mb-6">Our {suburb.name} Services Include:</h3>
                <div className="grid sm:grid-cols-2 gap-4 not-prose">
                  {SERVICES.map(service => {
                    const IconComponent = {
                      Truck,
                      Car,
                      Wrench,
                      ShieldCheck,
                      Box,
                      Home,
                      Anchor,
                      Tent,
                      Siren,
                      Construction
                    }[service.iconName as string] || Truck;

                    return (
                      <Link key={service.id} to={`/service/${service.id}`} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-yellow-400 transition-colors shadow-sm group">
                        <IconComponent className="text-yellow-400 mb-3 group-hover:scale-110 transition-transform" size={24} />
                        <h4 className="font-bold text-white">{service.title}</h4>
                      </Link>
                    );
                  })}
                </div>

                <h3 className="text-2xl font-bold text-white mt-12 mb-6">Local Knowledge Matters</h3>
                <p>
                  We know the {suburb.name} area like the back of our hand. From the busy intersections to the best local repair shops, our drivers can provide advice and assistance that only a true local can offer.
                </p>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="space-y-8">
                <div className="bg-slate-900 rounded-3xl p-8 text-white border border-slate-800">
                  <div className="flex text-yellow-400 mb-4">
                    {[1,2,3,4,5].map(i => <Star key={i} size={18} fill="currentColor" />)}
                  </div>
                  <p className="italic text-lg mb-6">"Fastest tow I've ever had. Stuck in {suburb.name} at 2am and they were there in 20 mins. Highly recommend!"</p>
                  <p className="font-bold text-yellow-400">— Sarah, Local Resident</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
                  <h4 className="text-xl font-bold text-white mb-6">Nearby Service Areas</h4>
                  <ul className="grid grid-cols-1 gap-3">
                    {SUBURBS.filter(s => s.id !== id && s.region === suburb.region).map(s => (
                      <li key={s.id}>
                        <Link to={`/suburb/${s.id}`} className="flex items-center gap-2 text-slate-400 hover:text-yellow-400 transition-colors">
                          <MapPin size={14} className="opacity-50" />
                          {s.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SuburbPage;
