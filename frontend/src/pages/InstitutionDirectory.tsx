import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { 
    Building2, Award, ShieldCheck, Search, ArrowRight, 
    Loader2, Globe, Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function InstitutionDirectory() {
    const { t } = useTranslation();
    const [institutions, setInstitutions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await api.get('/institutions/directory');
                console.log(res.data);
                setInstitutions(res.data);
            } catch (err) {
                console.log(err);
                console.error('Failed to load directory');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const filtered = institutions.filter(i => 
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.slug.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-brand-500" size={40} />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Directory...</p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-600 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                        <Globe size={14} /> {t('directory.network')}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
                        {t('directory.title')}
                    </h1>
                    <p className="text-gray-500 font-medium max-w-xl mx-auto">
                        {t('directory.subtitle')}
                    </p>
                </motion.div>
            </div>

            {/* Search */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <div className="relative max-w-lg mx-auto">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        className="w-full pl-14 pr-6 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-brand-400 focus:outline-none font-medium text-gray-900 shadow-sm"
                        placeholder={t('directory.searchPlaceholder')}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </motion.div>

            {/* Stats Bar */}
            <div className="flex items-center justify-center gap-6 text-sm">
                <span className="text-gray-400 font-bold">{institutions.length} {t('directory.verifiedInstitutions')}</span>
                <span className="text-gray-200">•</span>
                <span className="text-gray-400 font-bold">{institutions.reduce((a: number, i: any) => a + (i.cert_count || 0), 0)} {t('directory.totalCertificates')}</span>
            </div>

            {/* Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                {filtered.map((inst, i) => (
                    <motion.div
                        key={inst.slug}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <Link 
                            to={`/institution/${inst.slug}`}
                            className="block bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-brand-200 transition-all duration-300 overflow-hidden group"
                        >
                            {/* Card Header */}
                            <div className="p-6 pb-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-100 shrink-0 group-hover:border-brand-200 transition">
                                        {inst.logo_url ? (
                                            <img src={inst.logo_url} alt={inst.name} className="w-full h-full object-contain p-2" />
                                        ) : (
                                            <Building2 size={24} className="text-gray-300" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-black text-gray-900 text-base truncate group-hover:text-brand-600 transition">{inst.name}</h3>
                                        <p className="text-xs text-gray-400 font-mono truncate">/{inst.slug}</p>
                                    </div>
                                    <ArrowRight size={18} className="text-gray-200 group-hover:text-brand-500 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                                </div>
                            </div>

                            {/* Stats Row */}
                            <div className="px-6 pb-6">
                                <div className="flex items-center gap-4 bg-gray-50 rounded-xl px-4 py-3">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                                        <Award size={14} className="text-brand-500" />
                                        <span>{inst.cert_count || 0} certs</span>
                                    </div>
                                    <div className="w-px h-4 bg-gray-200" />
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                                        <ShieldCheck size={14} className="text-emerald-500" />
                                        <span>{inst.verify_count || 0} verified</span>
                                    </div>
                                    <div className="w-px h-4 bg-gray-200" />
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                                        <Calendar size={12} />
                                        <span>{new Date(inst.created_at).getFullYear()}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-20 space-y-3">
                    <Building2 size={40} className="text-gray-200 mx-auto" />
                    <p className="text-gray-400 font-bold">{t('directory.noResults')}</p>
                </div>
            )}
        </div>
    );
}
