import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Truck, ChevronRight, Phone, ShieldCheck, Clock, MapPin } from 'lucide-react';
import { SERVICES, PHONE_NUMBER, PHONE_LINK, IMAGE_BASE_URL, GALLERY_IMAGES } from '../constants';

const ServicePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const service = SERVICES.find(s => s.id === id);
  
  // Use a consistent but different image for each service if possible
  const serviceIndex = SERVICES.findIndex(s => s.id === id);
  const heroImage = GALLERY_IMAGES[serviceIndex % GALLERY_IMAGES.length];

  if (!service) return <div className="py-20 text-center">Service not found</div>;

  return (
    <div className="min-h-screen bg-slate-950">
      <Helmet>
        <title>{service.title} Brisbane | Tow Trucks Brisbane</title>
        <meta name="description" content={`Professional ${service.title} in Brisbane. ${service.description} Available 24/7. Call ${PHONE_NUMBER}.`} />
      </Helmet>

      {/* Hero */}
      <section className="bg-slate-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src={`${IMAGE_BASE_URL}${heroImage}`} 
            className="w-full h-full object-cover" 
            alt="Background" 
            referrerPolicy="no-referrer" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=2000";
            }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex items-center gap-2 text-yellow-400 font-bold text-sm uppercase tracking-widest mb-4">
            <Link to="/" className="hover:underline">Home</Link>
            <ChevronRight size={14} />
            <span>Services</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6">{service.title}</h1>
          <p className="text-xl text-slate-300 max-w-2xl leading-relaxed">
            {service.description}
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-white mb-6">Expert {service.title} Solutions</h2>
              <div className="prose prose-lg prose-invert text-slate-400 max-w-none mb-12">
                <p>{service.content}</p>
                <p>
                  At Tow Trucks Brisbane, we pride ourselves on delivering top-tier {service.title.toLowerCase()} services that residents and businesses can rely on. Our team is fully trained, insured, and equipped with the latest technology to handle any situation.
                </p>
                <h3 className="text-2xl font-bold text-white mt-8 mb-4">Why Choose Us for {service.title}?</h3>
                <ul className="space-y-4 list-none p-0">
                  {[
                    '24/7 Availability across all Brisbane suburbs',
                    'Modern fleet of specialised tow trucks',
                    'Competitive, transparent pricing',
                    'Fully insured and licensed operators'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <ShieldCheck className="text-yellow-400 mt-1 flex-shrink-0" size={20} />
                      <span className="text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800">
                <h3 className="text-2xl font-bold text-white mb-4">Ready to book?</h3>
                <p className="text-slate-400 mb-6">Whether it's an emergency or a scheduled transport, we're here to help.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href={PHONE_LINK} className="bg-yellow-400 text-slate-950 px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-yellow-500 transition-colors">
                    <Phone size={20} />
                    Call {PHONE_NUMBER}
                  </a>
                  <Link to="/emergency-gps" className="bg-slate-800 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors border border-slate-700">
                    <MapPin size={20} />
                    Send GPS Location
                  </Link>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-sm">
                  <h4 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">Other Services</h4>
                  <ul className="space-y-4">
                    {SERVICES.filter(s => s.id !== id).map(s => (
                      <li key={s.id}>
                        <Link to={`/service/${s.id}`} className="flex items-center justify-between group text-slate-400 hover:text-yellow-400 font-medium transition-colors">
                          {s.title}
                          <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-yellow-400 rounded-3xl p-8 text-slate-950">
                  <Clock className="mb-4" size={32} />
                  <h4 className="text-2xl font-bold mb-2">24/7 Support</h4>
                  <p className="mb-6 opacity-90">We never sleep. Our dispatchers are standing by to help you right now.</p>
                  <a href={PHONE_LINK} className="block text-center bg-slate-950 text-white py-3 rounded-xl font-bold hover:bg-slate-900 transition-colors">Call Now</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicePage;
