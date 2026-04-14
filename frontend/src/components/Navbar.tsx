import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Hexagon, LogOut, LayoutDashboard, ShieldCheck, PlusSquare, ListChecks, Settings, Globe } from 'lucide-react';

export default function Navbar() {
  const { logout, isAuthenticated, isAdmin, user, canManageSettings, isStaff } = useAuth();
  const location = useLocation();

  const isSuperAdmin = user?.isSuperAdmin;

  return (
    <nav className="fixed w-full z-50 glass shadow-sm border-b border-gray-200/50">
      <div className="max-w-[90rem] mx-auto px-6 h-20 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-brand-600 text-white p-2 rounded-xl shadow-lg shadow-brand-600/20 group-hover:scale-105 transition-transform">
            <Hexagon size={24} className="fill-brand-100" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-gray-900">
            Cert<span className="text-brand-600">Chain</span>
          </span>
        </Link>

        {/* Dynamic Navigation Based on Role */}
        <div className="hidden lg:flex items-center gap-2">
          {isAuthenticated && isAdmin && !isSuperAdmin && (
            <>
              <NavLink to="/admin/dashboard" icon={<LayoutDashboard size={18} />} label="Overview" current={location.pathname} />
              <NavLink to="/admin/issue" icon={<PlusSquare size={18} />} label="Issue Cert" current={location.pathname} />
              <NavLink to="/admin/certificates" icon={<ListChecks size={18} />} label="Records" current={location.pathname} />
              {canManageSettings && (
                <NavLink to="/admin/settings" icon={<Settings size={18} />} label="Portal Settings" current={location.pathname} />
              )}
            </>
          )}

          {isAuthenticated && isSuperAdmin && (
            <>
              <NavLink to="/super-admin/dashboard" icon={<Globe size={18} />} label="Platform Central" current={location.pathname} />
            </>
          )}

          {!isAuthenticated && (
            <>
              <NavLink to="/" label="Home" current={location.pathname} />
              <NavLink to="/verify" label="Public Verifier" current={location.pathname} />
              <NavLink to="/pricing" label="SaaS Pricing" current={location.pathname} />
            </>
          )}
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-xs font-black text-brand-600 uppercase tracking-widest">
                    {isSuperAdmin ? 'Platform Root' : (isStaff ? 'Campus Staff' : 'College Admin')}
                </span>
                <span className="text-sm font-bold text-gray-900 line-clamp-1">
                    {(!isSuperAdmin && user?.institutionName) ? user.institutionName : user?.name}
                </span>
              </div>
              <button 
                onClick={logout} 
                className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
               <Link to="/login" className="text-sm font-bold text-gray-600 hover:text-brand-600 transition px-4">Log In</Link>
               <Link 
                to="/signup" 
                className="bg-gray-900 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-brand-600 hover:shadow-xl hover:shadow-brand-600/20 transition-all"
              >
                Start Free Trial
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, icon, label, current }: { to: string, icon?: any, label: string, current: string }) {
  const isActive = current === to;
  return (
    <Link 
      to={to}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition ${
        isActive ? 'bg-brand-50 text-brand-700 shadow-sm border border-brand-100' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}
