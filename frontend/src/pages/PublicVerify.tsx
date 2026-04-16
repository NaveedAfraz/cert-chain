import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, ShieldCheck, ShieldAlert, AlertTriangle, Building2, 
    Download, Copy, CheckCircle2, Clock, Hash, Link2, 
    FileCheck2, User, GraduationCap, Calendar, Fingerprint, Globe, ExternalLink
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import jsPDF from 'jspdf';

export default function PublicVerify({ isEmbedded = false }: { isEmbedded?: boolean }) {
    const { certificateId: urlCertId } = useParams();
    const { t, i18n } = useTranslation();
    const [certId, setCertId] = useState(urlCertId || '');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    // Auto-verify if URL has cert ID
    React.useEffect(() => {
        if (urlCertId && !result) {
            setCertId(urlCertId);
            doVerify(urlCertId);
        }
    }, [urlCertId]);

    const doVerify = async (id: string) => {
        let sanitizedId = id.trim();
        if (sanitizedId.includes('/verify/')) {
            sanitizedId = sanitizedId.split('/verify/').pop() || '';
        }
        if (!sanitizedId) return;
        setLoading(true);
        setResult(null);
        try {
            const res = await api.get(`/certificates/verify/${sanitizedId}`);
            setResult(res.data);
            toast.success('Verification Complete');
        } catch (error: any) {
            setResult(error.response?.data || { status: 'FAILED', message: 'An unknown error occurred.' });
            toast.error('Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        doVerify(certId);
    };

    const handleCopyLink = () => {
        const link = `${window.location.origin}/verify/${result?.data?.id}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        toast.success('Verification link copied!');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownloadPDF = () => {
        if (!result?.data) return;
        const cert = result.data;
        const doc = new jsPDF('landscape', 'mm', 'a4');
        const w = doc.internal.pageSize.getWidth();
        const h = doc.internal.pageSize.getHeight();

        // Background
        doc.setFillColor(15, 23, 42); // dark navy
        doc.rect(0, 0, w, h, 'F');

        // Accent stripe
        doc.setFillColor(20, 184, 166); // brand teal
        doc.rect(0, 0, w, 8, 'F');
        doc.rect(0, h - 8, w, 8, 'F');

        // Inner card
        doc.setFillColor(30, 41, 59);
        doc.roundedRect(20, 20, w - 40, h - 40, 6, 6, 'F');

        // Title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(20, 184, 166);
        doc.text('BLOCKCHAIN VERIFIED CREDENTIAL', w / 2, 38, { align: 'center' });

        // Certificate title
        doc.setFontSize(32);
        doc.setTextColor(255, 255, 255);
        doc.text('Certificate of Achievement', w / 2, 55, { align: 'center' });

        // Divider
        doc.setDrawColor(20, 184, 166);
        doc.setLineWidth(0.5);
        doc.line(60, 62, w - 60, 62);

        // Recipient
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(14);
        doc.setTextColor(148, 163, 184);
        doc.text('This is to certify that', w / 2, 78, { align: 'center' });

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(28);
        doc.setTextColor(255, 255, 255);
        doc.text(cert.student_name, w / 2, 92, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(14);
        doc.setTextColor(148, 163, 184);
        doc.text('has successfully completed', w / 2, 105, { align: 'center' });

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(22);
        doc.setTextColor(20, 184, 166);
        doc.text(cert.course_name, w / 2, 118, { align: 'center' });

        // Institution
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(13);
        doc.setTextColor(148, 163, 184);
        doc.text(`Issued by ${cert.institution_name}`, w / 2, 132, { align: 'center' });
        doc.text(`on ${new Date(cert.issue_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, w / 2, 140, { align: 'center' });

        // Bottom info bar
        doc.setFillColor(15, 23, 42);
        doc.roundedRect(30, h - 55, w - 60, 28, 3, 3, 'F');

        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.setFont('helvetica', 'bold');
        doc.text('CERTIFICATE ID', 45, h - 45);
        doc.text('BLOCKCHAIN HASH', w / 2 - 30, h - 45);
        doc.text('TX HASH', w - 100, h - 45);

        doc.setFont('courier', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(148, 163, 184);
        doc.text(cert.id || 'N/A', 45, h - 38);
        doc.text((cert.cert_hash || 'N/A').substring(0, 32) + '...', w / 2 - 30, h - 38);
        doc.text((cert.tx_hash || 'N/A').substring(0, 24) + '...', w - 100, h - 38);

        // Footer
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(71, 85, 105);
        doc.text(`Verify: ${window.location.origin}/verify/${cert.id}`, w / 2, h - 15, { align: 'center' });
        doc.text('Powered by CertChain · Immutable Blockchain Credential Protocol', w / 2, h - 10, { align: 'center' });

        doc.save(`CertChain_${cert.student_name.replace(/\s/g, '_')}_${cert.course_name.replace(/\s/g, '_')}.pdf`);
        toast.success('Certificate downloaded!');
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'SUCCESS': return { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: <ShieldCheck className="text-emerald-600" size={32} />, color: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700', label: 'VERIFIED ✓' };
            case 'REVOKED': return { bg: 'bg-amber-50', border: 'border-amber-200', icon: <AlertTriangle className="text-amber-600" size={32} />, color: 'text-amber-700', badge: 'bg-amber-100 text-amber-700', label: 'REVOKED' };
            default: return { bg: 'bg-rose-50', border: 'border-rose-200', icon: <ShieldAlert className="text-rose-600" size={32} />, color: 'text-rose-700', badge: 'bg-rose-100 text-rose-700', label: 'INVALID' };
        }
    };

    return (
        <div className={`max-w-4xl mx-auto px-4 ${isEmbedded ? '' : 'mt-24 mb-12'}`}>
            <div className="flex justify-end mb-4">
                <select 
                    className="bg-white border border-gray-200 text-sm font-bold text-gray-700 py-2 px-4 rounded-xl shadow-sm focus:ring-2 focus:ring-brand-500 outline-none"
                    value={i18n.language}
                    onChange={(e) => i18n.changeLanguage(e.target.value)}
                >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                </select>
            </div>

            {!isEmbedded && (
                <div className="text-center mb-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="px-4 py-1.5 bg-brand-50 text-brand-600 rounded-full text-xs font-black uppercase tracking-widest ring-1 ring-brand-100 mb-4 inline-block">Public Verification Engine</span>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">{t('verify.title')}</h1>
                        <p className="text-gray-500 font-medium max-w-xl mx-auto">{t('verify.subtitle')}</p>
                    </motion.div>
                </div>
            )}
            
            {isEmbedded && (
                <div className="text-center mb-12">
                   <h2 className="text-3xl font-bold text-gray-900 mb-4">Verify a Credential Now</h2>
                   <p className="text-gray-600">Enter the UUID below. Our engine will cross-check the blockchain hash instantly.</p>
                </div>
            )}

            <div className="bg-brand-50/50 p-6 rounded-3xl border border-brand-100 mb-8 flex items-start gap-4">
                <div className="p-2 bg-brand-600 text-white rounded-xl">
                    <ShieldCheck size={20} />
                </div>
                <div>
                    <h4 className="font-bold text-brand-900 leading-none mb-2">How to find the ID?</h4>
                    <p className="text-sm text-brand-700/70 font-medium leading-relaxed">
                        The Certificate UUID is a unique 36-character code found on your digital or printed certificate. You can also scan the QR code to be redirected here automatically.
                    </p>
                </div>
            </div>

            <form onSubmit={handleVerify} className="relative mb-8 shadow-lg group">
                <input
                    type="text"
                    placeholder={t('verify.inputPlaceholder')}
                    className="w-full pl-6 pr-32 py-4 text-lg border-2 border-gray-200 rounded-full focus:border-brand-500 focus:outline-none transition"
                    value={certId}
                    onChange={(e) => setCertId(e.target.value)}
                />
                <button
                    type="submit" disabled={loading}
                    className="absolute right-2 top-2 bottom-2 px-6 bg-gray-900 text-white rounded-full font-semibold hover:bg-brand-600 disabled:opacity-50 flex items-center gap-2 transition"
                >
                    <Search size={20} />
                    {loading ? t('verify.verifying') : t('verify.verifyButton')}
                </button>
            </form>

            <AnimatePresence>
            {result && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    {/* Status Banner */}
                    {(() => {
                        const sc = getStatusConfig(result.status);
                        return (
                            <div className={`${sc.bg} ${sc.border} border-2 rounded-3xl p-6 mb-6`}>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white rounded-2xl shadow-sm">{sc.icon}</div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${sc.badge}`}>{sc.label}</span>
                                        </div>
                                        <p className={`text-lg font-bold ${sc.color}`}>{result.message || `Status: ${result.status}`}</p>
                                    </div>
                                    {result.status === 'SUCCESS' && (
                                        <div className="flex gap-2">
                                            <button onClick={handleCopyLink} className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition text-gray-600 hover:text-brand-600" title="Copy verification link">
                                                {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                                            </button>
                                            <button onClick={handleDownloadPDF} className="flex items-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-brand-600 transition shadow-sm">
                                                <Download size={18} /> Download PDF
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })()}

                    {/* Revocation Audit Trail */}
                    {result.status === 'REVOKED' && result.data && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-3xl border-2 border-amber-200 shadow-sm overflow-hidden">
                                <div className="bg-amber-600 p-6 text-white">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/20 rounded-xl">
                                            <AlertTriangle size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest font-bold opacity-80">Revocation Audit Record</p>
                                            <p className="text-xl font-black">Certificate Has Been Revoked</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 space-y-6">
                                    <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
                                        <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-2">Revocation Reason</p>
                                        <p className="text-amber-900 font-bold text-lg">{result.data.revocation_reason || 'No reason provided'}</p>
                                        {result.data.revoked_at && (
                                            <p className="text-xs text-amber-600 font-medium mt-2">
                                                Revoked on {new Date(result.data.revoked_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        )}
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <DetailItem icon={<Building2 size={18} />} label="Issuing Institution" value={result.data.institution_name} />
                                        <DetailItem icon={<User size={18} />} label="Recipient" value={result.data.student_name} />
                                        <DetailItem icon={<GraduationCap size={18} />} label="Course" value={result.data.course_name} />
                                        <DetailItem icon={<Calendar size={18} />} label="Originally Issued" value={new Date(result.data.issue_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
                                    </div>
                                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Certificate ID</p>
                                        <p className="font-mono text-xs text-gray-600 break-all">{result.data.id}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Certificate Details */}
                    {result.status === 'SUCCESS' && result.data && (
                        <div className="space-y-6">
                            {/* Main Info Card */}
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                                {/* Header */}
                                <div className="bg-gray-900 p-6 text-white">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-white/10 rounded-xl">
                                            <Building2 size={20} className="text-brand-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Issuing Institution</p>
                                            <p className="text-xl font-black">{result.data.institution_name}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Details Grid */}
                                <div className="p-8">
                                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                                        <DetailItem icon={<User size={18} />} label="Recipient Name" value={result.data.student_name} />
                                        <DetailItem icon={<GraduationCap size={18} />} label="Course / Qualification" value={result.data.course_name} />
                                        <DetailItem icon={<Calendar size={18} />} label="Date of Issuance" value={new Date(result.data.issue_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
                                        <DetailItem icon={<FileCheck2 size={18} />} label="Certificate ID" value={result.data.id} mono />
                                    </div>

                                    {/* Blockchain Section */}
                                    <div className="bg-gray-50 rounded-2xl p-6 space-y-4 border border-gray-100">
                                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                            <Fingerprint size={14} className="text-brand-500" /> Blockchain Proof
                                        </h3>
                                        <div className="space-y-3">
                                            <HashRow label="SHA-256 Certificate Hash" value={result.data.cert_hash} />
                                            <HashRow label="Blockchain Transaction Hash" value={result.data.tx_hash} />
                                            {result.data.block_number && (
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest w-48 shrink-0">Block Number</span>
                                                    <span className="font-mono text-sm text-gray-700 bg-white px-3 py-1.5 rounded-lg border border-gray-100">#{result.data.block_number}</span>
                                                </div>
                                            )}
                                            {result.blockchain?.timestamp && (
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest w-48 shrink-0">On-Chain Timestamp</span>
                                                    <span className="font-mono text-sm text-gray-700 bg-white px-3 py-1.5 rounded-lg border border-gray-100">
                                                        {new Date(result.blockchain.timestamp * 1000).toLocaleString()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Verification Confidence */}
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                                <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <ShieldCheck size={14} className="text-emerald-500" /> Verification Confidence
                                </h3>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <ConfidenceItem icon={<Hash size={18} />} title="Hash Integrity" desc="SHA-256 hash recalculated and matched" status="pass" />
                                    <ConfidenceItem icon={<Link2 size={18} />} title="Blockchain Anchored" desc="Record verified on-chain via smart contract" status="pass" />
                                    <ConfidenceItem icon={<Globe size={18} />} title="Institution Verified" desc={`Issued by ${result.data.institution_name}`} status="pass" />
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="flex flex-wrap gap-3">
                                <button onClick={handleDownloadPDF} className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-brand-600 transition shadow-lg shadow-gray-200">
                                    <Download size={18} /> Download Certificate PDF
                                </button>
                                <button onClick={handleCopyLink} className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-2xl font-bold text-sm border border-gray-200 hover:bg-gray-50 transition">
                                    {copied ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Link2 size={18} />} 
                                    {copied ? 'Copied!' : 'Copy Verification Link'}
                                </button>
                                <a href={`/tamper-lab?cert=${result.data.id}`} className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-2xl font-bold text-sm border border-gray-200 hover:bg-gray-50 transition">
                                    <ExternalLink size={18} /> Test in Tamper Lab
                                </a>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}
            </AnimatePresence>
        </div>
    );
}

function DetailItem({ icon, label, value, mono = false }: { icon: any; label: string; value: string; mono?: boolean }) {
    return (
        <div className="flex items-start gap-3">
            <div className="p-2 bg-brand-50 text-brand-600 rounded-xl mt-0.5">{icon}</div>
            <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">{label}</p>
                <p className={`text-gray-900 font-bold ${mono ? 'font-mono text-xs break-all' : 'text-lg'}`}>{value}</p>
            </div>
        </div>
    );
}

function HashRow({ label, value }: { label: string; value: string }) {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest w-48 shrink-0 pt-1.5">{label}</span>
            <span className="font-mono text-xs text-gray-600 bg-white px-3 py-1.5 rounded-lg break-all border border-gray-100 flex-1">{value}</span>
        </div>
    );
}

function ConfidenceItem({ icon, title, desc, status }: { icon: any; title: string; desc: string; status: 'pass' | 'fail' }) {
    return (
        <div className={`p-4 rounded-2xl border ${status === 'pass' ? 'bg-emerald-50/50 border-emerald-100' : 'bg-rose-50/50 border-rose-100'}`}>
            <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-lg ${status === 'pass' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>{icon}</div>
                <span className="font-bold text-sm text-gray-900">{title}</span>
                <CheckCircle2 size={14} className={status === 'pass' ? 'text-emerald-500 ml-auto' : 'text-rose-500 ml-auto'} />
            </div>
            <p className="text-xs text-gray-500 font-medium">{desc}</p>
        </div>
    );
}
