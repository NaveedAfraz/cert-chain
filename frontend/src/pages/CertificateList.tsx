import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
    Search, Filter, Eye, ShieldAlert, CheckCircle2,
    AlertCircle, FileText, Download, Hash
} from 'lucide-react';

export default function CertificateList() {
    const [certs, setCerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'REVOKED'>('ALL');

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            const res = await api.get('/certificates/my');
            setCerts(res.data);
        } catch (error) {
            toast.error('Failed to load certificate records');
        } finally {
            setLoading(false);
        }
    };

    const filteredCerts = certs.filter(cert => {
        const matchesSearch =
            cert.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cert.student_email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === 'ALL' ||
            (statusFilter === 'ACTIVE' && !cert.is_revoked) ||
            (statusFilter === 'REVOKED' && cert.is_revoked);

        return matchesSearch && matchesStatus;
    });

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div>
        </div>
    );

    return (
        <div className="max-w-[90rem] mx-auto px-6 py-10 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Governance Vault</h1>
                    <p className="text-gray-500 font-medium">Manage and audit institutional credentials secured on the public ledger.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl flex items-center gap-3">
                        <FileText className="text-brand-500" size={20} />
                        <div>
                            <p className="text-[10px] font-black uppercase text-gray-400">Total Count</p>
                            <p className="font-bold text-gray-800 leading-none">{certs.length}</p>
                        </div>
                    </div>
                    <Link
                        to="/admin/issue"
                        className="bg-gray-900 text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-brand-600 transition shadow-xl shadow-gray-200"
                    >
                        Issue Certificate
                    </Link>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-gray-200 shadow-sm flex flex-col lg:flex-row items-center gap-6">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none font-medium"
                        placeholder="Search by student name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
                    <Filter className="text-gray-400 mr-2 shrink-0" size={20} />
                    <FilterButton active={statusFilter === 'ALL'} onClick={() => setStatusFilter('ALL')} label="All Records" />
                    <FilterButton active={statusFilter === 'ACTIVE'} onClick={() => setStatusFilter('ACTIVE')} label="Active" color="emerald" />
                    <FilterButton active={statusFilter === 'REVOKED'} onClick={() => setStatusFilter('REVOKED')} label="Revoked" color="rose" />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2.5rem] border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Graduate Details</th>
                            <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Program</th>
                            <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Secured Date</th>
                            <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                            <th className="px-8 py-5"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredCerts.map((cert) => (
                            <tr key={cert.id} className="group hover:bg-gray-50/80 transition-colors">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center font-bold">
                                            {cert.student_name[0]}
                                        </div>
                                        <div>
                                            <p className="font-extrabold text-gray-900 line-clamp-1">{cert.student_name}</p>
                                            <p className="text-sm text-gray-400 font-medium">{cert.student_email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="font-bold text-gray-700 text-sm">{cert.course_name}</span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-700">{new Date(cert.issue_date).toLocaleDateString()}</span>
                                        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                                            <Hash size={10} /> {cert.tx_hash.substring(0, 10)}...
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    {cert.is_revoked ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-black uppercase ring-1 ring-rose-100">
                                            <ShieldAlert size={12} /> Revoked
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase ring-1 ring-emerald-100">
                                            <CheckCircle2 size={12} /> Active
                                        </span>
                                    )}
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => { navigator.clipboard.writeText(cert.id); toast.success('ID Copied!'); }}
                                            className="p-2.5 bg-white text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl border border-gray-100 transition shadow-sm"
                                            title="Copy Certificate ID"
                                        >
                                            <Hash size={18} />
                                        </button>
                                        <Link
                                            to={`/admin/certificates/${cert.id}`}
                                            className="p-2.5 bg-white text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl border border-gray-100 transition shadow-sm"
                                            title="View Full Details"
                                        >
                                            <Eye size={18} />
                                        </Link>
                                        <button
                                            onClick={() => {
                                                const link = document.createElement('a');
                                                link.href = cert.qrCode;
                                                link.download = `QR_${cert.student_name.replace(/\s+/g, '_')}_${cert.id.substring(0, 8)}.png`;
                                                link.click();
                                            }}
                                            className="p-2.5 bg-white text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl border border-gray-100 transition shadow-sm"
                                            title="Download QR Code Only"
                                        >
                                            <Download size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredCerts.length === 0 && (
                    <div className="py-20 text-center flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center">
                            <AlertCircle size={32} />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-gray-900">No records found</p>
                            <p className="text-gray-400">Try adjusting your filters or search terms.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function FilterButton({ active, onClick, label, color = 'brand' }: { active: boolean, onClick: any, label: string, color?: string }) {
    const colors: any = {
        brand: active ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 hover:bg-gray-100',
        emerald: active ? 'bg-emerald-600 text-white' : 'bg-white text-gray-500 hover:bg-emerald-50',
        rose: active ? 'bg-rose-600 text-white' : 'bg-white text-gray-500 hover:bg-rose-50',
    };

    return (
        <button
            onClick={onClick}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${colors[color]}`}
        >
            {label}
        </button>
    );
}
