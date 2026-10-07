import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation, Link, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { blogPosts } from '../blogData';
import shubhangiImg from '../assets/shubhangi.png';
import krishnaImg from '../assets/krishna.png';
import vrushaliImg from '../assets/vrushali.png';
import { serviceData, courseDetails, baseCourses, additionalCourses, FREE_NOTES } from '../data';
import AnimatedSection from '../components/AnimatedSection';
import { toast } from '../utils/notification';

const LoginPageSection = () => {
  const [view, setView] = React.useState('login'); // 'login', 'signup'
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState('');



  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // For phone/email handling we can check if email includes @
    // Assuming email/password standard login
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      // Check if admin
      const isSuperAdmin = email === 'admin@asmaonline.in';
      const { data: adminData } = await supabase
        .from('admins')
        .select('email')
        .eq('email', email)
        .single();
        
      if (isSuperAdmin || adminData) {
        window.location.href = '/admin/courses';
      } else {
        toast.success('Login Successful! Welcome to Advait Academy.');
        window.location.href = '/dashboard';
      }
    }
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      if (data && data.user) {
        // Insert pending enrollment
        await supabase.from('enrollments').insert({
          auth_user_id: data.user.id,
          email: email,
          student_name: fullName || email.split('@')[0],
          phone: phone,
          status: 'pending',
          course_name: 'General Registration'
        });
      }
      toast.success('Registration successful! Your request is pending admin approval. You can log in to check your status.');
      setView('login');
    }
  };

  return (
    <AnimatedSection className="py-20 min-h-[80vh] flex items-center justify-center relative bg-bg-secondary/10 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-accent-primary/10 rounded-full blur-[100px] mix-blend-multiply animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent-secondary/10 rounded-full blur-[120px] mix-blend-multiply animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute inset-0 bg-[radial-gradient(#115234_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03]"></div>

      <div className="container mx-auto px-4 relative z-10 flex justify-center">
        <div className="w-full max-w-md bg-white rounded-[32px] p-8 md:p-12 shadow-2xl border border-text-primary/5 group relative overflow-hidden transition-all duration-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/5 rounded-full blur-[30px] group-hover:bg-accent-primary/10 transition-colors duration-700"></div>
          
          <div className="text-center mb-8 relative z-10">
            <div className="inline-block px-4 py-1.5 rounded-full bg-accent-primary/10 text-accent-primary font-bold tracking-widest uppercase text-[10px] mb-4">
              {view === 'login' ? 'Welcome Back' : 'Join Us'}
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary">
              {view === 'login' ? 'User Login' : 'Create Account'}
            </h2>
            {error && <div className="mt-4 text-xs font-bold text-red-500 bg-red-50 py-2 rounded-lg border border-red-100 animate-pulse">{error}</div>}
          </div>

          {view === 'login' && (
            <form className="space-y-6 relative z-10" onSubmit={handleLogin}>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider ml-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary/50">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email" 
                    className="w-full pl-11 pr-4 py-3 bg-bg-secondary/50 border border-text-primary/10 rounded-xl focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/50 transition-all text-sm font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Password</label>
                  <a href="#" className="text-xs font-bold text-accent-primary hover:text-text-primary transition-colors">Forgot?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary/50">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password" 
                    className="w-full pl-11 pr-12 py-3 bg-bg-secondary/50 border border-text-primary/10 rounded-xl focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/50 transition-all text-sm font-medium"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-secondary hover:text-accent-primary transition-colors focus:outline-none"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={loading}
                  className={`w-full py-4 bg-text-primary text-bg-primary font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-accent-primary transition-all shadow-lg shadow-text-primary/10 flex items-center justify-center gap-2 group/btn ${loading ? 'opacity-70 cursor-wait' : ''}`}
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                  {!loading && <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
                </button>
              </div>

              <div className="mt-8 text-center text-sm font-medium text-text-secondary">
                Don't have an account? <button type="button" onClick={() => setView('signup')} className="text-accent-primary font-bold hover:underline ml-1">Sign up</button>
              </div>
            </form>
          )}

          {view === 'signup' && (
            <div className="space-y-6 relative z-10 animate-fadeInUp">
              <form onSubmit={handleEmailSignup} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider ml-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary/50">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name" 
                      className="w-full pl-11 pr-4 py-3 bg-bg-secondary/50 border border-text-primary/10 rounded-xl focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/50 transition-all text-sm font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider ml-1">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary/50">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email" 
                      className="w-full pl-11 pr-4 py-3 bg-bg-secondary/50 border border-text-primary/10 rounded-xl focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/50 transition-all text-sm font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider ml-1">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary/50">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    </div>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone number" 
                      className="w-full pl-11 pr-4 py-3 bg-bg-secondary/50 border border-text-primary/10 rounded-xl focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/50 transition-all text-sm font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider ml-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary/50">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password" 
                      className="w-full pl-11 pr-12 py-3 bg-bg-secondary/50 border border-text-primary/10 rounded-xl focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/50 transition-all text-sm font-medium"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-secondary hover:text-accent-primary transition-colors focus:outline-none"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className={`w-full py-3.5 bg-text-primary text-bg-primary font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-accent-primary transition-all shadow-lg shadow-text-primary/10 ${loading ? 'opacity-70 cursor-wait' : ''}`}
                  >
                    {loading ? 'Signing Up...' : 'Sign Up with Email'}
                  </button>
                </div>
              </form>



              <div className="mt-8 text-center text-sm font-medium text-text-secondary border-t border-gray-100 pt-6">
                Already have an account? <button type="button" onClick={() => setView('login')} className="text-accent-primary font-bold hover:underline ml-1">Log in</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </AnimatedSection>
  );
};

export default LoginPageSection;