import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShieldAlert, ShieldCheck, AlertTriangle, Fingerprint, Hash, 
    Edit3, RotateCcw, Zap, Lock, Unlock, ArrowRight, Info, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

// Simple SHA-256 in browser
async function sha256(message: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function TamperLab() {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const [certId, setCertId] = useState(searchParams.get('cert') || '');
    const [loading, setLoading] = useState(false);
    const [originalCert, setOriginalCert] = useState<any>(null);
    
    // Editable fields
    const [editName, setEditName] = useState('');
    const [editCourse, setEditCourse] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editDate, setEditDate] = useState(''); // display-only date (YYYY-MM-DD)
    const [originalIssueDate, setOriginalIssueDate] = useState(''); // raw issue_date for hash
    
    // Hash comparison
    const [originalHash, setOriginalHash] = useState('');
    const [tamperedHash, setTamperedHash] = useState('');
    const [isModified, setIsModified] = useState(false);
    const [hashCalculating, setHashCalculating] = useState(false);

    const loadCertificate = async () => {
        let sanitizedId = certId.trim();
        if (sanitizedId.includes('/verify/')) {
            sanitizedId = sanitizedId.split('/verify/').pop() || '';
        }
        if (!sanitizedId) return;
        
        setLoading(true);
        try {
            const res = await api.get(`/certificates/verify/${sanitizedId}`);
            if (res.data.status === 'SUCCESS' && res.data.data) {
                const cert = res.data.data;
                setOriginalCert(cert);
                setEditName(cert.student_name);
                setEditCourse(cert.course_name);
                setEditEmail(cert.student_email);
                const isoDate = new Date(cert.issue_date).toISOString().split('T')[0];
                setEditDate(isoDate);
                setOriginalIssueDate(cert.issue_date); // preserve raw for hashing
                setOriginalHash(cert.cert_hash);
                setTamperedHash(cert.cert_hash);
                setIsModified(false);
                toast.success('Certificate loaded into simulation');
            } else {
                toast.error('Certificate not verified — cannot load into lab');
            }
        } catch (error) {
            toast.error('Failed to load certificate');
        } finally {
            setLoading(false);
        }
    };

    // Recalculate hash whenever editable fields change
    useEffect(() => {
        if (!originalCert) return;
        
        const origDateStr = new Date(originalCert.issue_date).toISOString().split('T')[0];
        const hasChanged = 
            editName !== originalCert.student_name ||
            editCourse !== originalCert.course_name ||
            editEmail !== originalCert.student_email ||
            editDate !== origDateStr;
        
        setIsModified(hasChanged);
        
        // Recalculate hash — must match backend's generateCertHash exactly:
        // email.trim().toLowerCase() | name.trim() | course.trim() | Math.floor(date/1000)*1000
        const recalc = async () => {
            setHashCalculating(true);
            // If date hasn't changed, use the original raw issue_date for perfect hash match
            // If date HAS changed, use the new date (which will be midnight UTC)
            const dateForHash = editDate === origDateStr ? originalIssueDate : editDate;
            const dateObj = new Date(dateForHash);
            const normalizedTime = Math.floor(dateObj.getTime() / 1000) * 1000;
            const raw = `${editEmail.trim().toLowerCase()}|${editName.trim()}|${editCourse.trim()}|${normalizedTime}`;
            const hash = await sha256(raw);
            setTamperedHash(hash);
            setHashCalculating(false);
        };
        
        const debounce = setTimeout(recalc, 300);
        return () => clearTimeout(debounce);
    }, [editName, editCourse, editEmail, editDate, originalCert, originalIssueDate]);

    const resetFields = () => {
        if (!originalCert) return;
        setEditName(originalCert.student_name);
        setEditCourse(originalCert.course_name);
        setEditEmail(originalCert.student_email);
        setEditDate(new Date(originalCert.issue_date).toISOString().split('T')[0]);
        setIsModified(false);
        setTamperedHash(originalHash);
        toast.success('Fields reset to original');
    };

    // Auto-load if cert param provided
    useEffect(() => {
        if (searchParams.get('cert')) {
            loadCertificate();
        }
    }, []);

    // Compare hash character-by-character
    const renderHashComparison = () => {
        const chars = [];
        const maxLen = Math.max(originalHash.length, tamperedHash.length);
        for (let i = 0; i < maxLen; i++) {
            const orig = originalHash[i] || '';
            const tamp = tamperedHash[i] || '';
            const match = orig === tamp;
            chars.push(
                <span key={i} className={`inline-block w-[1ch] font-mono text-sm transition-all duration-200 ${match ? 'text-emerald-500' : 'text-rose-500 font-bold scale-110'}`}>
                    {tamp}
                </span>
            );
        }
        return chars;
    };

    const matchPercentage = (() => {
        if (!originalHash || !tamperedHash) return 100;
        let matches = 0;
        for (let i = 0; i < originalHash.length; i++) {
            if (originalHash[i] === tamperedHash[i]) matches++;
        }
        return Math.round((matches / originalHash.length) * 100);
    })();

    return (
        <div className="max-w-6xl mx-auto px-6 py-16 mt-8">
            {/* Header */}
            <div className="text-center mb-12">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <span className="px-4 py-1.5 bg-rose-50 text-rose-600 rounded-full text-xs font-black uppercase tracking-widest ring-1 ring-rose-100 mb-4 inline-block">
                        {t('tamperLab.badge')}
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                        {t('tamperLab.titlePrefix')} <span className="text-rose-500">{t('tamperLab.titleHighlight')}</span>
                    </h1>
                    <p className="text-gray-500 font-medium max-w-2xl mx-auto text-lg">
                        {t('tamperLab.subtitle')}
                    </p>
                </motion.div>
            </div>

            {/* Load Certificate */}
            {!originalCert && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-10">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Fingerprint size={36} className="text-rose-500" />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 mb-2">Load a Certificate</h2>
                            <p className="text-gray-500 font-medium">Enter a verified certificate ID to begin the tamper simulation.</p>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); loadCertificate(); }} className="flex gap-3">
                            <input
                                type="text"
                                placeholder="Certificate UUID..."
                                className="flex-1 px-5 py-4 border-2 border-gray-200 rounded-2xl focus:border-rose-400 focus:outline-none transition font-medium"
                                value={certId}
                                onChange={(e) => setCertId(e.target.value)}
                            />
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-rose-600 transition flex items-center gap-2 disabled:opacity-50"
                            >
                                <Zap size={18} /> {loading ? 'Loading...' : 'Load'}
                            </button>
                        </form>
                    </div>
                </motion.div>
            )}

            {/* Main Lab Interface */}
            <AnimatePresence>
            {originalCert && (
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    {/* Info Banner */}
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-6 text-white flex items-center gap-4">
                        <div className="p-3 bg-white/10 rounded-2xl">
                            <Info size={24} className="text-brand-400" />
                        </div>
                        <div className="flex-1">
                            <p className="font-bold">How this works</p>
                            <p className="text-sm text-gray-400 font-medium">
                                Every certificate's fields are hashed together using SHA-256. Even changing a single character produces a completely different hash — 
                                this is the <span className="text-brand-400 font-bold">avalanche effect</span>. The blockchain stores the original hash, making forgery mathematically impossible.
                            </p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Left: Editable Certificate */}
                        <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-sm overflow-hidden">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Edit3 size={16} className="text-gray-400" />
                                    <span className="font-black text-sm text-gray-900 uppercase tracking-widest">Modify Certificate Data</span>
                                </div>
                                <button onClick={resetFields} className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-brand-600 transition">
                                    <RotateCcw size={14} /> Reset
                                </button>
                            </div>
                            <div className="p-6 space-y-5">
                                <EditField 
                                    label="Student Name" 
                                    value={editName} 
                                    onChange={setEditName} 
                                    original={originalCert.student_name} 
                                />
                                <EditField 
                                    label="Student Email" 
                                    value={editEmail} 
                                    onChange={setEditEmail} 
                                    original={originalCert.student_email} 
                                />
                                <EditField 
                                    label="Course Name" 
                                    value={editCourse} 
                                    onChange={setEditCourse} 
                                    original={originalCert.course_name} 
                                />
                                <EditField 
                                    label="Issue Date" 
                                    value={editDate} 
                                    onChange={setEditDate} 
                                    original={new Date(originalCert.issue_date).toISOString().split('T')[0]}
                                    type="date"
                                />
                            </div>
                        </div>

                        {/* Right: Hash Comparison */}
                        <div className="space-y-6">
                            {/* Status Indicator */}
                            <motion.div 
                                animate={{ scale: isModified ? [1, 1.02, 1] : 1 }}
                                className={`rounded-3xl p-6 border-2 transition-all duration-500 ${
                                    isModified 
                                        ? 'bg-rose-50 border-rose-200 shadow-lg shadow-rose-100' 
                                        : 'bg-emerald-50 border-emerald-200 shadow-lg shadow-emerald-100'
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <motion.div 
                                        animate={{ rotate: isModified ? [0, -10, 10, -10, 0] : 0 }}
                                        transition={{ duration: 0.5 }}
                                        className={`p-4 rounded-2xl ${isModified ? 'bg-rose-100' : 'bg-emerald-100'}`}
                                    >
                                        {isModified ? <Unlock size={28} className="text-rose-600" /> : <Lock size={28} className="text-emerald-600" />}
                                    </motion.div>
                                    <div>
                                        <h3 className={`text-xl font-black ${isModified ? 'text-rose-700' : 'text-emerald-700'}`}>
                                            {isModified ? '⚠ TAMPER DETECTED' : '✓ INTEGRITY INTACT'}
                                        </h3>
                                        <p className={`text-sm font-medium ${isModified ? 'text-rose-500' : 'text-emerald-500'}`}>
                                            {isModified 
                                                ? `Hash mismatch — ${100 - matchPercentage}% of characters changed` 
                                                : 'All fields match the blockchain record'
                                            }
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Original Hash */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="p-1.5 bg-emerald-50 rounded-lg">
                                        <ShieldCheck size={14} className="text-emerald-500" />
                                    </div>
                                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Original Hash (Blockchain)</span>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-xl font-mono text-xs text-emerald-600 break-all leading-relaxed border border-gray-100">
                                    {originalHash}
                                </div>
                            </div>

                            {/* Tampered Hash */}
                            <div className={`bg-white rounded-2xl border p-5 transition-all ${isModified ? 'border-rose-200' : 'border-gray-100'}`}>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className={`p-1.5 rounded-lg ${isModified ? 'bg-rose-50' : 'bg-gray-50'}`}>
                                        <Hash size={14} className={isModified ? 'text-rose-500' : 'text-gray-400'} />
                                    </div>
                                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">
                                        {isModified ? 'Tampered Hash (Recalculated)' : 'Current Hash (Matches)'}
                                    </span>
                                    {hashCalculating && <Sparkles size={12} className="text-amber-500 animate-spin" />}
                                </div>
                                <div className={`bg-gray-50 p-3 rounded-xl break-all leading-relaxed border border-gray-100 ${isModified ? 'ring-2 ring-rose-200' : ''}`}>
                                    {renderHashComparison()}
                                </div>
                            </div>

                            {/* Match Meter */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-5">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Hash Similarity</span>
                                    <span className={`text-sm font-black ${matchPercentage === 100 ? 'text-emerald-600' : matchPercentage > 50 ? 'text-amber-600' : 'text-rose-600'}`}>
                                        {matchPercentage}%
                                    </span>
                                </div>
                                <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div 
                                        animate={{ width: `${matchPercentage}%` }}
                                        transition={{ duration: 0.5, ease: 'easeOut' }}
                                        className={`h-full rounded-full transition-colors ${
                                            matchPercentage === 100 ? 'bg-emerald-500' : matchPercentage > 50 ? 'bg-amber-500' : 'bg-rose-500'
                                        }`}
                                    />
                                </div>
                                <p className="text-xs text-gray-400 font-medium mt-2">
                                    {matchPercentage === 100 
                                        ? 'Perfect match — certificate is authentic' 
                                        : `Only ${matchPercentage}% character match — blockchain will reject this certificate`
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Educational Section */}
                    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-10 text-white">
                        <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                            <Fingerprint size={24} className="text-brand-400" /> Why Is This Unbreakable?
                        </h3>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="space-y-3">
                                <div className="w-10 h-10 bg-brand-500/20 rounded-xl flex items-center justify-center">
                                    <span className="text-brand-400 font-black text-lg">1</span>
                                </div>
                                <h4 className="font-bold text-lg">Avalanche Effect</h4>
                                <p className="text-gray-400 text-sm font-medium leading-relaxed">
                                    SHA-256 ensures that even changing a single character (e.g., "John" → "john") produces a completely different 64-character hash. There is no pattern or shortcut.
                                </p>
                            </div>
                            <div className="space-y-3">
                                <div className="w-10 h-10 bg-brand-500/20 rounded-xl flex items-center justify-center">
                                    <span className="text-brand-400 font-black text-lg">2</span>
                                </div>
                                <h4 className="font-bold text-lg">One-Way Function</h4>
                                <p className="text-gray-400 text-sm font-medium leading-relaxed">
                                    You cannot reverse-engineer the original data from the hash. A forger would need to guess the exact input — with 2²⁵⁶ possible combinations, that's computationally infeasible.
                                </p>
                            </div>
                            <div className="space-y-3">
                                <div className="w-10 h-10 bg-brand-500/20 rounded-xl flex items-center justify-center">
                                    <span className="text-brand-400 font-black text-lg">3</span>
                                </div>
                                <h4 className="font-bold text-lg">Immutable Ledger</h4>
                                <p className="text-gray-400 text-sm font-medium leading-relaxed">
                                    The original hash is stored on-chain. Even if someone hacks the database, the blockchain record cannot be altered — providing an independent source of truth.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Load another */}
                    <div className="text-center">
                        <button 
                            onClick={() => { setOriginalCert(null); setCertId(''); }}
                            className="text-sm font-bold text-gray-400 hover:text-brand-600 transition flex items-center gap-2 mx-auto"
                        >
                            <RotateCcw size={14} /> Load a different certificate
                        </button>
                    </div>
                </motion.div>
            )}
            </AnimatePresence>
        </div>
    );
}

function EditField({ label, value, onChange, original, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; original: string; type?: string }) {
    const isChanged = value !== original;
    return (
        <div>
            <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</label>
                {isChanged && (
                    <motion.span initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-1">
                        <AlertTriangle size={10} /> Modified
                    </motion.span>
                )}
            </div>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border-2 transition font-medium text-sm ${
                    isChanged 
                        ? 'border-rose-300 bg-rose-50/50 text-rose-900 ring-2 ring-rose-100' 
                        : 'border-gray-200 bg-white text-gray-900'
                } focus:outline-none`}
            />
        </div>
    );
}
