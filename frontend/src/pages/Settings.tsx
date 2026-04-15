import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
    Building2, Layout, ShieldCheck, Mail, Globe,
    Save, Sparkles, CreditCard, Users, Trash2, Plus,
    UserPlus, X, Loader2, CheckCircle2, AlertCircle, Calendar, Eye, EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

type TabType = 'general' | 'branding' | 'billing' | 'users';

export default function Settings() {
    const { updateUser, canManageSettings, isStaff } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabType>('general');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Data State
    const [instData, setInstData] = useState<any>(null);
    const [instName, setInstName] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [stats, setStats] = useState<any>(null);

    // Users State
    const [members, setMembers] = useState<any[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        // Restricted access for Staff
        if (isStaff) {
            toast.error('Identity restricted: Access denied');
            navigate('/admin/dashboard');
            return;
        }
        fetchInitialData();
    }, [isStaff]);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [instRes, statsRes] = await Promise.all([
                api.get('/institutions/my'),
                api.get('/institutions/stats')
            ]);

            setInstData(instRes.data);
            setInstName(instRes.data.name);
            setLogoUrl(instRes.data.logo_url || '');
            setStats(statsRes.data);

            if (activeTab === 'users') fetchMembers();
        } catch (error) {
            console.error('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'users' && !isStaff) fetchMembers();
    }, [activeTab]);

    const fetchMembers = async () => {
        try {
            const res = await api.get('/institutions/my/users');
            setMembers(res.data);
        } catch (error) {
            toast.error('Failed to load staff list');
        }
    };

    const handleBrandingSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.patch('/institutions/my', { name: instName, logoUrl });

            // Sync Global Branding
            updateUser({ institutionName: instName });

            toast.success('Branding Synchronized!');
            setInstData((prev: any) => ({ ...prev, name: instName, logo_url: logoUrl }));
        } catch (error) {
            toast.error('Update failed');
        } finally {
            setSaving(false);
        }
    };

    const handleRemoveMember = async (userId: string) => {
        if (!confirm('Revoke access for this user?')) return;
        try {
            await api.delete(`/institutions/my/users/${userId}`);
            setMembers(members.filter(m => m.id !== userId));
            toast.success('Member removed');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Removal failed');
        }
    };

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-brand-500" size={40} />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Authenticating Session...</p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Portal Configuration</h1>
                    <p className="text-gray-500 font-medium">Manage your institutional identity and security protocols.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-4 gap-10">
                {/* Sidebar Nav */}
                <div className="md:col-span-1 space-y-2">
                    <SidebarLink active={activeTab === 'general'} icon={<Building2 size={18} />} label="General Profile" onClick={() => setActiveTab('general')} />
                    <SidebarLink active={activeTab === 'branding'} icon={<Layout size={18} />} label="Branding" onClick={() => setActiveTab('branding')} />
                    <SidebarLink active={activeTab === 'users'} icon={<Users size={18} />} label="User Management" onClick={() => setActiveTab('users')} />
                    <div className="pt-4 mt-4 border-t border-gray-100 flex flex-col gap-2">
                        <SidebarLink active={activeTab === 'billing'} icon={<CreditCard size={18} />} label="Billing" onClick={() => setActiveTab('billing')} />
                    </div>
                </div>

                {/* Main Content */}
                <div className="md:col-span-3">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-brand-500/5 space-y-8 min-h-[500px]"
                        >
                            {/* General & Branding Shared Form Logic */}
                            {(activeTab === 'general' || activeTab === 'branding') && (
                                <form onSubmit={handleBrandingSave} className="space-y-8">
                                    <div className="space-y-6">
                                        <h3 className="text-xs font-black text-brand-600 uppercase tracking-widest flex items-center gap-2">
                                            <Sparkles size={16} /> {activeTab === 'general' ? 'Identity Core' : 'Visual Branding'}
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 ml-1">Institution Display Name</label>
                                                <input
                                                    className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none font-medium text-gray-900"
                                                    value={instName} onChange={e => setInstName(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 ml-1">Logo Provider URL</label>
                                                <div className="relative">
                                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                                    <input
                                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none font-medium truncate"
                                                        placeholder="https://university.edu/logo.png"
                                                        value={logoUrl} onChange={e => setLogoUrl(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {activeTab === 'general' && (
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 ml-1">Protocol Identifier (Slug)</label>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-400 font-mono text-xs">certchain.io/</span>
                                                    <input
                                                        readOnly
                                                        className="flex-1 px-5 py-4 bg-gray-100 text-gray-400 border-0 rounded-2xl outline-none font-mono text-sm cursor-not-allowed"
                                                        value={instData?.slug}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'branding' && (
                                            <div className="bg-gray-50 p-6 rounded-3xl border border-dashed border-gray-200 flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 bg-white rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden">
                                                        {logoUrl ? <img src={logoUrl} alt="Logo Preview" className="w-full h-full object-contain p-2" /> : <Building2 className="text-gray-200" size={24} />}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900">Header Preview</p>
                                                        <p className="text-xs text-gray-400 font-medium">How your institution appears to graduates.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-600 transition shadow-xl shadow-gray-200 disabled:opacity-50"
                                    >
                                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                        {saving ? 'Writing to Sync...' : 'Apply Changes'}
                                    </button>
                                </form>
                            )}

                            {activeTab === 'users' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-black text-brand-600 uppercase tracking-widest flex items-center gap-2">
                                            <Users size={16} /> Campus Administrators
                                        </h3>
                                        <button
                                            onClick={() => setShowAddModal(true)}
                                            className="px-4 py-2 bg-brand-50 text-brand-600 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-brand-100 transition"
                                        >
                                            <UserPlus size={14} /> Add Staff
                                        </button>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="border-b border-gray-50">
                                                <tr>
                                                    <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Administrator</th>
                                                    <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Capability</th>
                                                    <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Onboarded</th>
                                                    <th className="pb-4"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {members.map(member => (
                                                    <tr key={member.id} className="group">
                                                        <td className="py-4">
                                                            <div className="font-bold text-gray-900">{member.full_name}</div>
                                                            <div className="text-xs text-gray-400 font-medium">{member.email}</div>
                                                        </td>
                                                        <td className="py-4">
                                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-tighter ${member.role === 'ADMIN' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                                                                }`}>
                                                                {member.role}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 text-xs font-bold text-gray-400">
                                                            {new Date(member.created_at).toLocaleDateString()}
                                                        </td>
                                                        <td className="py-4 text-right">
                                                            <button
                                                                onClick={() => handleRemoveMember(member.id)}
                                                                className="p-2 text-gray-300 hover:text-rose-500 transition opacity-0 group-hover:opacity-100"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'billing' && (
                                <div className="space-y-8">
                                    <div className="space-y-1">
                                        <h3 className="text-xs font-black text-brand-600 uppercase tracking-widest flex items-center gap-2">
                                            <CreditCard size={16} /> Subscription Status
                                        </h3>
                                        <p className="text-gray-400 text-sm font-medium">Manage your institutional SaaS commitment.</p>
                                    </div>

                                    <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-gray-200">
                                        <div className="relative z-10 space-y-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <span className="px-3 py-1 bg-brand-500 text-white text-[10px] font-black rounded-full uppercase tracking-widest mb-2 inline-block">Current Plan</span>
                                                    <h2 className="text-4xl font-black tracking-tight">
                                                        {(stats?.subscription?.plan_name && stats?.subscription?.plan_name !== 'NONE') ? stats.subscription.plan_name : 'FREE'}
                                                    </h2>
                                                </div>
                                                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center">
                                                    <Sparkles size={32} className="text-brand-400" />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-8 py-6 border-y border-white/10">
                                                <div className="space-y-1">
                                                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                                        <Calendar size={12} /> Renewal Date
                                                    </p>
                                                    <p className="font-bold text-lg">
                                                        {stats?.subscription?.expires_at ? new Date(stats.subscription.expires_at).toLocaleDateString() : 'Unlimited Access'}
                                                    </p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                                        <ShieldCheck size={12} /> Status
                                                    </p>
                                                    <p className="font-bold text-lg text-emerald-400 flex items-center gap-2">
                                                        <CheckCircle2 size={18} /> Active
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="pt-2 flex flex-col md:flex-row gap-6 items-center">
                                                <button
                                                    onClick={() => toast.success('Upgrade requested! Support will contact you shortly.', { icon: '🚀' })}
                                                    className="w-full md:w-auto px-10 py-4 bg-brand-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-400 transition shadow-lg shadow-brand-500/20"
                                                >
                                                    Upgrade Plan
                                                </button>
                                                <p className="text-white/40 text-xs font-medium italic">Contact your account manager for custom institution limits.</p>
                                            </div>
                                        </div>

                                        {/* Abstract background elements */}
                                        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl" />
                                        <div className="absolute -left-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <PricingCard
                                            label="Issued"
                                            value={stats?.totalCertificates || 0}
                                            limit={
                                                stats?.subscription?.plan_name === 'ENTERPRISE' ? 'UNLIMITED' :
                                                    stats?.subscription?.plan_name === 'PRO' ? '1,000' :
                                                        stats?.subscription?.plan_name === 'BASIC' ? '200' :
                                                            stats?.subscription?.plan_name === 'TRIAL' ? '100' : '10'
                                            }
                                        />
                                        <PricingCard
                                            label="Verifications"
                                            value={stats?.totalVerifications || 0}
                                            limit="UNLIMITED"
                                        />
                                        <PricingCard
                                            label="Staff Slots"
                                            value={members.length}
                                            limit={stats?.subscription?.plan_name === 'ENTERPRISE' ? 'UNLIMITED' : '10'}
                                        />
                                    </div>
                                </div>
                            )}


                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Add Member Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl relative z-10 space-y-6"
                        >
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-black text-gray-900">Add Staff Account</h2>
                                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition"><X size={20} /></button>
                            </div>

                            <AddMemberForm onComplete={() => { setShowAddModal(false); fetchMembers(); }} />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function PricingCard({ label, value, limit }: { label: string, value: number | string, limit: string }) {
    return (
        <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 flex flex-col gap-1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
            <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-gray-900">{value}</span>
                <span className="text-gray-400 font-bold text-xs">/ {limit}</span>
            </div>
            <div className="mt-3 w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                <div
                    className="bg-brand-500 h-full rounded-full transition-all duration-1000"
                    style={{ width: limit === 'UNLIMITED' ? '100%' : `${Math.min((Number(value) / Number(limit.replace(',', ''))) * 100, 100)}%` }}
                />
            </div>
        </div>
    )
}

function AddMemberForm({ onComplete }: { onComplete: () => void }) {
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'STAFF' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/institutions/my/users', form);
            toast.success('Staff onboarded successfully!');
            onComplete();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Onboarding failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
                <label className="text-xs font-black text-gray-400 uppercase ml-1">Full Identity</label>
                <input required className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl outline-none font-medium text-gray-900" placeholder="Registrar Name" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
            </div>
            <div className="space-y-1">
                <label className="text-xs font-black text-gray-400 uppercase ml-1">Work Email</label>
                <input required type="email" className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl outline-none font-medium text-gray-900" placeholder="name@edu.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-1">
                <label className="text-xs font-black text-gray-400 uppercase ml-1">Initial Password</label>
                <div className="relative">
                    <input
                        required
                        type={showPass ? "text" : "password"}
                        className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl outline-none font-medium text-gray-900"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
                    >
                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            </div>
            <div className="space-y-1">
                <label className="text-xs font-black text-gray-400 uppercase ml-1">Access Tier</label>
                <select className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl outline-none font-bold text-gray-900 cursor-pointer" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                    <option value="STAFF">Staff (Issuer Only)</option>
                    <option value="ADMIN">Admin (Full Access)</option>
                </select>
            </div>
            <div className="pt-4">
                <button disabled={loading} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-brand-600 transition shadow-xl shadow-gray-200 disabled:opacity-50">
                    {loading ? 'Creating Credentials...' : 'Register Account'}
                </button>
            </div>
        </form>
    );
}

function SidebarLink({ icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all ${active ? 'bg-brand-50 text-brand-700 shadow-sm border border-brand-100' : 'text-gray-500 hover:bg-gray-50'
                }`}
        >
            {icon} {label}
        </button>
    );
}
