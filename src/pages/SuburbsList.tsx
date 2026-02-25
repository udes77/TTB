import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MapPin, ChevronRight, Truck } from 'lucide-react';
import { useSanity } from '../context/SanityContext';

const SuburbsList: React.FC = () => {
  const { suburbs } = useSanity();
  // Group suburbs by region
  const regions = Array.from(new Set(suburbs.map(s => s.region)));

  return (
    <div className="min-h-screen bg-slate-950">
      <Helmet>
        <title>Service Areas | Tow Trucks Brisbane | 24/7 Towing Coverage</title>
        <meta name="description" content="View our full list of service areas across Brisbane, Logan, Ipswich, Gold Coast, and Sunshine Coast. We provide 24/7 towing wherever you are." />
      </Helmet>

      <section className="bg-slate-900 py-24 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 text-yellow-400 font-bold text-sm uppercase tracking-widest mb-4">
            <Link to="/" className="hover:underline">Home</Link>
            <ChevronRight size={14} />
            <span>Service Areas</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6">Our Service Areas</h1>
          <p className="text-xl text-slate-300 max-w-2xl leading-relaxed">
            We operate a large fleet across South East Queensland, ensuring rapid response times in every suburb we serve.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {regions.map(region => (
              <div key={region} className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="bg-yellow-400 p-2 rounded-lg">
                    <Truck className="text-slate-950" size={20} />
                  </div>
                  <h2 className="text-2xl font-bold text-white">{region}</h2>
                </div>
                <ul className="grid grid-cols-1 gap-3">
                  {suburbs.filter(s => s.region === region).map(suburb => (
                    <li key={suburb.id}>
                      <Link 
                        to={`/suburb/${suburb.id}`}
                        className="flex items-center gap-2 text-slate-400 hover:text-yellow-400 transition-colors group"
                      >
                        <MapPin size={14} className="opacity-50 group-hover:opacity-100" />
                        <span className="font-medium">{suburb.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-900 border-t border-slate-800">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Don't see your suburb?</h2>
          <p className="text-lg text-slate-400 mb-8">
            We often travel beyond our primary service areas for specialized transport and emergency recovery. Give us a call to see if we can help you.
          </p>
          <a 
            href="tel:0499600300" 
            className="inline-flex items-center gap-2 bg-yellow-400 text-slate-950 px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-yellow-400/20 hover:bg-yellow-500 transition-all"
          >
            Call 0499 600 300
          </a>
        </div>
      </section>
    </div>
  );
};

export default SuburbsList;
