import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
    ShieldCheck, ShieldAlert, Globe, Hash,  
    ChevronLeft, Share2, Download, AlertCircle, 
      CheckCircle2, History, Award
} from 'lucide-react';
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';

export default function CertificateDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cert, setCert] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [revoking, setRevoking] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const printRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const fetchDetails = async () => {
        try {
            const res = await api.get(`/certificates/details/${id}`);
            setCert(res.data);
        } catch (error) {
            toast.error('Certificate not found or access denied');
            navigate('/admin/certificates');
        } finally {
            setLoading(false);
        }
    };

    const handleRevoke = async () => {
        if (!window.confirm('Are you absolutely sure? Revocation is permanent on the blockchain.')) return;
        
        setRevoking(true);
        try {
            await api.post(`/certificates/revoke/${id}`);
            toast.success('Certificate Revoked on Ledger');
            fetchDetails();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Revocation failed');
        } finally {
            setRevoking(false);
        }
    };

    const downloadPDF = async () => {
        if (!printRef.current) return;
        setDownloading(true);
        const toastId = toast.loading('Generating secure PDF (this may take a few seconds)...');
        try {
            // html-to-image relies on browser-native SVG rendering, entirely bypassing html2canvas oklch parsing errors
            const imgData = await toPng(printRef.current, {
                pixelRatio: 2,
                backgroundColor: '#ffffff'
            });
            const pdf = new jsPDF('landscape', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Certificate_${cert.student_name.replace(/\s+/g, '_')}.pdf`);
            toast.success('Certificate downloaded successfully!', { id: toastId });
        } catch (error) {
            console.error("PDF Export Error:", error);
            toast.error('Failed to generate PDF.', { id: toastId });
        } finally {
            setDownloading(false);
        }
    };

    const handleShare = async () => {
        const url = `${window.location.origin}/verify/${cert.id}`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Verified Certificate',
                    text: `View my verified certificate for ${cert.course_name} from ${cert.institution_name}!`,
                    url: url
                });
            } catch (err) {
                // User cancelled share, completely fine
            }
        } else {
            await navigator.clipboard.writeText(url);
            toast.success('Verification link copied to clipboard!');
        }
    };

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
            {/* Back Nav */}
            <button 
                onClick={() => navigate('/admin/certificates')}
                className="flex items-center gap-2 text-gray-400 hover:text-brand-600 font-bold transition group"
            >
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Records
            </button>

            <div className="grid lg:grid-cols-12 gap-10">
                {/* Profile Card & QR */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-2xl shadow-brand-500/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8">
                            {cert.is_revoked ? (
                                <div className="px-5 py-2 bg-rose-50 text-rose-600 rounded-2xl text-xs font-black uppercase ring-1 ring-rose-100 flex items-center gap-2">
                                    <ShieldAlert size={16} /> Status: Revoked
                                </div>
                            ) : (
                                <div className="px-5 py-2 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-black uppercase ring-1 ring-emerald-100 flex items-center gap-2">
                                    <ShieldCheck size={16} /> Status: Secure
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-sm font-black text-brand-600 uppercase tracking-[0.3em]">Graduate Credential</h2>
                                <button 
                                    onClick={() => { navigator.clipboard.writeText(cert.id); toast.success('ID Copied!'); }}
                                    className="p-2 bg-brand-50 text-brand-600 rounded-lg hover:bg-brand-100 transition flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                                >
                                    <Hash size={12} /> Copy ID
                                </button>
                            </div>
                            <div>
                                <h1 className="text-5xl font-black text-gray-900 tracking-tight">{cert.student_name}</h1>
                                <p className="text-xl text-gray-400 mt-2 font-medium">{cert.student_email}</p>
                            </div>
                            
                            <div className="pt-6 border-t border-gray-50 grid grid-cols-2 gap-8">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Certification Program</p>
                                    <p className="text-lg font-bold text-gray-800">{cert.course_name}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Issue Date</p>
                                    <p className="text-lg font-bold text-gray-800">{new Date(cert.issue_date).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 bg-gray-50 p-8 rounded-[2.5rem] space-y-4">
                            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <History size={16} /> On-chain Audit Trail
                            </h3>
                            <AuditItem icon={<Globe size={18} />} label="Transaction Hash" value={cert.tx_hash} isHash />
                            <AuditItem icon={<Hash size={18} />} label="Block Confirmation" value={cert.block_number} />
                            <AuditItem icon={<CheckCircle2 size={18} />} label="Content Identity" value={cert.cert_hash} isHash />
                        </div>
                    </div>
                </div>

                {/* Sidebar Actions */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-gray-900 p-8 rounded-[2.5rem] flex flex-col items-center text-center shadow-2xl">
                        <div className="bg-white p-4 rounded-3xl shadow-sm mb-6">
                            <img src={cert.qrCode} alt="Security QR" className="w-40 h-40" />
                        </div>
                        <h4 className="text-white font-bold mb-2">Public Verification URL</h4>
                        <p className="text-gray-400 text-xs break-all mb-8 bg-gray-800 p-3 rounded-xl">
                            {`${window.location.origin}/verify/${cert.id}`}
                        </p>
                        <div className="w-full space-y-3">
                            <button 
                                onClick={downloadPDF} disabled={downloading}
                                className="w-full py-4 bg-gray-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-600 transition disabled:opacity-50"
                            >
                                <Download size={18} /> {downloading ? 'Processing...' : 'Download Asset'}
                            </button>
                            <button 
                                onClick={handleShare}
                                className="w-full py-4 bg-white text-gray-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition"
                            >
                                <Share2 size={18} /> Share Proof
                            </button>
                        </div>
                    </div>

                    {!cert.is_revoked && (
                        <div className="bg-rose-50 p-8 rounded-[2.5rem] border border-rose-100 space-y-4">
                            <div className="flex items-center gap-3 text-rose-600">
                                <AlertCircle size={24} />
                                <h4 className="font-black uppercase tracking-widest text-sm">Danger Zone</h4>
                            </div>
                            <p className="text-xs font-semibold text-rose-800/60 leading-relaxed">
                                Revoking this certificate will mark it as invalid on our platform and the public blockchain. This action is irreversible.
                            </p>
                            <button 
                                onClick={handleRevoke}
                                disabled={revoking}
                                className="w-full py-4 bg-rose-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-rose-700 transition disabled:opacity-50"
                            >
                                <ShieldAlert size={18} /> {revoking ? 'Revoking...' : 'Revoke Credential'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Hidden Printable A4 Certificate */}
            <div style={{ position: 'fixed', left: '-5000px', top: '0', zIndex: -1000 }}>
                <div ref={printRef} style={{ width: '1123px', height: '794px', padding: '40px', backgroundColor: '#ffffff', boxSizing: 'border-box', fontFamily: 'sans-serif' }}>
                    
                    {/* Inner Border Core */}
                    <div style={{ width: '100%', height: '100%', padding: '8px', position: 'relative', display: 'flex', flexDirection: 'column', borderColor: '#164e63', borderWidth: '12px', borderStyle: 'solid', boxSizing: 'border-box' }}>
                        <div style={{ width: '100%', height: '100%', padding: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', textAlign: 'center', borderColor: 'rgba(22, 78, 99, 0.5)', borderWidth: '2px', borderStyle: 'solid', backgroundColor: '#f9fafb', boxSizing: 'border-box' }}>
                            
                            {/* Watermark */}
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.03, pointerEvents: 'none' }}>
                                <Award size={500} color="#164e63" />
                            </div>

                            <h1 style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '16px', color: '#164e63', margin: '0 0 16px 0' }}>
                                Certificate of Achievement
                            </h1>
                            
                            <p style={{ fontSize: '18px', fontWeight: '500', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '48px', color: '#6b7280', margin: '0 0 48px 0' }}>
                                This is to successfully certify that
                            </p>
                            
                            <h2 style={{ fontSize: '72px', fontWeight: '900', fontStyle: 'italic', fontFamily: 'Georgia, serif', color: '#111827', margin: '0 0 32px 0' }}>
                                {cert.student_name}
                            </h2>
                            
                            <p style={{ fontSize: '18px', fontWeight: '500', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '32px', color: '#6b7280', margin: '0 0 32px 0' }}>
                                Has successfully completed the requirements for
                            </p>
                            
                            <h3 style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'serif', textAlign: 'center', padding: '0 96px', color: '#0e7490', margin: '0 0 64px 0' }}>
                                {cert.course_name}
                            </h3>
                            
                            {/* Footer Blocks */}
                            <div style={{ position: 'absolute', bottom: '64px', left: '64px', right: '64px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                
                                {/* QR */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div style={{ padding: '8px', backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderStyle: 'solid', borderWidth: '1px', marginBottom: '8px' }}>
                                        <img src={cert.qrCode} alt="QR" style={{ width: '96px', height: '96px' }} />
                                    </div>
                                    <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', margin: 0 }}>Scan to Verify</p>
                                </div>
                                
                                {/* Stamp */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: '384px' }}>
                                    <ShieldCheck size={32} color="#0891b2" style={{ marginBottom: '8px' }} />
                                    <p style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#155e75', margin: '0 0 4px 0' }}>Blockchain Secured</p>
                                    <p style={{ fontSize: '8px', fontFamily: 'monospace', wordBreak: 'break-all', color: '#9ca3af', margin: 0 }}>{cert.cert_hash}</p>
                                </div>
                                
                                {/* Signature */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '192px' }}>
                                    <div style={{ width: '100%', marginBottom: '8px', borderBottomColor: '#9ca3af', borderBottomWidth: '2px', borderBottomStyle: 'solid' }}></div>
                                    <p style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1f2937', margin: 0 }}>{cert.institution_name}</p>
                                    <p style={{ fontSize: '10px', fontWeight: '500', color: '#6b7280', margin: '4px 0 0 0' }}>Authorized Signatory</p>
                                    <p style={{ fontSize: '10px', fontWeight: '500', color: '#6b7280', margin: '8px 0 0 0' }}>Issued: {new Date(cert.issue_date).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

function AuditItem({ icon, label, value, isHash = false }: { icon: any, label: string, value: any, isHash?: boolean }) {
    return (
        <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="text-brand-500 mt-1">{icon}</div>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{label}</p>
                <p className={`text-sm font-bold text-gray-800 break-all pr-4 ${isHash ? 'font-mono' : ''}`}>{value}</p>
            </div>
        </div>
    );
}
