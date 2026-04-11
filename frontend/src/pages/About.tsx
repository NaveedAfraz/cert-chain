import React from 'react';
import { motion } from 'framer-motion';
import { Hexagon, CheckCircle2 } from 'lucide-react';

export default function About() {
  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <Hexagon size={48} className="text-brand-500 mx-auto mb-6" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">About the Protocol</h1>
        <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
          CertChain was built to solve the $1.2B global credential fraud problem by bridging institutional databases with Web3 immutability.
        </p>
      </motion.div>

      <div className="space-y-12">
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            When an institution issues a certificate, the protocol generates a highly secure SHA-256 hash containing the student's name, their qualification, and the issue date. Rather than storing sensitive student data on public networks, <strong>only this cryptographic hash is written to the blockchain.</strong>
          </p>
          <ul className="space-y-4">
             {['Data stays in secure relational databases.', 'Immutable hash stored on Ethereum nodes.', 'Real-time cryptographic verification.'].map((point, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700">
                    <CheckCircle2 size={20} className="text-brand-500" />
                    <span>{point}</span>
                </li>
             ))}
          </ul>
        </section>

        <section className="bg-dark-900 text-white p-8 rounded-3xl shadow-xl">
          <h2 className="text-2xl font-bold mb-4">Technical Stack</h2>
          <div className="grid md:grid-cols-2 gap-8 mt-6">
             <div>
               <h3 className="text-brand-400 font-semibold mb-2">Smart Contracts</h3>
               <p className="text-gray-400 text-sm leading-relaxed">Written in Solidity and deployed via Hardhat. The contracts act strictly as decentralized ledgers to record mapping truth values.</p>
             </div>
             <div>
               <h3 className="text-brand-400 font-semibold mb-2">RESTful Relayer</h3>
               <p className="text-gray-400 text-sm leading-relaxed">A high-performance Node.js backend leveraging Ethers.js abstracts the blockchain complexity away from the institution.</p>
             </div>
          </div>
        </section>
      </div>
    </div>
  );
}
