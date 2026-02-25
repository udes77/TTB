import React from 'react';
import { motion } from 'motion/react';
import { Lock, Database, Settings, Mail, Trash2, CheckCircle2, AlertCircle, Cloud } from 'lucide-react';
import { useSanity } from '../context/SanityContext';

interface LogEntry {
  id: number;
  type: string;
  timestamp: string;
  data: any;
}

interface MailConfig {
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  fromEmail: string;
}

export default function Admin() {
  const { isSanityConnected } = useSanity();
  const [password, setPassword] = React.useState('');
  const [isAuthorized, setIsAuthorized] = React.useState(false);
  const [logs, setLogs] = React.useState<LogEntry[]>([]);
  const [config, setConfig] = React.useState<MailConfig>({
    smtpHost: '',
    smtpPort: '',
    smtpUser: '',
    fromEmail: ''
  });
  const [status, setStatus] = React.useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '5500') {
      setIsAuthorized(true);
      fetchData();
    } else {
      alert('Incorrect password');
    }
  };

  const fetchData = async () => {
    try {
      const [logsRes, configRes] = await Promise.all([
        fetch('/api/admin/logs'),
        fetch('/api/admin/config')
      ]);
      setLogs(await logsRes.json());
      setConfig(await configRes.json());
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (res.ok) {
        setStatus({ type: 'success', message: 'Configuration saved successfully' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to save configuration' });
    }
  };

  const handleTestMail = async () => {
    try {
      const res = await fetch('/api/admin/test-mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (res.ok) {
        setStatus({ type: 'success', message: 'Test email sent (simulated)' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Test email failed' });
    }
  };

  const handleClearLogs = async () => {
    if (!confirm('Are you sure you want to clear all logs?')) return;
    try {
      const res = await fetch('/api/admin/logs', { method: 'DELETE' });
      if (res.ok) {
        setLogs([]);
        setStatus({ type: 'success', message: 'Logs cleared' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to clear logs' });
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 rounded-3xl p-8 w-full max-w-md shadow-2xl border border-slate-800"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-yellow-400 p-4 rounded-2xl">
              <Lock className="text-slate-950" size={32} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-white mb-8">Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400 transition-colors"
                placeholder="Enter admin password"
              />
            </div>
            <button className="w-full bg-yellow-400 text-slate-950 font-bold py-4 rounded-xl hover:bg-yellow-500 transition-colors">
              Login
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h1 className="text-4xl font-black text-white">Admin Dashboard</h1>
            <p className="text-slate-400">Manage form configurations and view logs</p>
          </div>
          {status && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl border ${
                status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
              }`}
            >
              {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <span className="font-medium">{status.message}</span>
            </motion.div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Mail Configuration */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-yellow-400/10 p-2 rounded-lg">
                  <Cloud className="text-yellow-400" size={20} />
                </div>
                <h2 className="text-xl font-bold text-white">CMS Status</h2>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div className={`w-3 h-3 rounded-full ${isSanityConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                <div>
                  <p className="text-sm font-bold text-white">Sanity CMS</p>
                  <p className="text-xs text-slate-500">{isSanityConnected ? 'Connected & Active' : 'Not Connected'}</p>
                </div>
              </div>
              {!isSanityConnected && (
                <p className="mt-4 text-xs text-slate-500 leading-relaxed italic">
                  To connect Sanity, add VITE_SANITY_PROJECT_ID to your environment variables.
                </p>
              )}
            </div>

            <div className="bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-yellow-400/10 p-2 rounded-lg">
                  <Settings className="text-yellow-400" size={20} />
                </div>
                <h2 className="text-xl font-bold text-white">Mail Config</h2>
              </div>
              <form onSubmit={handleSaveConfig} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">SMTP Host</label>
                  <input 
                    type="text" 
                    value={config.smtpHost}
                    onChange={(e) => setConfig({...config, smtpHost: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">SMTP Port</label>
                  <input 
                    type="text" 
                    value={config.smtpPort}
                    onChange={(e) => setConfig({...config, smtpPort: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">SMTP User</label>
                  <input 
                    type="text" 
                    value={config.smtpUser}
                    onChange={(e) => setConfig({...config, smtpUser: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">From Email</label>
                  <input 
                    type="email" 
                    value={config.fromEmail}
                    onChange={(e) => setConfig({...config, fromEmail: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>
                <div className="pt-4 flex gap-2">
                  <button type="submit" className="flex-1 bg-yellow-400 text-slate-950 font-bold py-2 rounded-lg text-sm hover:bg-yellow-500 transition-colors">
                    Save
                  </button>
                  <button 
                    type="button" 
                    onClick={handleTestMail}
                    className="flex-1 border border-slate-800 text-slate-300 font-bold py-2 rounded-lg text-sm hover:bg-slate-800 transition-colors"
                  >
                    Test
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Form Logs */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900 rounded-3xl shadow-sm border border-slate-800 overflow-hidden">
              <div className="p-8 border-b border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-400/10 p-2 rounded-lg">
                    <Database className="text-yellow-400" size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-white">Form Submission Logs</h2>
                </div>
                <button 
                  onClick={handleClearLogs}
                  className="text-rose-400 hover:text-rose-500 flex items-center gap-2 text-sm font-bold"
                >
                  <Trash2 size={16} />
                  Clear Logs
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-950 text-slate-500 text-xs uppercase font-bold">
                    <tr>
                      <th className="px-8 py-4">Timestamp</th>
                      <th className="px-8 py-4">Type</th>
                      <th className="px-8 py-4">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {logs.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-8 py-12 text-center text-slate-500">No logs found</td>
                      </tr>
                    ) : (
                      logs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="px-8 py-4 text-sm text-slate-400 whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="px-8 py-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              log.type === 'Emergency Location' ? 'bg-rose-500/10 text-rose-400' : 'bg-yellow-400/10 text-yellow-400'
                            }`}>
                              {log.type}
                            </span>
                          </td>
                          <td className="px-8 py-4">
                            <div className="text-xs text-slate-400 space-y-1">
                              {Object.entries(log.data).map(([key, val]: [string, any]) => (
                                <div key={key} className="flex gap-2">
                                  <span className="font-bold text-slate-500 w-20">{key}:</span>
                                  <span className="break-all">{String(val)}</span>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
