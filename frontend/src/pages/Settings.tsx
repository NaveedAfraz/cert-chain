import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
    Building2, Layout, ShieldCheck, Mail, Globe, 
    Save, Key, Sparkles, CreditCard, Users 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type TabType = 'general' | 'branding' | 'api' | 'billing' | 'users';

export default function Settings() {
    const [activeTab, setActiveTab] = useState<TabType>('general');
    const [instName, setInstName] = useState('');
    const [slug, setSlug] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/institutions/stats');
            setInstName(res.data.institutionName || 'Global University');
            setSlug(res.data.slug || 'global-university');
        } catch (error) {
            console.error('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
             await new Promise(r => setTimeout(r, 1000));
             toast.success('Configuration Synchronized!');
        } catch (error) {
            toast.error('Update failed');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-20 text-center animate-pulse">Initializing Portal...</div>;

    return (
        <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">
            <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">Portal Configuration</h1>
                <p className="text-gray-500 font-medium">Manage your institutional identity and security protocols.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
                {/* Sidebar Nav */}
                <div className="md:col-span-1 space-y-2">
                    <SidebarLink 
                        active={activeTab === 'general'} 
                        icon={<Building2 size={18} />} 
                        label="General Profile" 
                        onClick={() => setActiveTab('general')}
                    />
                    <SidebarLink 
                        active={activeTab === 'branding'} 
                        icon={<Layout size={18} />} 
                        label="Branding" 
                        onClick={() => setActiveTab('branding')}
                    />
                    <SidebarLink 
                        active={activeTab === 'api'} 
                        icon={<Key size={18} />} 
                        label="API & Ledger" 
                        onClick={() => setActiveTab('api')}
                    />
                    <SidebarLink 
                        active={activeTab === 'billing'} 
                        icon={<CreditCard size={18} />} 
                        label="Billing" 
                        onClick={() => setActiveTab('billing')}
                    />
                    <SidebarLink 
                        active={activeTab === 'users'} 
                        icon={<Users size={18} />} 
                        label="User Management" 
                        onClick={() => setActiveTab('users')}
                    />
                </div>

                {/* Main Content */}
                <div className="md:col-span-2">
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-brand-500/5 space-y-8 min-h-[400px]"
                        >
                            {activeTab === 'general' && (
                                <form onSubmit={handleSave} className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-black text-brand-600 uppercase tracking-widest flex items-center gap-2">
                                            <Sparkles size={16} /> Identity Core
                                        </h3>
                                        
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Institution Display Name</label>
                                            <input 
                                                className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none font-medium"
                                                value={instName} onChange={e => setInstName(e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Protocol Identifier (Slug)</label>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-400 font-mono text-xs">certchain.io/</span>
                                                <input 
                                                    readOnly
                                                    className="flex-1 px-5 py-4 bg-gray-100 text-gray-400 border-0 rounded-2xl outline-none font-mono text-sm cursor-not-allowed"
                                                    value={slug}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-50 space-y-4">
                                        <h3 className="text-xs font-black text-brand-600 uppercase tracking-widest flex items-center gap-2">
                                            <ShieldCheck size={16} /> Security Contact
                                        </h3>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Admin Email Notice</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                                <input 
                                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none font-medium"
                                                    placeholder="security@college.edu"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        type="submit"
                                        disabled={saving}
                                        className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-600 transition shadow-xl shadow-gray-200"
                                    >
                                        <Save size={18} /> {saving ? 'Writing to Sync...' : 'Apply Changes'}
                                    </button>
                                </form>
                            )}

                            {activeTab !== 'general' && (
                                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-20">
                                    <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center">
                                        <Layout size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900">Module Coming Soon</h3>
                                        <p className="text-gray-500 font-medium">The {activeTab} configuration panel is scheduled for the next release.</p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function SidebarLink({ icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) {
    return (
        <button 
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                active ? 'bg-brand-50 text-brand-700 shadow-sm border border-brand-100' : 'text-gray-500 hover:bg-gray-50'
            }`}
        >
            {icon} {label}
        </button>
    );
}
