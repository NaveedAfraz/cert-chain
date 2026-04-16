import React from 'react';
import { motion } from 'framer-motion';
import { Hexagon, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();
  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <Hexagon size={48} className="text-brand-500 mx-auto mb-6" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">{t('about.title')}</h1>
        <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
          {t('about.subtitle')}
        </p>
      </motion.div>

      <div className="space-y-12">
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('about.howItWorks')}</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            {t('about.howItWorksDesc')}
          </p>
          <ul className="space-y-4">
             {[t('about.point1'), t('about.point2'), t('about.point3')].map((point, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700">
                    <CheckCircle2 size={20} className="text-brand-500 min-w-5 shrink-0" />
                    <span>{point}</span>
                </li>
             ))}
          </ul>
        </section>

        <section className="bg-dark-900 text-white p-8 rounded-3xl shadow-xl">
          <h2 className="text-2xl font-bold mb-4">{t('about.techStack')}</h2>
          <div className="grid md:grid-cols-2 gap-8 mt-6">
             <div>
               <h3 className="text-brand-400 font-semibold mb-2">Smart Contracts</h3>
               <p className="text-gray-400 text-sm leading-relaxed">{t('about.smartContractsDesc')}</p>
             </div>
             <div>
               <h3 className="text-brand-400 font-semibold mb-2">RESTful Relayer</h3>
               <p className="text-gray-400 text-sm leading-relaxed">{t('about.relayerDesc')}</p>
             </div>
          </div>
        </section>
      </div>
    </div>
  );
}
