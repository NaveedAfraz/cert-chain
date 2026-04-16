import React from 'react';
import { Check, ArrowRight, Zap, Target, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function Pricing() {
    const { t } = useTranslation();
    return (
        <div className="max-w-7xl mx-auto px-6 py-20 space-y-16">
            <div className="text-center space-y-4">
                <motion.span 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-4 py-1.5 bg-brand-50 text-brand-600 rounded-full text-xs font-black uppercase tracking-widest ring-1 ring-brand-100"
                >
                    {t('pricing.subtitle')}
                </motion.span>
                <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight">
                    {t('pricing.titlePrefix')} <span className="text-brand-600">{t('pricing.titleHighlight')}</span>
                </h1>
                <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto">
                    {t('pricing.desc')}
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <PricingCard 
                    tier="Basic Trial"
                    price="Free"
                    desc="Perfect for small labs or testing environments."
                    icon={<Zap size={24} />}
                    features={['10 Certificates', 'Public Verification Page', 'SHA-256 Hashing', '30 Day Trial']}
                />
                <PricingCard 
                    tier="Professional"
                    price="$499"
                    highlighted
                    desc="Standard for mid-sized colleges and universities."
                    icon={<Target size={24} />}
                    features={['Unlimited Certificates', 'Custom Branded Portal', 'API Access', 'Priority Ledger Sync', 'Advanced Analytics']}
                />
                <PricingCard 
                    tier="Enterprise"
                    price="Custom"
                    desc="Global scale infrastructure for national boards."
                    icon={<ShieldCheck size={24} />}
                    features={['White-label URL', 'Private EVM Network', 'SLA Guarantee', 'Dedicated Node Management']}
                />
            </div>

            <div className="bg-gray-50 p-12 rounded-[3.5rem] border border-gray-100 text-center">
                <h3 className="text-2xl font-black text-gray-900 mb-2">Need a tailored solution?</h3>
                <p className="text-gray-500 font-medium mb-8">We offer custom builds for government bodies and regulatory agencies.</p>
                <button className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-brand-600 transition shadow-xl shadow-gray-200">
                    Contact Protocol Team
                </button>
            </div>
        </div>
    );
}

function PricingCard({ tier, price, desc, features, icon, highlighted = false }: any) {
    return (
        <motion.div 
            whileHover={{ y: -10 }}
            className={`p-10 rounded-[3rem] border-2 flex flex-col h-full relative overflow-hidden transition-all duration-300 ${
                highlighted ? 'border-brand-500 bg-white shadow-2xl shadow-brand-500/10 z-10' : 'border-gray-100 bg-white'
            }`}
        >
            {highlighted && (
                <div className="absolute top-0 right-0 py-1.5 px-6 bg-brand-500 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-3xl">
                    Most Popular
                </div>
            )}
            
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${highlighted ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                {icon}
            </div>

            <h3 className="text-xl font-black text-gray-900 mb-2">{tier}</h3>
            <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-gray-900">{price}</span>
                {price !== 'Free' && price !== 'Custom' && <span className="text-gray-400 font-bold">/mo</span>}
            </div>
            <p className="text-sm text-gray-400 font-medium mb-8 flex-1">{desc}</p>

            <ul className="space-y-4 mb-10">
                {features.map((f: string) => (
                    <li key={f} className="flex items-center gap-3 text-sm font-bold text-gray-600">
                        <div className={`p-1 rounded-full ${highlighted ? 'bg-brand-100 text-brand-600' : 'bg-gray-100 text-gray-400'}`}>
                            <Check size={14} />
                        </div>
                        {f}
                    </li>
                ))}
            </ul>

            <button className={`w-full py-4 rounded-2xl font-black transition flex items-center justify-center gap-2 ${
                highlighted ? 'bg-brand-500 text-white hover:bg-brand-600 shadow-xl shadow-brand-500/20' : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
            }`}>
                Get Started <ArrowRight size={18} />
            </button>
        </motion.div>
    );
}
