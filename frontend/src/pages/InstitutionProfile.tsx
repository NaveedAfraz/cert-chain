import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { 
    Building2, ShieldCheck, Award, Users, BookOpen, 
    TrendingUp, Calendar, ExternalLink, Loader2, AlertCircle,
    ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function InstitutionProfile() {
    const { slug } = useParams<{ slug: string }>();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get(`/institutions/profile/${slug}`);
                setData(res.data);
            } catch (err: any) {
                setError(err.response?.status === 404 ? 'Institution not found' : 'Failed to load profile');
            } finally {
                setLoading(false);
            }
        };
        if (slug) fetchProfile();
    }, [slug]);

    if (loading) return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-brand-500" size={40} />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Institution Profile...</p>
        </div>
    );

    if (error || !data) return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
            <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center">
                <AlertCircle size={36} className="text-rose-400" />
            </div>
            <h2 className="text-2xl font-black text-gray-900">{error || 'Not Found'}</h2>
            <p className="text-gray-400 font-medium">This institution profile doesn't exist or has been deactivated.</p>
            <Link to="/" className="text-brand-600 font-bold hover:underline flex items-center gap-2">
                <ArrowLeft size={16} /> Back to Home
            </Link>
        </div>
    );

    const { institution, stats } = data;

    // Build chart data for last 6 months
    const chartData = (() => {
        const months: { label: string; count: number }[] = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const key = d.toISOString().slice(0, 7);
            const label = d.toLocaleString('default', { month: 'short' });
            const found = stats?.monthlyData?.find((m: any) => m.month === key);
            months.push({ label, count: found?.count || 0 });
        }
        return months;
    })();
    const maxCount = Math.max(...chartData.map(m => m.count), 1);

    return (
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8 md:space-y-10">
            {/* Back Link */}
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-brand-600 transition">
                <ArrowLeft size={16} /> Back to CertChain
            </Link>

            {/* Institution Header */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden"
            >
                <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-white/10 backdrop-blur-md rounded-2xl md:rounded-3xl flex items-center justify-center overflow-hidden shrink-0 border border-white/10">
                            {institution.logo_url ? (
                                <img src={institution.logo_url} alt={institution.name} className="w-full h-full object-contain p-3" />
                            ) : (
                                <Building2 size={40} className="text-white/50" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20">
                                    Verified Institution
                                </span>
                            </div>
                            <h1 className="text-2xl md:text-4xl font-black tracking-tight truncate">{institution.name}</h1>
                            <p className="text-white/40 font-mono text-sm mt-1">certchain.io/institution/{institution.slug}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 mt-8 md:mt-10 pt-8 border-t border-white/10">
                        <ProfileStat icon={<Award size={18} />} label="Certificates" value={stats.totalCertificates} />
                        <ProfileStat icon={<ShieldCheck size={18} />} label="Verifications" value={stats.totalVerifications} />
                        <ProfileStat icon={<Users size={18} />} label="Staff" value={stats.totalStaff} />
                        <ProfileStat icon={<Calendar size={18} />} label="Founded" value={new Date(institution.founded).getFullYear()} />
                    </div>
                </div>

                {/* Background accents */}
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl" />
                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                {/* Issuance Activity */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm"
                >
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <TrendingUp size={16} className="text-brand-500" /> Issuance Activity
                    </h3>
                    <div className="h-40 md:h-48 flex items-end gap-2">
                        {chartData.map((m, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                                <span className="text-[10px] font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition absolute -top-5">
                                    {m.count}
                                </span>
                                <motion.div 
                                    initial={{ height: 0 }}
                                    animate={{ height: m.count > 0 ? `${Math.max((m.count / maxCount) * 100, 8)}%` : '4%' }}
                                    transition={{ duration: 0.6, delay: i * 0.08 }}
                                    className={`w-full rounded-t-lg transition-colors ${
                                        m.count > 0 ? 'bg-brand-200 group-hover:bg-brand-500' : 'bg-gray-100'
                                    }`}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-3">
                        {chartData.map((m, i) => (
                            <span key={i} className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex-1 text-center">{m.label}</span>
                        ))}
                    </div>
                </motion.div>

                {/* Top Programs */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm"
                >
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <BookOpen size={16} className="text-brand-500" /> Top Programs
                    </h3>
                    {stats.topCourses?.length > 0 ? (
                        <div className="space-y-4">
                            {stats.topCourses.map((c: any, i: number) => (
                                <div key={i} className="flex items-center gap-3">
                                    <span className="w-7 h-7 bg-brand-50 text-brand-600 rounded-lg flex items-center justify-center text-xs font-black shrink-0">{i + 1}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-gray-900 truncate">{c.course_name}</p>
                                        <div className="w-full h-1.5 bg-gray-100 rounded-full mt-1.5">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(c.count / (stats.topCourses[0]?.count || 1)) * 100}%` }}
                                                transition={{ duration: 0.8, delay: i * 0.1 }}
                                                className="h-full bg-brand-400 rounded-full"
                                            />
                                        </div>
                                    </div>
                                    <span className="text-xs font-black text-gray-400 tabular-nums shrink-0">{c.count}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm font-medium">No programs recorded yet</p>
                    )}
                </motion.div>
            </div>

            {/* Verify CTA */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="bg-brand-50 border border-brand-100 rounded-[2rem] p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-4"
            >
                <div>
                    <h3 className="text-lg font-black text-gray-900">Have a certificate from {institution.name}?</h3>
                    <p className="text-sm text-gray-500 font-medium">Verify its authenticity on the blockchain in seconds.</p>
                </div>
                <Link 
                    to="/verify" 
                    className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-brand-600 transition shadow-xl shadow-brand-500/10 shrink-0"
                >
                    <ShieldCheck size={18} /> Verify Certificate <ExternalLink size={14} />
                </Link>
            </motion.div>
        </div>
    );
}

function ProfileStat({ icon, label, value }: { icon: any; label: string; value: any }) {
    return (
        <div className="space-y-1">
            <div className="flex items-center gap-2 text-white/40">
                {icon}
                <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
            </div>
            <p className="text-xl md:text-2xl font-black text-white">{value}</p>
        </div>
    );
}
