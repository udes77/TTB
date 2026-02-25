import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { ChevronRight, Camera, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GITHUB_IMAGE_BASE, GALLERY_IMAGES } from '../constants';

const Gallery: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-12">
      <Helmet>
        <title>Gallery | Tow Trucks Brisbane | Our Fleet in Action</title>
        <meta name="description" content="View our gallery of tow trucks and specialized equipment in action across Brisbane. We handle everything from cars to heavy machinery." />
      </Helmet>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-yellow-400 font-bold text-sm uppercase tracking-widest mb-4">
            <Link to="/" className="hover:underline">Home</Link>
            <ChevronRight size={14} />
            <span>Gallery</span>
          </div>
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-yellow-400/10 text-yellow-400 px-4 py-2 rounded-full text-sm font-bold mb-6">
              <Camera size={18} />
              OUR FLEET IN ACTION
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6">Brisbane's Best Equipment</h1>
            <p className="text-xl text-slate-400 leading-relaxed">
              Take a look at our modern fleet of tow trucks and specialized equipment. We're ready for any job, big or small, across South East Queensland.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {GALLERY_IMAGES.map((img, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="aspect-square rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl group"
              >
                <img 
                  src={`${GITHUB_IMAGE_BASE}${img}`} 
                  alt={`Tow truck operation ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://picsum.photos/seed/tow${i}/800/800`;
                  }}
                />
              </motion.div>
            ))}
          </div>

          <div className="mt-20 bg-slate-900 rounded-[3rem] p-12 border border-slate-800 text-center">
            <div className="bg-yellow-400 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-yellow-400/20">
              <Truck className="text-slate-950" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Need a Tow?</h2>
            <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
              Our fleet is strategically positioned across Brisbane to ensure we can reach you in as little as 20 minutes.
            </p>
            <Link to="/#contact" className="inline-block bg-yellow-400 text-slate-950 px-10 py-4 rounded-xl font-bold text-lg hover:bg-yellow-500 transition-all shadow-xl shadow-yellow-400/20">
              Get a Free Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
