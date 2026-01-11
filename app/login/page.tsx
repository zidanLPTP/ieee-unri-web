'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Loader2, ArrowLeft, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { verifyLogin } from '@/actions/auth-actions';

export default function LoginPage() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
        const result = await verifyLogin(name, password);
        
        if (result.success && result.user) {
            localStorage.setItem('adminUser', JSON.stringify({
                name: result.user.name,
                role: result.user.role,
                image: result.user.image
            }));
            router.push('/admin');
        } else {
            setErrorMsg(result.message || 'Login gagal.');
        }
    } catch (error) {
        setErrorMsg('Terjadi kesalahan koneksi.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0C101C] flex items-center justify-center relative overflow-hidden selection:bg-[#E7B95A] selection:text-[#0C101C] px-4">
      
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#3386B7]/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#E7B95A]/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#151b2b] border border-white/5 rounded-3xl p-8 md:p-10 shadow-2xl relative z-10"
      >
          <div className="text-center mb-10">
              <div className="w-12 h-12 bg-[#E7B95A] rounded-xl flex items-center justify-center mx-auto mb-4 text-[#0C101C] font-bold text-xl shadow-lg shadow-yellow-500/20">
                  I
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Member Access</h1>
              <p className="text-gray-400 text-sm">
                Enter your Name and IEEE ID to continue.
              </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
              
              <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 ml-1">Full Name</label>
                  <div className="relative">
                      <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input 
                          type="text" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-[#0C101C] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:border-[#E7B95A] outline-none transition-all placeholder:text-gray-600 text-sm"
                          placeholder="Ex: Fathin Ahmad Zidan"
                          required
                      />
                  </div>
              </div>

              <div className="space-y-2">
                  <div className="flex justify-between ml-1">
                    <label className="text-xs font-semibold text-gray-400">Password / IEEE ID</label>
                  </div>
                  <div className="relative">
                      <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input 
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-[#0C101C] border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white focus:border-[#E7B95A] outline-none transition-all placeholder:text-gray-600 text-sm"
                          placeholder="Default: Your IEEE Member ID"
                          required
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                  </div>
              </div>

              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg flex items-center gap-2 animate-pulse">
                  <AlertCircle size={16} /> {errorMsg}
                </div>
              )}

              <button 
                  type="submit" 
                  disabled={isLoading}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg 
                  ${isLoading 
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-[#0C101C] hover:bg-[#E7B95A] hover:scale-[1.02] active:scale-[0.98]'
                  }`}
              >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : "Verify & Sign In"}
              </button>

              <div className="text-center mt-4">
                  <Link 
                    href="/change-password" 
                    className="text-xs text-gray-500 hover:text-[#E7B95A] transition-colors underline decoration-gray-700 hover:decoration-[#E7B95A]"
                  >
                    Change your password here.
                  </Link>
              </div>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <Link href="/" className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors">
                  <ArrowLeft size={14} /> Back to Homepage
              </Link>
          </div>

      </motion.div>
    </main>
  );
}