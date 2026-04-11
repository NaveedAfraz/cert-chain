import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
    Users, ShieldCheck, BarChart3, TrendingUp, 
    Building, AlertTriangle, LayoutDashboard, Search,
    Plus, ChevronRight, Globe, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SuperAdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [institutions, setInstitutions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Form for new institution
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [showOnboard, setShowOnboard] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, instRes] = await Promise.all([
                api.get('/institutions/global-stats'),
                api.get('/institutions')
            ]);
            setStats(statsRes.data);
            setInstitutions(instRes.data);
        } catch (error) {
            toast.error('Failed to load platform data');
        } finally {
            setLoading(false);
        }
    };

    const handleOnboard = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/institutions', { name, slug, email: 'admin@college.edu' });
            toast.success('Institution Onboarded Successfully');
            setShowOnboard(false);
            setName('');
            setSlug('');
            fetchData();
        } catch (error) {
            toast.error('Failed to onboard institution');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Platform Overview</h1>
                    <p className="text-gray-500 font-medium">Real-time global metrics for CertChain SaaS</p>
                </div>
                <button 
                    onClick={() => setShowOnboard(true)}
                    className="bg-gray-900 text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-brand-600 transition shadow-xl shadow-gray-200"
                >
                    <Plus size={20} /> Register Institution
                </button>
            </header>

            {/* Global Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    icon={<Building size={24} />} 
                    label="Active Tenants" 
                    value={stats?.totalInstitutions} 
                    color="text-brand-600" 
                    bg="bg-brand-50"
                />
                <StatCard 
                    icon={<ShieldCheck size={24} />} 
                    label="Global Certs" 
                    value={stats?.totalCertificates} 
                    color="text-emerald-600" 
                    bg="bg-emerald-50"
                />
                <StatCard 
                    icon={<TrendingUp size={24} />} 
                    label="Verifications" 
                    value={stats?.verificationStats.total} 
                    color="text-indigo-600" 
                    bg="bg-indigo-50"
                />
                <StatCard 
                    icon={<BarChart3 size={24} />} 
                    label="Success Rate" 
                    value={`${stats?.verificationStats.total > 0 ? Math.round((stats.verificationStats.success / stats.verificationStats.total) * 100) : 100}%`} 
                    color="text-amber-600" 
                    bg="bg-amber-50"
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
                {/* Active Institutions List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                            <h3 className="font-bold text-gray-900 text-xl">Manage Institutions</h3>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input 
                                    placeholder="Filter by name..." 
                                    className="pl-10 pr-4 py-2 bg-gray-50 border-0 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500"
                                />
                            </div>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {institutions.map((inst) => (
                                <div key={inst.id} className="p-6 hover:bg-gray-50 transition flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center font-bold text-gray-400">
                                            {inst.name[0]}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{inst.name}</h4>
                                            <p className="text-xs font-mono text-gray-400">/{inst.slug}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-xs uppercase font-bold text-gray-400">Status</p>
                                            <span className="text-sm font-bold text-emerald-600">Active</span>
                                        </div>
                                        <ChevronRight className="text-gray-300" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Platform Leaderboard */}
                <div className="space-y-6">
                    <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <TrendingUp size={20} className="text-brand-400" /> Top Issuers
                        </h3>
                        <div className="space-y-6">
                            {stats?.topInstitutions.map((inst: any, idx: number) => (
                                <div key={inst.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl font-black text-gray-700 w-6">#{idx + 1}</span>
                                        <span className="font-bold line-clamp-1">{inst.name}</span>
                                    </div>
                                    <div className="bg-gray-800 px-3 py-1 rounded-lg text-sm font-mono text-brand-400">
                                        {inst.cert_count}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                <ShieldCheck size={20} /> Integrity Health
                            </h3>
                            <p className="text-indigo-100/70 text-sm mb-6 font-medium">Global analytics for tampered vs genuine certificates.</p>
                            
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm font-bold">
                                    <span>Genuine Hits</span>
                                    <span>{stats?.verificationStats.success}</span>
                                </div>
                                <div className="h-2 bg-indigo-500 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-emerald-400" 
                                        style={{ width: `${(stats?.verificationStats.success / (stats?.verificationStats.total || 1)) * 100}%` }} 
                                    />
                                </div>
                                <div className="flex justify-between text-sm font-bold">
                                    <span className="text-rose-300">Tampered Attempts</span>
                                    <span className="text-rose-300">{stats?.verificationStats.tampered}</span>
                                </div>
                            </div>
                        </div>
                        <Globe className="absolute -right-10 -bottom-10 text-indigo-500 opacity-20 w-48 h-48 group-hover:scale-110 transition-transform duration-700" />
                    </div>
                </div>
            </div>

            {/* Onboarding Modal */}
            <AnimatePresence>
                {showOnboard && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowOnboard(false)}
                            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 relative z-[101] shadow-2xl"
                        >
                            <h3 className="text-2xl font-black text-gray-900 mb-6">Onboard Institution</h3>
                            <form onSubmit={handleOnboard} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">College Name</label>
                                    <input 
                                        required
                                        className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none"
                                        placeholder="e.g. Imperial College London"
                                        value={name} onChange={e => setName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Url Slug (unique)</label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400 font-mono text-sm">certchain.io/</span>
                                        <input 
                                            required
                                            className="flex-1 px-5 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none font-mono"
                                            placeholder="imperial-college"
                                            value={slug} onChange={e => setSlug(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="pt-4 flex gap-4">
                                    <button 
                                        type="button"
                                        onClick={() => setShowOnboard(false)}
                                        className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        className="flex-1 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-brand-600 transition shadow-xl shadow-gray-200"
                                    >
                                        Register
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function StatCard({ icon, label, value, color, bg }: { icon: any, label: string, value: any, color: string, bg: string }) {
    return (
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center gap-5 shadow-sm">
            <div className={`p-4 ${bg} ${color} rounded-2xl`}>
                {icon}
            </div>
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</p>
                <p className={`text-2xl font-black ${color}`}>{value || 0}</p>
            </div>
        </div>
    );
}
