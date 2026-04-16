import React from 'react';
import { motion } from 'framer-motion';
import { Network, FileCheck2, Fingerprint } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PublicVerify from './PublicVerify'; // Import the verification form to sit inside home

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-400/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-sm font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
              {t('home.mainnetActive')}
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-[1.1] mb-6">
              {t('home.titlePrefix')} <br/> <span className="text-gradient">{t('home.titleHighlight')}</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg leading-relaxed">
              {t('home.subtitle')}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <a href="#verify-section" className="bg-gray-900 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-brand-600 transition-all shadow-xl shadow-brand-500/20">
                {t('home.verifyButton')}
              </a>
              <a href="/about" className="bg-white text-gray-800 border border-gray-200 px-8 py-3.5 rounded-full font-semibold hover:bg-gray-50 transition-all">
                {t('home.learnMore')}
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden glass p-2 border border-white border-opacity-50 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-50 via-transparent to-blue-50 opacity-50"></div>
              {/* This is a visual abstract component replacing a generic image */}
              <div className="aspect-video bg-dark-900 rounded-xl relative overflow-hidden flex items-center justify-center p-8">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}></div>
                
                <div className="relative text-center w-full z-10 glass-dark p-6 rounded-2xl">
                   <div className="flex justify-between items-center mb-6">
                     <span className="text-gray-400 text-sm font-mono tracking-widest">TRANSACTION 0xFA92...</span>
                     <div className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></div>
                   </div>
                   <div className="space-y-3">
                     <div className="h-4 bg-gray-800 rounded-full w-full"></div>
                     <div className="h-4 bg-gray-800 rounded-full w-4/5"></div>
                     <div className="h-4 bg-gray-800 rounded-full w-5/6"></div>
                   </div>
                   <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-4">
                     <Fingerprint className="text-brand-400" size={24} />
                     <span className="text-white font-mono text-sm">Valid Signature Verified</span>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Trust CertChain?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">Our protocol guarantees absolute certainty through cryptographic hashing and decentralized verification nodes.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: FileCheck2, title: "Zero Fraud Possible", desc: "Credentials are hashed securely. Any tampering breaks the signature matching the blockchain record." },
              { icon: Network, title: "Decentralized Proof", desc: "No single point of failure. The ledger acts as the ultimate unbiased source of truth for recruiters." },
              { icon: Fingerprint, title: "Privacy First", desc: "Only hashes are stored on-chain. Sensitive student data stays safely within the institutional database." }
            ].map((ft, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-xl hover:shadow-brand-500/5 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center mb-6">
                  <ft.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{ft.title}</h3>
                <p className="text-gray-600 leading-relaxed">{ft.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Embedded Verification Section */}
      <section id="verify-section" className="py-24 bg-gray-50 border-t border-gray-200">
         <div className="max-w-7xl mx-auto">
            {/* The Verification logic component */}
            <PublicVerify isEmbedded={true} />
         </div>
      </section>

    </div>
  );
}
