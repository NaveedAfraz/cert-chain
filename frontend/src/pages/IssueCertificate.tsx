import React, { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
    Shield, CheckCircle2, Hash, Globe, FileCheck, ArrowRight, Sparkles, User, Mail, GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function IssueCertificate() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [course, setCourse] = useState('');
    
    const [issuingState, setIssuingState] = useState<'IDLE' | 'HASHING' | 'BLOCKCHAIN' | 'FINALIZING' | 'SUCCESS'>('IDLE');
    const [progress, setProgress] = useState(0);
    const [lastIssuedCert, setLastIssuedCert] = useState<any>(null);

    const handleIssue = async (e: React.FormEvent) => {
        e.preventDefault();
        setIssuingState('HASHING');
        setProgress(25);
        
        try {
            await new Promise(r => setTimeout(r, 800));
            
            setIssuingState('BLOCKCHAIN');
            setProgress(60);

            const res = await api.post('/certificates/issue', {
                studentEmail: email,
                studentName: name,
                courseName: course
            });

            setIssuingState('FINALIZING');
            setProgress(90);
            await new Promise(r => setTimeout(r, 800));

            setIssuingState('SUCCESS');
            setProgress(100);
            setLastIssuedCert(res.data.certificate);
            toast.success('Certificate Secured on Ledger!');
            
            // Clear form
            setEmail('');
            setName('');
            setCourse('');

        } catch (error: any) {
            setIssuingState('IDLE');
            setProgress(0);
            toast.error(error.response?.data?.message || 'Issuance failed');
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="text-center mb-12">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-brand-50 text-brand-600 rounded-3xl mb-4"
                >
                    <Sparkles size={32} />
                </motion.div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">Issue New Credential</h1>
                <p className="text-gray-500 mt-2 font-medium">Verify human achievement on the immutable ledger.</p>
            </div>

            <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-brand-500/5 border border-gray-100 relative overflow-hidden">
                <AnimatePresence mode="wait">
                    {issuingState === 'IDLE' || (issuingState === 'SUCCESS' && !lastIssuedCert) ? (
                        <motion.form 
                            key="form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onSubmit={handleIssue} 
                            className="space-y-8"
                        >
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-sm font-black text-gray-700 ml-1 uppercase tracking-widest">Student Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                                        <input
                                            type="text" required
                                            className="w-full pl-12 pr-4 py-5 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none transition"
                                            placeholder="Jane Doe"
                                            value={name} onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-black text-gray-700 ml-1 uppercase tracking-widest">Student Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                                        <input
                                            type="email" required
                                            className="w-full pl-12 pr-4 py-5 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none transition"
                                            placeholder="jane@university.edu"
                                            value={email} onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-black text-gray-700 ml-1 uppercase tracking-widest">Certification Program / Course</label>
                                <div className="relative">
                                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                                    <input
                                        type="text" required
                                        className="w-full pl-12 pr-4 py-5 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none transition"
                                        placeholder="e.g. B.Sc. in Computer Science"
                                        value={course} onChange={(e) => setCourse(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-brand-600 transition shadow-2xl shadow-brand-500/10 group"
                                >
                                    <Shield size={24} /> 
                                    Secure on Blockchain 
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <p className="text-center text-gray-400 text-xs mt-6 uppercase font-bold tracking-[0.2em]">
                                    Mining will take approximately 5-10 seconds
                                </p>
                            </div>
                        </motion.form>
                    ) : issuingState === 'SUCCESS' && lastIssuedCert ? (
                        <motion.div 
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-10"
                        >
                            <div className="flex flex-col md:flex-row items-stretch gap-8 bg-gray-50/50 p-2 rounded-[2.5rem] border border-gray-100">
                                {/* Left Side: Certificate Proof */}
                                <div className="flex-1 bg-white p-10 rounded-[2.2rem] shadow-sm border border-gray-100 flex flex-col justify-between">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                                <CheckCircle2 size={24} />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-black text-gray-900 leading-none">Block Secured</h2>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Transaction Identity Verified</p>
                                            </div>
                                        </div>
                                        
                                        <div className="py-6 border-y border-gray-50 flex flex-col gap-4">
                                            <div className="flex justify-between items-center group cursor-pointer" onClick={() => { navigator.clipboard.writeText(lastIssuedCert.id); toast.success('ID Copied!'); }}>
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Certificate UUID</p>
                                                    <p className="text-sm font-bold text-gray-700 font-mono tracking-tighter">{lastIssuedCert.id}</p>
                                                </div>
                                                <div className="p-2 bg-gray-50 text-gray-400 rounded-lg group-hover:text-brand-600 group-hover:bg-brand-50 transition">
                                                    <Hash size={16} />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Anchored at Block</p>
                                                <p className="text-sm font-bold text-emerald-600">#{lastIssuedCert.blockchain.blockNumber}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 space-y-4">
                                        <p className="text-xs font-medium text-gray-500 leading-relaxed italic">
                                            This credential has been hashed with SHA-256 and stamped on the EVM ledger. Its integrity is now permanent and globally verifiable.
                                        </p>
                                        <div className="flex gap-3">
                                            <button 
                                                onClick={() => { navigator.clipboard.writeText(`http://localhost:5173/verify/${lastIssuedCert.id}`); toast.success('Shareable Link Copied!'); }}
                                                className="flex-1 py-3 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-brand-600 transition flex items-center justify-center gap-2"
                                            >
                                                <Globe size={14} /> Copy Link
                                            </button>
                                            <button 
                                                onClick={() => setIssuingState('IDLE')}
                                                className="px-6 py-3 border-2 border-gray-100 text-gray-400 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 hover:text-gray-900 transition"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Visual Proof (QR) */}
                                <div className="w-full md:w-80 bg-gray-900 p-8 rounded-[2.2rem] flex flex-col items-center justify-center text-center relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-brand-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="bg-white p-4 rounded-[2rem] shadow-2xl mb-6 relative z-10">
                                        <img src={lastIssuedCert.qrCode} alt="Security QR" className="w-48 h-48" />
                                    </div>
                                    <div className="relative z-10">
                                        <h4 className="text-white font-black text-sm uppercase tracking-[0.2em] mb-1">Audit QR</h4>
                                        <p className="text-gray-400 text-[10px] font-bold">SCAN TO INSTANTLY VALIDATE</p>
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-white/5 w-full relative z-10">
                                        <a 
                                            href={`/verify/${lastIssuedCert.id}`} 
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-brand-400 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:text-white transition"
                                        >
                                            Public Proof <ArrowRight size={14} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="progress"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-12 space-y-12"
                        >
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <h3 className="text-2xl font-black text-gray-900">Validating Block...</h3>
                                    <span className="text-brand-600 font-black text-2xl">{progress}%</span>
                                </div>
                                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div 
                                        className="h-full bg-brand-500"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ type: 'spring', stiffness: 20 }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <ProgressStep 
                                    active={issuingState === 'HASHING'} 
                                    completed={progress > 25}
                                    icon={<Hash size={24} />} 
                                    label="Create Hash" 
                                    desc="SHA-256 Fingerprint"
                                />
                                <ProgressStep 
                                    active={issuingState === 'BLOCKCHAIN'} 
                                    completed={progress > 60}
                                    icon={<Globe size={24} />} 
                                    label="Anchor Data" 
                                    desc="EVM Network Sync"
                                />
                                <ProgressStep 
                                    active={issuingState === 'FINALIZING'} 
                                    completed={progress > 90}
                                    icon={<FileCheck size={24} />} 
                                    label="Confirm" 
                                    desc="Atomic DB Match"
                                />
                            </div>

                            <div className="flex items-center justify-center gap-3 text-gray-400 font-bold italic animate-pulse">
                                <div className="w-2 h-2 rounded-full bg-brand-500" />
                                {issuingState === 'HASHING' && "Creating non-repudiable identity..."}
                                {issuingState === 'BLOCKCHAIN' && "Securing consensus on the chain..."}
                                {issuingState === 'FINALIZING' && "Linking transaction to SQL record..."}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function ProgressStep({ active, completed, icon, label, desc }: { active: boolean, completed: boolean, icon: any, label: string, desc: string }) {
    return (
        <div className={`p-6 rounded-[2rem] border-2 transition-all duration-500 ${
            active ? 'border-brand-500 bg-brand-50/50 shadow-xl shadow-brand-500/10 scale-105' : 
            completed ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-100 bg-gray-50 grayscale opacity-50'
        }`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                active ? 'bg-brand-500 text-white animate-pulse' : 
                completed ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'
            }`}>
                {icon}
            </div>
            <h4 className={`font-black text-sm uppercase tracking-widest ${active || completed ? 'text-gray-900' : 'text-gray-400'}`}>{label}</h4>
            <p className="text-xs font-medium text-gray-400 mt-1">{desc}</p>
        </div>
    );
}
