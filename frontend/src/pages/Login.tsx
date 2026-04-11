import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/login', { email, password });
            login(res.data.token, res.data.user);
            toast.success('Welcome back!');
            
            if (res.data.user.role === 'ADMIN') {
                navigate('/admin/dashboard');
            } else if (res.data.user.isSuperAdmin) {
                navigate('/super-admin/dashboard');
            } else {
                navigate('/student/dashboard');
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center py-12 px-6">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full"
            >
                <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-brand-500/10 border border-gray-100">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-50 rounded-2xl text-brand-600 mb-4">
                            <LogIn size={32} />
                        </div>
                        <h1 className="text-3xl font-extrabold text-gray-900">Sign In</h1>
                        <p className="text-gray-500 mt-2">Access your institutional portal</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email" required
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none transition"
                                    placeholder="admin@college.edu"
                                    value={email} onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-semibold text-gray-700">Password</label>
                                <a href="#" className="text-xs font-bold text-brand-600 hover:underline">Forgot?</a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="password" required
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none transition"
                                    placeholder="••••••••"
                                    value={password} onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit" disabled={loading}
                            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-600 transition group disabled:opacity-50 shadow-xl shadow-gray-200"
                        >
                            {loading ? 'Authenticating...' : (
                                <>
                                    Log In <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                        <p className="text-gray-500 text-sm">
                            Need a portal for your college?{' '}
                            <Link to="/signup" className="text-brand-600 font-bold hover:underline">Start Free Trial</Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 bg-gray-50 p-6 rounded-3xl border border-dashed border-gray-200 text-center">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Quick Access Demo</p>
                    <div className="space-y-2 text-sm">
                        <p className="text-gray-600">Super Admin: <span className="font-mono font-bold text-brand-600">admin@certchain.io</span> / <span className="font-mono">admin123</span></p>
                        <p className="text-gray-600">College Admin: <span className="font-mono font-bold text-brand-600">jane@global.edu</span> / <span className="font-mono">college123</span></p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
