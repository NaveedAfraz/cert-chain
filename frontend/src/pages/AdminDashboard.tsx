import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { 
    Zap, Shield, Clock, PlusSquare, 
    TrendingUp, FileCheck, Calendar, ArrowRight, Activity, 
    Users, Award, AlertTriangle, BookOpen, CheckCircle2, XCircle
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

    const plan = stats?.subscription?.plan_name || 'FREE';
    const expiresAt = stats?.subscription?.expires_at;
    const expiryDays = expiresAt ? Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
    const isFree = !expiresAt || expiryDays === null || expiryDays < 0;
    const certLimit = plan === 'ENTERPRISE' ? 'Unlimited' : plan === 'PRO' ? '1,000' : plan === 'BASIC' ? '200' : '10';

    // Build 12-month chart data
    const chartData = (() => {
        const months: { label: string; count: number }[] = [];
        for (let i = 11; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const key = d.toISOString().slice(0, 7); // YYYY-MM
            const label = d.toLocaleString('default', { month: 'short' });
            const found = stats?.monthlyData?.find((m: any) => m.month === key);
            months.push({ label, count: found?.count || 0 });
        }
        return months;
    })();
    const maxCount = Math.max(...chartData.map(m => m.count), 1);

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10 space-y-8 md:space-y-10">
            {/* Header / Hero */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">Institutional Overview</h1>
                    <p className="text-gray-500 font-medium text-sm md:text-base">Monitoring blockchain issuance and verification telemetry.</p>
                </div>
                <div className="flex gap-4">
                    <Link 
                        to="/admin/issue"
                        className="bg-gray-900 text-white px-5 py-3 md:px-8 md:py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-brand-600 transition shadow-xl shadow-gray-200 text-sm md:text-base"
                    >
                        <PlusSquare size={18} /> New Certificate
                    </Link>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatCard label="Total Issued" value={stats?.totalCertificates || 0} icon={<Award size={28} />} color="brand" />
                <StatCard label="Public Verifications" value={stats?.totalVerifications || 0} icon={<TrendingUp size={28} />} color="indigo" />
                <StatCard label="Revoked" value={stats?.totalRevoked || 0} icon={<AlertTriangle size={28} />} color="rose" />
                <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center justify-between">
                    <div className="min-w-0">
                        <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest mb-1 truncate">SaaS Plan</p>
                        <p className="text-lg md:text-xl font-black text-emerald-600">{plan}</p>
                    </div>
                    <div className="w-10 h-10 md:w-14 md:h-14 bg-emerald-50 text-emerald-600 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
                        <Zap size={22} />
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-6 md:gap-10">
                {/* Left Column: Real Chart */}
                <div className="lg:col-span-8 space-y-6 md:space-y-10">
                    {/* Monthly Issuance Chart */}
                    <div className="bg-white p-5 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-gray-100 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 md:mb-8">
                            <h3 className="text-base md:text-xl font-black text-gray-900 flex items-center gap-2">
                                <Activity size={18} className="text-brand-500" /> Issued (12 Months)
                            </h3>
                            <Link to="/admin/certificates" className="text-sm font-bold text-brand-600 hover:underline flex items-center gap-1">
                                View Records <ArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="h-48 md:h-64 flex items-end gap-1 md:gap-2 px-1 md:px-2">
                            {chartData.map((m, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                                    <span className="text-[10px] font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition absolute -top-5">
                                        {m.count}
                                    </span>
                                    <motion.div 
                                        initial={{ height: 0 }}
                                        animate={{ height: m.count > 0 ? `${Math.max((m.count / maxCount) * 100, 4)}%` : '2%' }}
                                        transition={{ duration: 0.6, delay: i * 0.05 }}
                                        className={`w-full rounded-t-xl transition-colors ${
                                            m.count > 0 
                                                ? 'bg-brand-200 group-hover:bg-brand-500' 
                                                : 'bg-gray-100'
                                        }`}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-4 px-2">
                            {chartData.map((m, i) => (
                                <span key={i} className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex-1 text-center">{m.label}</span>
                            ))}
                        </div>
                    </div>

                    {/* Top Courses & Verification Breakdown */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Top Courses */}
                        <div className="bg-white p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <BookOpen size={16} className="text-brand-500" /> Top Courses
                            </h3>
                            {stats?.topCourses?.length > 0 ? (
                                <div className="space-y-4">
                                    {stats.topCourses.map((c: any, i: number) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <span className="w-6 h-6 bg-brand-50 text-brand-600 rounded-lg flex items-center justify-center text-xs font-black">{i + 1}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-gray-900 truncate">{c.course_name}</p>
                                                <div className="w-full h-1.5 bg-gray-100 rounded-full mt-1">
                                                    <div 
                                                        className="h-full bg-brand-400 rounded-full"
                                                        style={{ width: `${(c.count / (stats.topCourses[0]?.count || 1)) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <span className="text-sm font-black text-gray-500">{c.count}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-sm font-medium">No certificate data yet</p>
                            )}
                        </div>

                        {/* Verification Breakdown */}
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Shield size={16} className="text-emerald-500" /> Verification Results
                            </h3>
                            {stats?.verificationBreakdown?.length > 0 ? (
                                <div className="space-y-4">
                                    {stats.verificationBreakdown.map((v: any, i: number) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className={`p-1.5 rounded-lg ${
                                                v.result === 'SUCCESS' ? 'bg-emerald-50 text-emerald-500' :
                                                v.result === 'TAMPERED' ? 'bg-rose-50 text-rose-500' :
                                                'bg-amber-50 text-amber-500'
                                            }`}>
                                                {v.result === 'SUCCESS' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                                            </div>
                                            <span className="text-sm font-bold text-gray-700 flex-1">{v.result}</span>
                                            <span className="text-lg font-black text-gray-900">{v.count}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-sm font-medium">No verifications yet</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Health & Activity */}
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

                    {/* Subscription Health */}
                    <div className="bg-brand-50 p-8 rounded-[2.5rem] border border-brand-100 flex flex-col justify-between h-56">
                        <div>
                            <h3 className="font-black text-brand-900 uppercase text-xs tracking-widest mb-2">Subscription Health</h3>
                            {isFree ? (
                                <>
                                    <p className="text-brand-700 font-black text-2xl">FREE Plan</p>
                                    <p className="text-brand-500 text-sm font-medium mt-1">
                                        {stats?.totalCertificates ?? 0} / {certLimit} certificates used
                                    </p>
                                    <div className="mt-3 w-full bg-brand-100 h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className="bg-brand-500 h-full rounded-full transition-all"
                                            style={{ width: certLimit === 'Unlimited' ? '100%' : `${Math.min(((stats?.totalCertificates ?? 0) / parseInt(certLimit.replace(',', ''))) * 100, 100)}%` }}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-brand-700 font-bold text-xl">{expiryDays} Days Remaining</p>
                                    <p className="text-brand-500 text-sm font-medium mt-1">{plan} Plan · {certLimit} certs</p>
                                </>
                            )}
                        </div>
                        <Link 
                            to="/admin/settings"
                            className="bg-white text-brand-600 py-3 rounded-xl font-bold text-center border border-brand-200 hover:bg-brand-100 transition"
                        >
                            Manage Plan
                        </Link>
                    </div>

                    {/* Recent Activity Feed */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Clock size={14} className="text-gray-400" /> Recent Activity
                        </h3>
                        {stats?.recentActivity?.length > 0 ? (
                            <div className="space-y-3">
                                {stats.recentActivity.slice(0, 6).map((a: any, i: number) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className={`p-1.5 rounded-lg ${a.type === 'ISSUED' ? 'bg-brand-50 text-brand-500' : 'bg-indigo-50 text-indigo-500'}`}>
                                            {a.type === 'ISSUED' ? <FileCheck size={14} /> : <TrendingUp size={14} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-gray-900 truncate">{a.detail}</p>
                                            <p className="text-[10px] text-gray-400 font-medium">
                                                {a.type === 'ISSUED' ? a.extra : `Verification: ${a.extra}`} · {new Date(a.timestamp).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-sm font-medium">No activity yet</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: any; color: string }) {
    const colorMap: any = {
        brand: { bg: 'bg-brand-50', text: 'text-brand-600' },
        indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
        rose: { bg: 'bg-rose-50', text: 'text-rose-600' },
        emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
    };
    const c = colorMap[color] || colorMap.brand;
    return (
        <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="min-w-0">
                <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest mb-1 truncate">{label}</p>
                <p className={`text-2xl md:text-3xl font-black ${c.text}`}>{value}</p>
            </div>
            <div className={`w-10 h-10 md:w-14 md:h-14 ${c.bg} ${c.text} rounded-xl md:rounded-2xl flex items-center justify-center shrink-0`}>
                {icon}
            </div>
        </div>
    );
}
