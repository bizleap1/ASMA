import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Helmet } from 'react-helmet-async';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Redirect if already logged in as admin
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const isSuperAdmin = session.user.email === 'admin@asmaonline.in';
        const { data } = await supabase.from('admins').select('email').eq('email', session.user.email).single();
        if (isSuperAdmin || data) {
          navigate('/admin/courses');
        }
      }
    };
    checkUser();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.session) {
        // Verify admin
        const isSuperAdmin = authData.session.user.email === 'admin@asmaonline.in';
        const { data: adminData, error: adminError } = await supabase
          .from('admins')
          .select('email')
          .eq('email', authData.session.user.email)
          .single();

        if (!isSuperAdmin && (adminError || !adminData)) {
          await supabase.auth.signOut();
          throw new Error('Access denied. You do not have admin privileges.');
        }

        navigate('/admin/courses');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf8f5] p-4 font-sans selection:bg-accent-primary/20">
      <Helmet>
        <title>Admin Login - ASMA</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <div className="text-center mb-8 relative z-10">
            <img 
              src="/logo-dark.png" 
              alt="ASMA Logo" 
              className="h-24 w-auto mx-auto object-contain mb-3 drop-shadow-sm" 
              onError={(e) => {
                e.target.src = '/admin-logo.png';
              }} 
            />
            <div style={{ display: 'none' }} className="w-16 h-16 bg-[#0B2117] rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-[#0B2117]/20">
              <span className="text-[#D4AF37] font-bold text-3xl">A</span>
            </div>
            <h1 className="text-2xl font-bold text-text-primary mt-2">ASMA Admin</h1>
            <p className="text-text-secondary mt-2 text-sm font-medium">Sign in to manage the academy</p>
          </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-[#166534] transition-colors"
              placeholder="admin@asmaonline.in"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-[#166534] transition-colors font-medium text-sm"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-700 transition-colors focus:outline-none cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 bg-[#0B2117] hover:bg-[#166534] text-white font-bold rounded-xl shadow-lg transition-all ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
          >
            {loading ? 'Authenticating...' : 'Sign In securely'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
