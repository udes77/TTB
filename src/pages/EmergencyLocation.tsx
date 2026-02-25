import React, { useState } from 'react';
import { MapPin, Phone, User, Navigation, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { PHONE_NUMBER } from '../constants';

const EmergencyLocation: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const getGPS = () => {
    setLoading(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        setLoading(false);
      },
      (err) => {
        setError("Unable to retrieve your location. Please check your GPS settings.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) {
      setError("Please pinpoint your location first.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/emergency-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          latitude: location.lat,
          longitude: location.lng,
          accuracy: location.accuracy
        })
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        setError("Something went wrong. Please call us directly.");
      }
    } catch (err) {
      setError("Network error. Please call us directly.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-slate-900 p-10 rounded-3xl shadow-2xl border border-slate-800 text-center max-w-md"
        >
          <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Location Sent!</h2>
          <p className="text-slate-400 mb-8">
            Our dispatch team has received your GPS coordinates. A driver will call you at <span className="font-bold text-yellow-400">{phone}</span> within minutes.
          </p>
          <a href="/" className="inline-block bg-yellow-400 text-slate-950 px-8 py-3 rounded-xl font-bold">Return Home</a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-32">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-yellow-400/10 text-yellow-400 px-4 py-2 rounded-full text-sm font-bold mb-4">
          <Navigation size={16} className="animate-pulse" />
          EMERGENCY GPS DISPATCH
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Pinpoint Your Location</h1>
        <p className="text-slate-400">
          Stranded? Use your phone's GPS to send us your exact coordinates for the fastest possible response.
        </p>
      </div>

      <div className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden">
        <div className="p-8 lg:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2 flex items-center gap-2">
                  <User size={16} className="text-slate-500" />
                  Your Name
                </label>
                <input 
                  required
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400 transition-colors" 
                  placeholder="John Doe" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2 flex items-center gap-2">
                  <Phone size={16} className="text-slate-500" />
                  Phone Number
                </label>
                <input 
                  required
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400 transition-colors" 
                  placeholder="0499 000 000" 
                />
              </div>
            </div>

            <div className="pt-4">
              {!location ? (
                <button 
                  type="button"
                  onClick={getGPS}
                  disabled={loading}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-yellow-400/20 disabled:opacity-50"
                >
                  <MapPin size={24} />
                  {loading ? 'Accessing GPS...' : 'Pinpoint My Location'}
                </button>
              ) : (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-500 p-2 rounded-lg text-slate-950">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <p className="text-emerald-400 font-bold text-sm">Location Captured</p>
                      <p className="text-emerald-500/60 text-xs">Accuracy: within {Math.round(location.accuracy)}m</p>
                    </div>
                  </div>
                  <button type="button" onClick={getGPS} className="text-emerald-400 text-xs font-bold underline">Refresh</button>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-center gap-3 text-rose-400 text-sm">
                <AlertCircle size={20} />
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={!location || loading}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 border border-slate-700"
            >
              Send Location to Dispatch
            </button>
          </form>
        </div>
        
        <div className="bg-slate-950 p-6 border-t border-slate-800 text-center">
          <p className="text-slate-500 text-sm">
            Need immediate help? Call us now at <a href={`tel:${PHONE_NUMBER}`} className="text-yellow-400 font-bold">{PHONE_NUMBER}</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyLocation;
