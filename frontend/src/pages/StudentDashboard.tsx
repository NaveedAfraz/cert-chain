import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
    Award, ShieldCheck, Download, Search, 
    LayoutGrid, History, Heart, ArrowRight, Star
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudentDashboard() {
    const [myCerts, setMyCerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a full implementation, we'd fetch based on current user email
        // For the demo, we show a clean empty state or a prompt
        setTimeout(() => setLoading(false), 800);
    }, []);

    return (
        <div className="max-w-[90rem] mx-auto px-6 py-10 space-y-12">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-brand-600 to-indigo-700 rounded-[3rem] p-12 text-white shadow-2xl shadow-brand-500/20 relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6"
                    >
                        <Star size={14} className="fill-brand-300 text-brand-300" /> Professional Portfolio
                    </motion.div>
                    <h1 className="text-5xl font-black tracking-tight mb-4">Your Achievements, <br/>Secured by Blockchain.</h1>
                    <p className="text-brand-100 text-lg font-medium opacity-80 mb-8">
                        All your earned credentials from various institutions are stored on the public ledger for instant, tamper-proof verification by employers.
                    </p>
                    <div className="flex gap-4">
                        <button className="bg-white text-brand-600 px-8 py-4 rounded-2xl font-black text-sm hover:bg-brand-50 transition shadow-xl">
                            Share All Proofs
                        </button>
                    </div>
                </div>
                <Award className="absolute -right-20 -bottom-20 text-white/5 w-96 h-96 rotate-12" />
            </div>

            <div className="grid lg:grid-cols-12 gap-10">
                {/* Main Content */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                            <History size={24} className="text-brand-600" /> My Credential History
                        </h2>
                        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
                            <button className="p-2 bg-white shadow-sm rounded-lg text-brand-600"><LayoutGrid size={18} /></button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid md:grid-cols-2 gap-6">
                            {[1, 2].map(i => <div key={i} className="h-48 bg-gray-100 rounded-3xl animate-pulse" />)}
                        </div>
                    ) : myCerts.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white p-16 rounded-[3rem] border-2 border-dashed border-gray-100 text-center flex flex-col items-center gap-6"
                        >
                            <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-[2rem] flex items-center justify-center">
                                <Search size={40} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 mb-2">No Credentials Found</h3>
                                <p className="text-gray-400 font-medium max-w-xs mx-auto">
                                    Certificates are linked to your email address. Once an institution issues one, it will appear here automatically.
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Render items */}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                        <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest flex items-center gap-2">
                            <ShieldCheck size={16} className="text-emerald-500" /> Trust Network
                        </h3>
                        <p className="text-sm font-medium text-gray-500 leading-relaxed">
                            Your identity is verified via cryptography. You can share your certificates on LinkedIn or Resume directly from here.
                        </p>
                        <div className="pt-4 space-y-3">
                            <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between">
                                <span className="text-sm font-bold text-gray-600">Verified Identity</span>
                                <CheckCircleIcon />
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between">
                                <span className="text-sm font-bold text-gray-600">Blockchain Sync</span>
                                <CheckCircleIcon />
                            </div>
                        </div>
                    </div>

                    <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100">
                        <h3 className="font-black text-indigo-900 uppercase text-xs tracking-widest mb-4">Did You Know?</h3>
                        <p className="text-sm text-indigo-800 font-medium leading-relaxed">
                            Blockchain certificates can never be forged, making them the gold standard for high-stakes employment.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CheckCircleIcon() {
    return (
        <div className="w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center">
            <ShieldCheck size={12} />
        </div>
    );
}
