'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Hash, Lock, Save, ArrowLeft, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { changePasswordPublic } from '@/actions/auth-actions';

export default function PublicChangePasswordPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    memberId: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPass, setShowPass] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  const handleChange = (e: any) => {
    if (e.target.name === 'memberId') {
        setFormData({ ...formData, [e.target.name]: e.target.value.replace(/\D/g, '') });
    } else {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: '', msg: '' });

    if (formData.newPassword !== formData.confirmPassword) {
        setStatus({ type: 'error', msg: 'Password baru tidak cocok!' });
        return;
    }
    if (formData.newPassword.length < 6) {
        setStatus({ type: 'error', msg: 'Password minimal 6 karakter.' });
        return;
    }

    setIsSubmitting(true);
    try {
        const result = await changePasswordPublic(formData.memberId, formData.oldPassword, formData.newPassword);
        
        if (result.success) {
            setStatus({ type: 'success', msg: result.message || 'Success!' });
            setTimeout(() => router.push('/login'), 2000);
        } else {
            setStatus({ type: 'error', msg: result.message || 'Gagal.' });
        }
    } catch (error) {
        setStatus({ type: 'error', msg: 'Terjadi kesalahan sistem.' });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0C101C] flex items-center justify-center relative overflow-hidden selection:bg-[#E7B95A] selection:text-[#0C101C] px-4">
      
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#E7B95A]/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-[#151b2b] border border-white/5 rounded-3xl p-8 shadow-2xl relative z-10"
      >
          <div className="mb-8">
              <Link href="/login" className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors mb-4">
                  <ArrowLeft size={14} /> Back to Login
              </Link>
              <h1 className="text-2xl font-bold text-white mb-2">Update Password</h1>
              <p className="text-gray-400 text-xs">
                Secure your account by updating your default credentials.
              </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase mb-1.5 block">IEEE Member ID</label>
                  <div className="relative">
                      <Hash size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input 
                          type="text" 
                          name="memberId"
                          value={formData.memberId}
                          onChange={handleChange}
                          className="w-full bg-[#0C101C] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-[#E7B95A] outline-none text-sm font-mono"
                          placeholder="Ex: 10200..."
                          required
                      />
                  </div>
              </div>

              <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase mb-1.5 block">Old Password (Default: Member ID)</label>
                  <div className="relative">
                      <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input 
                          type={showPass ? "text" : "password"}
                          name="oldPassword"
                          value={formData.oldPassword}
                          onChange={handleChange}
                          className="w-full bg-[#0C101C] border border-white/10 rounded-xl py-3 pl-10 pr-10 text-white focus:border-[#E7B95A] outline-none text-sm"
                          placeholder="Enter current password"
                          required
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                         {showPass ? <EyeOff size={14}/> : <Eye size={14}/>}
                      </button>
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                  <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase mb-1.5 block">New Password</label>
                      <input 
                          type="password" name="newPassword" value={formData.newPassword} onChange={handleChange}
                          className="w-full bg-[#0C101C] border border-white/10 rounded-xl p-3 text-white focus:border-[#E7B95A] outline-none text-sm"
                          placeholder="Min. 6 chars" required
                      />
                  </div>
                  <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase mb-1.5 block">Confirm</label>
                      <input 
                          type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                          className="w-full bg-[#0C101C] border border-white/10 rounded-xl p-3 text-white focus:border-[#E7B95A] outline-none text-sm"
                          placeholder="Retype password" required
                      />
                  </div>
              </div>

              {status.msg && (
                <div className={`text-xs p-3 rounded-lg flex items-center gap-2 ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                   {status.type === 'success' ? <CheckCircle size={14}/> : <AlertCircle size={14}/>}
                   {status.msg}
                </div>
              )}

              <button 
                  type="submit" disabled={isSubmitting}
                  className="w-full py-3 rounded-xl font-bold text-sm bg-[#E7B95A] text-[#0C101C] hover:bg-[#F4D03F] transition-all shadow-lg mt-2 flex justify-center gap-2 items-center"
              >
                  {isSubmitting ? "Updating..." : <><Save size={16} /> Update Password</>}
              </button>

          </form>
      </motion.div>
    </main>
  );
}