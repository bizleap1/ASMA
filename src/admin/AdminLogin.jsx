import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Helmet } from 'react-helmet-async';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Redirect if already logged in as admin
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase.from('admins').select('email').eq('email', session.user.email).single();
        if (data) {
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
        const { data: adminData, error: adminError } = await supabase
          .from('admins')
          .select('email')
          .eq('email', authData.session.user.email)
          .single();

        if (adminError || !adminData) {
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
          <div className="text-center mb-10 relative z-10">
            <img src="/logo.png" alt="ASMA Logo" className="h-20 w-auto mx-auto object-contain mb-4" onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }} />
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
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-[#166534] transition-colors"
              placeholder="••••••••"
              required
            />
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
