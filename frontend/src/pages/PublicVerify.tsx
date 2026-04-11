import React, { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Search, ShieldCheck, ShieldAlert, AlertTriangle, Building2 } from 'lucide-react';

export default function PublicVerify({ isEmbedded = false }: { isEmbedded?: boolean }) {
    const [certId, setCertId] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Extract UUID if a full URL was pasted
        let sanitizedId = certId.trim();
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

    return (
        <div className={`max-w-3xl mx-auto px-4 ${isEmbedded ? '' : 'mt-24 mb-12'}`}>
            {!isEmbedded && (
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Blockchain Public Verification Portal</h1>
                    <p className="text-gray-600">Enter a certificate ID below to cryptographically verify its authenticity against the immutable blockchain ledger.</p>
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
                    placeholder="Enter Certificate UUID..."
                    className="w-full pl-6 pr-32 py-4 text-lg border-2 border-gray-200 rounded-full focus:border-primary-500 focus:outline-none transition"
                    value={certId}
                    onChange={(e) => setCertId(e.target.value)}
                />
                <button
                    type="submit" disabled={loading}
                    className="absolute right-2 top-2 bottom-2 px-6 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2 transition"
                >
                    <Search size={20} />
                    {loading ? 'Checking...' : 'Verify'}
                </button>
            </form>

            {result && (
                <div className={`p-8 rounded-2xl border-2 ${
                    result.status === 'SUCCESS' ? 'bg-green-50 border-green-200' :
                    result.status === 'REVOKED' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-red-50 border-red-200'
                }`}>
                    <div className="flex items-center gap-4 mb-6">
                        {result.status === 'SUCCESS' && <ShieldCheck className="text-green-600 w-12 h-12" />}
                        {result.status === 'REVOKED' && <AlertTriangle className="text-yellow-600 w-12 h-12" />}
                        {(result.status === 'TAMPERED' || result.status === 'FAILED' || result.status === 'INVALID') && <ShieldAlert className="text-red-600 w-12 h-12" />}
                        <div>
                            <h2 className={`text-2xl font-bold ${
                                result.status === 'SUCCESS' ? 'text-green-800' :
                                result.status === 'REVOKED' ? 'text-yellow-800' : 'text-red-800'
                            }`}>
                                {result.message}
                            </h2>
                            <p className="text-sm opacity-80 mt-1">Status Code: {result.status}</p>
                        </div>
                    </div>

                    {result.status === 'SUCCESS' && result.data && (
                        <div className="bg-white p-6 rounded-xl space-y-4 shadow-sm">
                            <div className="mb-4 pb-4 border-b border-gray-100 flex items-center gap-3">
                                <div className="p-2 bg-brand-50 rounded text-brand-600">
                                    <Building2 size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Issued By</p>
                                    <p className="font-bold text-gray-900">{result.data.institution_name}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Recipient Name</p>
                                    <p className="font-semibold text-lg">{result.data.student_name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Course / Qualification</p>
                                    <p className="font-semibold text-lg">{result.data.course_name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Issue Date</p>
                                    <p className="font-medium text-gray-800">{new Date(result.data.issue_date).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Certificate ID</p>
                                    <p className="font-mono text-sm break-all">{result.data.id}</p>
                                </div>
                            </div>
                            <div className="pt-4 mt-4 border-t border-gray-100">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Blockchain Transaction Hash</p>
                                <p className="font-mono text-xs text-gray-600 break-all bg-gray-50 p-2 rounded">{result.data.tx_hash}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
