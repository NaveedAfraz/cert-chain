import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { 
    Zap, Shield, Clock, PlusSquare, 
    TrendingUp, FileCheck, Calendar, ArrowRight, Activity, 
    Users, Award
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get('/institutions/stats');
            setStats(res.data);
        } catch (error) {
            console.error('Failed to fetch stats');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-20 text-center animate-pulse">Syncing Ledger Data...</div>;

    const expiryDays = stats ? Math.ceil((new Date(stats.subscription.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
            {/* Header / Hero */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Institutional Overview</h1>
                    <p className="text-gray-500 font-medium">Monitoring blockchain issuance and verification telemetry.</p>
                </div>
                <div className="flex gap-4">
                    <Link 
                        to="/admin/issue"
                        className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-brand-600 transition shadow-xl shadow-gray-200"
                    >
                        <PlusSquare size={20} /> New Certificate
                    </Link>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Issued</p>
                        <p className="text-3xl font-black text-gray-900">{stats?.totalCertificates || 0}</p>
                    </div>
                    <div className="w-14 h-14 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center">
                        <Award size={28} />
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Public Verifications</p>
                        <p className="text-3xl font-black text-indigo-600">{stats?.totalVerifications || 0}</p>
                    </div>
                    <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                        <TrendingUp size={28} />
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">SaaS Plan</p>
                        <p className="text-xl font-black text-emerald-600">{stats?.subscription.plan_name} TRIAL</p>
                    </div>
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                        <Zap size={28} />
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-10">
                {/* Left Column: Recent Logic / Charts */}
                <div className="lg:col-span-8 space-y-10">
                    <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                                <Activity size={20} className="text-brand-500" /> System Growth
                            </h3>
                            <Link to="/admin/certificates" className="text-sm font-bold text-brand-600 hover:underline flex items-center gap-1">
                                View Records <ArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="h-64 flex items-end gap-3 px-4">
                            {[40, 70, 45, 90, 65, 80, 50, 60, 40, 85, 95, 75].map((h, i) => (
                                <div key={i} className="flex-1 bg-gray-50 rounded-t-xl relative group">
                                    <motion.div 
                                        initial={{ height: 0 }}
                                        animate={{ height: `${h}%` }}
                                        className="w-full bg-brand-200 group-hover:bg-brand-500 transition-colors rounded-t-xl"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <span>Jan</span>
                            <span>Jun</span>
                            <span>Dec</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Health & Security */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-gray-900 p-8 rounded-[2.5rem] text-white space-y-6">
                        <div className="flex items-center gap-3">
                            <Shield className="text-brand-500" size={24} />
                            <h3 className="font-bold">EVM Network Identity</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-800 rounded-2xl border border-gray-700">
                                <p className="text-[10px] uppercase font-black text-gray-500 tracking-widest mb-1">Ledger Sync Status</p>
                                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    Synchronized with Node
                                </div>
                            </div>
                            <div className="p-4 bg-gray-800 rounded-2xl border border-gray-700">
                                <p className="text-[10px] uppercase font-black text-gray-500 tracking-widest mb-1">Contract Version</p>
                                <p className="font-mono text-xs text-brand-400">v0.8.20-SaasMaster</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-brand-50 p-8 rounded-[2.5rem] border border-brand-100 flex flex-col justify-between h-56">
                        <div>
                            <h3 className="font-black text-brand-900 uppercase text-xs tracking-widest mb-2">Subscription Health</h3>
                            <p className="text-brand-700 font-bold text-xl">{expiryDays} Days Remaining</p>
                        </div>
                        <Link 
                            to="/admin/settings"
                            className="bg-white text-brand-600 py-3 rounded-xl font-bold text-center border border-brand-200 hover:bg-brand-100 transition"
                        >
                            Manage Plan
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
