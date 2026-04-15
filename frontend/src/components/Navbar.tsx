import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Hexagon, LogOut, LayoutDashboard, ShieldCheck, PlusSquare, ListChecks, Settings, Globe, ChevronDown, User as UserIcon, Menu, X, Building2 } from 'lucide-react';

export default function Navbar() {
  const { logout, isAuthenticated, isAdmin, user, canManageSettings, isStaff } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/');
  };

  const getDashboardRoute = () => {
    if (user?.role === 'SUPER_ADMIN') return '/super-admin/dashboard';
    if (user?.role === 'INSTITUTION_ADMIN' || user?.role === 'INSTITUTION_STAFF') return '/admin/dashboard';
    return '/student/dashboard';
  };

  return (
    <>
    <nav className="fixed w-full z-50 glass shadow-sm border-b border-gray-200/50">
      <div className="max-w-[90rem] w-full mx-auto px-4 md:px-6 h-20 flex justify-between items-center">
        
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-brand-600 text-white p-2 rounded-xl shadow-lg shadow-brand-600/20 group-hover:scale-105 transition-transform">
            <Hexagon size={24} className="fill-brand-100" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-gray-900">
            Cert<span className="text-brand-600">Chain</span>
          </span>
        </Link>
        </div>

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
              {user?.institutionSlug && (
                <NavLink to={`/institution/${user.institutionSlug}`} icon={<Building2 size={18} />} label="Public Profile" current={location.pathname} />
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
              <NavLink to="/institutions" label="Institutions" current={location.pathname} />
              <NavLink to="/verify" label="Public Verifier" current={location.pathname} />
              <NavLink to="/tamper-lab" label="Tamper Lab" current={location.pathname} />
              <NavLink to="/pricing" label="SaaS Pricing" current={location.pathname} />
            </>
          )}
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 bg-white border border-gray-100 p-1.5 pr-4 rounded-full shadow-sm hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-lg uppercase">
                  {user?.name?.charAt(0) || <UserIcon size={18} />}
                </div>
                <div className="hidden sm:flex flex-col items-start mr-1">
                  <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest leading-[1.2] mb-0.5">
                      {isSuperAdmin ? 'Platform Root' : (isStaff ? 'Campus Staff' : 'College Admin')}
                  </span>
                  <span className="text-sm font-bold text-gray-900 leading-[1.2] truncate max-w-[150px]">
                      {(!isSuperAdmin && user?.institutionName) ? user.institutionName : user?.name}
                  </span>
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden"
                  >
                    <div className="p-3 border-b border-gray-100 bg-gray-50/80">
                      <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                      <p className="text-xs font-semibold text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <div className="p-2 space-y-1">
                      <Link 
                        to={getDashboardRoute()}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-brand-50 hover:text-brand-600 rounded-xl transition-colors"
                      >
                        <LayoutDashboard size={18} /> My Dashboard
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left"
                      >
                        <LogOut size={18} /> Sign Out securely
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
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

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 lg:hidden"
            />
            
            {/* Sidebar drawer */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-white shadow-2xl z-50 lg:hidden flex flex-col"
            >
              <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-brand-50 rounded-xl flex items-center justify-center">
                    <Hexagon size={18} className="text-brand-600" />
                  </div>
                  <span className="font-black tracking-tight text-lg text-gray-900">Cert<span className="text-brand-500">Chain</span></span>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-900 rounded-xl hover:bg-white border border-transparent hover:border-gray-200 transition-all shadow-sm shadow-transparent hover:shadow-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
                {/* Mobile Links */}
                {isAuthenticated && isAdmin && !isSuperAdmin && (
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 mb-3">Institution Panel</p>
                    <NavLink to="/admin/dashboard" icon={<LayoutDashboard size={18} />} label="Overview" current={location.pathname} onClick={() => setMobileMenuOpen(false)} />
                    <NavLink to="/admin/issue" icon={<PlusSquare size={18} />} label="Issue Cert" current={location.pathname} onClick={() => setMobileMenuOpen(false)} />
                    <NavLink to="/admin/certificates" icon={<ListChecks size={18} />} label="Records" current={location.pathname} onClick={() => setMobileMenuOpen(false)} />
                    {canManageSettings && (
                      <NavLink to="/admin/settings" icon={<Settings size={18} />} label="Portal Settings" current={location.pathname} onClick={() => setMobileMenuOpen(false)} />
                    )}
                    {user?.institutionSlug && (
                      <NavLink to={`/institution/${user.institutionSlug}`} icon={<Building2 size={18} />} label="Public Profile" current={location.pathname} onClick={() => setMobileMenuOpen(false)} />
                    )}
                  </div>
                )}

                {isAuthenticated && isSuperAdmin && (
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 mb-3">Platform Central</p>
                    <NavLink to="/super-admin/dashboard" icon={<Globe size={18} />} label="Platform Central" current={location.pathname} onClick={() => setMobileMenuOpen(false)} />
                  </div>
                )}

                {!isAuthenticated && (
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 mb-3">Public Portal</p>
                    <NavLink to="/" icon={<Hexagon size={18} />} label="Home" current={location.pathname} onClick={() => setMobileMenuOpen(false)} />
                    <NavLink to="/institutions" icon={<Building2 size={18} />} label="Institutions" current={location.pathname} onClick={() => setMobileMenuOpen(false)} />
                    <NavLink to="/verify" icon={<ShieldCheck size={18} />} label="Public Verifier" current={location.pathname} onClick={() => setMobileMenuOpen(false)} />
                    <NavLink to="/tamper-lab" icon={<LayoutDashboard size={18} />} label="Tamper Lab" current={location.pathname} onClick={() => setMobileMenuOpen(false)} />
                    <NavLink to="/pricing" icon={<LayoutDashboard size={18} />} label="SaaS Pricing" current={location.pathname} onClick={() => setMobileMenuOpen(false)} />
                  </div>
                )}
              </div>

              <div className="px-6 py-6 border-t border-gray-100 bg-gray-50/50">
                {isAuthenticated ? (
                  <button 
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3.5 text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
                  >
                    <LogOut size={18} /> Sign Out Securely
                  </button>
                ) : (
                  <div className="space-y-3">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full flex justify-center py-3.5 text-sm font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:text-brand-600 rounded-xl transition">
                      Log In
                    </Link>
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="w-full flex justify-center py-3.5 text-sm font-bold text-white bg-gray-900 border border-transparent hover:bg-brand-600 rounded-xl transition shadow-xl shadow-brand-500/20">
                      Start Free Trial
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({ to, icon, label, current, onClick }: { to: string, icon?: any, label: string, current: string, onClick?: () => void }) {
  const isActive = current === to;
  return (
    <Link 
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-bold transition ${
        isActive ? 'bg-brand-50 text-brand-700 shadow-sm border border-brand-100' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}
