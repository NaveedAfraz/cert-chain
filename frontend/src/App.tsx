import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import PublicVerify from './pages/PublicVerify';
import StudentDashboard from './pages/StudentDashboard';
import Pricing from './pages/Pricing';
import IssueCertificate from './pages/IssueCertificate';
import CertificateList from './pages/CertificateList';
import CertificateDetails from './pages/CertificateDetails';
import Settings from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col relative selection:bg-brand-300 selection:text-brand-900 overflow-x-hidden">
          <Toaster 
            position="top-right" 
            toastOptions={{
              className: 'font-medium shadow-xl rounded-2xl border border-gray-100',
              style: { backdropFilter: 'blur(10px)', background: 'rgba(255,255,255,0.9)' },
              success: { iconTheme: { primary: '#14b8a6', secondary: '#fff' } }
            }} 
          />
          <Navbar />
          
          <main className="flex-1 w-full pt-20 relative z-10 flex flex-col">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/verify" element={<PublicVerify />} />
              <Route path="/verify/:certificateId" element={<PublicVerify />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/pricing" element={<Pricing />} />
              
              {/* Institution Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/issue" element={<IssueCertificate />} />
              <Route path="/admin/certificates" element={<CertificateList />} />
              <Route path="/admin/certificates/:id" element={<CertificateDetails />} />
              <Route path="/admin/settings" element={<Settings />} />

              <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
              <Route path="/student/dashboard" element={<StudentDashboard />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
