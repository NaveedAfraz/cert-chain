import React from 'react';
import { Hexagon, Lock, Zap, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-dark-900 text-gray-400 py-12 mt-auto border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
        
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <Hexagon size={24} className="text-brand-500 fill-brand-900" />
            <span className="text-xl font-bold text-white tracking-tight">CertChain</span>
          </div>
          <p className="text-sm leading-relaxed mb-6">
            {t('footer.description')}
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">{t('footer.protocol')}</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-brand-400 transition">Smart Contract</a></li>
            <li><a href="#" className="hover:text-brand-400 transition">Consensus Mechanism</a></li>
            <li><a href="#" className="hover:text-brand-400 transition">Whitepaper</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-4">{t('footer.resources')}</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/about" className="hover:text-brand-400 transition">About the Project</a></li>
            <li><a href="#" className="hover:text-brand-400 transition">Developer API</a></li>
            <li><a href="#" className="hover:text-brand-400 transition">FAQ</a></li>
          </ul>
        </div>

        <div>
           <h4 className="text-white font-semibold mb-4">{t('footer.metrics')}</h4>
           <div className="space-y-3">
             <div className="flex items-center gap-3 text-sm">
               <Lock size={16} className="text-brand-500" /> AES-256 Encryption
             </div>
             <div className="flex items-center gap-3 text-sm">
               <Zap size={16} className="text-brand-500" /> &lt;2s Verification Time
             </div>
             <div className="flex items-center gap-3 text-sm">
               <BookOpen size={16} className="text-brand-500" /> Public Ledger Audit
             </div>
           </div>
        </div>

     
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-gray-800 text-sm text-center">
        &copy; {new Date().getFullYear()} {t('footer.copyright')}
      </div>
    </footer>
  );
}
