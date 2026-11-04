import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { toast } from '../utils/notification';
import SEO from '../components/SEO';

const LoginPageSection = () => {
  const [view, setView] = useState('login'); // 'login', 'signup', 'forgot'
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const rightColRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();

  const easeOut = [0.16, 1, 0.3, 1];

  // Reset scroll to top and clear credentials when switching views
  useEffect(() => {
    if (rightColRef.current) {
      rightColRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
    setEmail('');
    setPassword('');
    setError('');
  }, [view]);

  // If session already exists, redirect to authorized destination
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const isSuperAdmin = session.user.email?.toLowerCase() === 'admin@asmaonline.in';
          const { data: adminData } = await supabase
            .from('admins')
            .select('email')
            .eq('email', session.user.email)
            .single();

          if (isSuperAdmin || adminData) {
            navigate('/admin/courses', { replace: true });
          } else {
            navigate('/dashboard', { replace: true });
          }
        }
      } catch (err) {
        console.error('Session check error:', err);
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');

    const cleanEmail = email.trim();

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password,
      });

      if (authError) {
        setError(authError.message || 'Invalid email or password.');
        setLoading(false);
        return;
      }

      const isSuperAdmin = cleanEmail.toLowerCase() === 'admin@asmaonline.in';
      const { data: adminData } = await supabase
        .from('admins')
        .select('email')
        .eq('email', cleanEmail)
        .single();

      if (isSuperAdmin || adminData) {
        window.location.href = '/admin/courses';
      } else {
        toast.success('Welcome back to Advait Stock Market Academy.');
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError(err?.message || 'An error occurred during authentication.');
      setLoading(false);
    }
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');

    const cleanEmail = email.trim();
    const cleanName = fullName.trim();
    const cleanPhone = phone.trim();

    if (!cleanName) {
      setError('Please enter your full name.');
      return;
    }
    if (!cleanEmail) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!cleanPhone) {
      setError('Please enter your phone number.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: password,
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      // Registration is strictly saved as 'pending' for administrator review
      // Does NOT grant automatic course enrollment or admin privileges
      if (data?.user) {
        await supabase.from('enrollments').insert({
          auth_user_id: data.user.id,
          email: cleanEmail,
          student_name: cleanName,
          phone: cleanPhone,
          status: 'pending',
          course_name: 'General Registration'
        });

        // Sign out temporary session so user must await verified approval
        await supabase.auth.signOut();
      }

      toast.success('Registration request submitted. An administrator will verify and approve your account.');
      setView('login');
      setPassword('');
      setError('');
    } catch (err) {
      setError(err?.message || 'Failed to submit registration request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');
    setResetSent(false);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/login`
      });

      if (resetError) {
        setError(resetError.message);
      } else {
        setResetSent(true);
        toast.success('Password reset instructions sent to your email.');
      }
    } catch (err) {
      setError(err?.message || 'Could not send reset instructions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF9F6] text-[#1A3326] flex flex-col lg:flex-row overflow-x-hidden selection:bg-[#063925]/15 selection:text-[#063925]">
      <SEO
        title="Account Access | ASMA"
        description="Sign in to your Advait Stock Market Academy account or submit a registration request."
        noindex={true}
        path="/login"
      />

      {/* =========================================================================
          DESKTOP LEFT COLUMN (45%): ASMA Brand Identity Panel
          - Clean, premium dark forest green background
          - Official ASMA Logo centered with elegant branding
          ========================================================================= */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[46%] lg:h-screen lg:sticky lg:top-0 relative bg-[#063925] flex-col items-center justify-center p-10 xl:p-14 text-white overflow-hidden shrink-0 selection:bg-[#D4AF37]/30 selection:text-white">
        {/* Subtle Ambient Radial Lighting for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,75,51,0.65)_0%,_rgba(6,57,37,0.95)_60%,_rgba(4,33,21,1)_100%)]" />
        <div className="absolute w-[420px] h-[420px] rounded-full bg-[#126845]/20 blur-3xl pointer-events-none" />

        {/* Center Content: ASMA Logo & Refined Brand Identity */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-sm mx-auto">
          <Link to="/" className="inline-block focus:outline-none transition-transform hover:scale-[1.02] duration-300" aria-label="ASMA Home">
            <img
              src="/logo.png"
              alt="Advait Stock Market Academy"
              className="w-48 sm:w-56 xl:w-64 h-auto object-contain mx-auto mb-6 drop-shadow-[0_12px_28px_rgba(0,0,0,0.4)]"
            />
          </Link>
          <div className="w-12 h-[1.5px] bg-[#D4AF37] mb-4" />
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#D4AF37] font-['Inter'] block mb-1.5">
            ADVAIT STOCK MARKET ACADEMY
          </span>
          <p className="text-sm font-['Manrope'] text-white/85 font-medium leading-relaxed">
            Practical Market Education & Mentorship
          </p>
        </div>
      </div>

      {/* =========================================================================
          RIGHT COLUMN (55% on desktop, 100% on mobile): Editorial Account Form
          - Natural vertical scrolling without top clipping on short laptop viewports
          - Mobile-optimized single-column layout with 20px padding
          ========================================================================= */}
      <div 
        ref={rightColRef}
        className="w-full lg:w-[55%] xl:w-[54%] flex-1 min-h-screen lg:h-screen lg:overflow-y-auto px-5 sm:px-8 md:px-12 lg:px-14 xl:px-16 py-5 sm:py-6 lg:py-8 bg-[#FAF9F6] flex flex-col items-center"
      >
        <div className="w-full max-w-[400px] min-h-full flex-1 flex flex-col justify-between">
          
          {/* Top Header Row with Return Link & Neutral Access Label */}
          <div className="w-full flex items-center justify-between mb-4 sm:mb-5 shrink-0">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4A6356] hover:text-[#063925] font-['Inter'] transition-colors"
            >
              <span>←</span>
              <span>Return to Website</span>
            </Link>
            <span className="text-[11px] uppercase tracking-wider text-[#4A6356]/70 font-['Inter']">
              Account Access
            </span>
          </div>

          {/* Form Content Area */}
          <div className="w-full text-left py-1">
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: easeOut }}
            >
              {/* Original ASMA Logo */}
              <div className="mb-3 sm:mb-4">
                <Link to="/" className="inline-block focus:outline-none" aria-label="ASMA Home">
                  <img
                    src="/logo-dark.png"
                    alt="Advait Stock Market Academy"
                    className="h-11 sm:h-13 w-auto object-contain"
                    onError={(e) => {
                      e.currentTarget.src = '/admin-logo.png';
                    }}
                  />
                </Link>
              </div>

              {/* Heading & Subtitle */}
              <div className="mb-4 sm:mb-5">
                <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#063925] font-['Inter'] block mb-1">
                  ADVAIT STOCK MARKET ACADEMY
                </span>
                <h1 className="text-2xl sm:text-[26px] font-semibold text-[#1A3326] font-['Manrope'] tracking-tight leading-tight mb-1">
                  {view === 'login' && 'Welcome Back.'}
                  {view === 'signup' && 'Create Account.'}
                  {view === 'forgot' && 'Reset Password.'}
                </h1>
                <p className="text-[12.5px] sm:text-[13px] text-[#4A6356] font-['Inter'] leading-relaxed">
                  {view === 'login' && 'Sign in to continue to your account.'}
                  {view === 'signup' && 'Submit your details to request account access. Registrations are reviewed by administrators before access is granted.'}
                  {view === 'forgot' && 'Enter your registered email to receive password reset instructions.'}
                </p>
              </div>

              {/* Error Message Box */}
              {error && (
                <div
                  role="alert"
                  className="mb-3.5 p-2.5 rounded-[4px] bg-red-50 border border-red-200 text-xs text-red-700 font-['Inter'] leading-normal"
                >
                  {error}
                </div>
              )}

              {/* Reset Email Sent Confirmation */}
              {resetSent && view === 'forgot' && (
                <div
                  role="status"
                  className="mb-3.5 p-2.5 rounded-[4px] bg-[#063925]/5 border border-[#063925]/20 text-xs text-[#063925] font-['Inter'] leading-normal"
                >
                  Password reset link has been dispatched to your email address. Please check your inbox and spam folder.
                </div>
              )}

              {/* =============================================================
                  VIEW 1: SIGN IN FORM
                  ============================================================= */}
              {view === 'login' && (
                <form onSubmit={handleLogin} autoComplete="off" className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-['Inter'] font-semibold text-[#1A3326] uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="asma_student_email"
                      id="asma_student_email"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter your registered email"
                      className="w-full min-h-[42px] px-3.5 py-2 bg-white border border-[#063925]/20 rounded-[4px] focus:outline-none focus:border-[#063925] text-xs sm:text-sm font-['Inter'] text-[#1A3326] placeholder-[#4A6356]/60 transition-colors duration-180"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[11px] font-['Inter'] font-semibold text-[#1A3326] uppercase tracking-wider">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setView('forgot');
                          setError('');
                        }}
                        className="text-xs text-[#063925] hover:text-[#D4AF37] font-semibold font-['Inter'] transition-colors cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="asma_student_password"
                        id="asma_student_password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter your password"
                        className="w-full min-h-[42px] px-3.5 py-2 pr-11 bg-white border border-[#063925]/20 rounded-[4px] focus:outline-none focus:border-[#063925] text-xs sm:text-sm font-['Inter'] text-[#1A3326] placeholder-[#4A6356]/60 transition-colors duration-180"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#4A6356] hover:text-[#1A3326] transition-colors cursor-pointer"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full min-h-[42px] py-2.5 bg-[#063925] hover:bg-[#0B2117] text-white font-['Inter'] font-semibold uppercase tracking-wider text-xs rounded-[4px] transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                        loading ? 'opacity-70 cursor-wait' : ''
                      }`}
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Authenticating...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <span className="text-[#D4AF37] font-bold">→</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Footer Switcher */}
                  <div className="pt-2.5 text-center text-xs font-['Inter'] text-[#4A6356]">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setView('signup');
                        setError('');
                      }}
                      className="text-[#063925] hover:text-[#D4AF37] font-semibold underline ml-1 cursor-pointer"
                    >
                      Request registration
                    </button>
                  </div>
                </form>
              )}

              {/* =============================================================
                  VIEW 2: STUDENT REGISTRATION FORM
                  - Compact vertical rhythm for short laptop screens
                  - Explicit password length policy
                  - Pending approval workflow clearly indicated
                  ============================================================= */}
              {view === 'signup' && (
                <form onSubmit={handleEmailSignup} autoComplete="off" className="space-y-2.5">
                  <div>
                    <label className="block text-[10.5px] font-['Inter'] font-semibold text-[#1A3326] uppercase tracking-wider mb-1">
                      Full Name <span className="text-[#EA4335]">*</span>
                    </label>
                    <input
                      type="text"
                      name="asma_signup_name"
                      autoComplete="off"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      placeholder="e.g. Rahul Sharma"
                      className="w-full min-h-[40px] px-3.5 py-1.5 bg-white border border-[#063925]/20 rounded-[4px] focus:outline-none focus:border-[#063925] text-xs sm:text-sm font-['Inter'] text-[#1A3326] placeholder-[#4A6356]/60 transition-colors duration-180"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-['Inter'] font-semibold text-[#1A3326] uppercase tracking-wider mb-1">
                      Email Address <span className="text-[#EA4335]">*</span>
                    </label>
                    <input
                      type="email"
                      name="asma_signup_email"
                      autoComplete="off"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="rahul@example.com"
                      className="w-full min-h-[40px] px-3.5 py-1.5 bg-white border border-[#063925]/20 rounded-[4px] focus:outline-none focus:border-[#063925] text-xs sm:text-sm font-['Inter'] text-[#1A3326] placeholder-[#4A6356]/60 transition-colors duration-180"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-['Inter'] font-semibold text-[#1A3326] uppercase tracking-wider mb-1">
                      Phone Number <span className="text-[#EA4335]">*</span>
                    </label>
                    <input
                      type="tel"
                      name="asma_signup_phone"
                      autoComplete="off"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="+91 98765 43210"
                      className="w-full min-h-[40px] px-3.5 py-1.5 bg-white border border-[#063925]/20 rounded-[4px] focus:outline-none focus:border-[#063925] text-xs sm:text-sm font-['Inter'] text-[#1A3326] placeholder-[#4A6356]/60 transition-colors duration-180"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-['Inter'] font-semibold text-[#1A3326] uppercase tracking-wider mb-1">
                      Create Password <span className="text-[#EA4335]">*</span>
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="asma_signup_password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Minimum 6 characters"
                      className="w-full min-h-[40px] px-3.5 py-1.5 bg-white border border-[#063925]/20 rounded-[4px] focus:outline-none focus:border-[#063925] text-xs sm:text-sm font-['Inter'] text-[#1A3326] placeholder-[#4A6356]/60 transition-colors duration-180"
                    />
                  </div>

                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full min-h-[42px] py-2.5 bg-[#063925] hover:bg-[#0B2117] text-white font-['Inter'] font-semibold uppercase tracking-wider text-xs rounded-[4px] transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                        loading ? 'opacity-70 cursor-wait' : ''
                      }`}
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Submitting Request...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Registration Request</span>
                          <span className="text-[#D4AF37] font-bold">→</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Footer Switcher */}
                  <div className="pt-2.5 text-center text-xs font-['Inter'] text-[#4A6356]">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setView('login');
                        setError('');
                      }}
                      className="text-[#063925] hover:text-[#D4AF37] font-semibold underline ml-1 cursor-pointer"
                    >
                      Sign in to your account
                    </button>
                  </div>
                </form>
              )}

              {/* =============================================================
                  VIEW 3: FORGOT PASSWORD
                  ============================================================= */}
              {view === 'forgot' && (
                <form onSubmit={handleForgotPassword} autoComplete="off" className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-['Inter'] font-semibold text-[#1A3326] uppercase tracking-wider mb-1">
                      Registered Email Address
                    </label>
                    <input
                      type="email"
                      name="asma_reset_email"
                      autoComplete="off"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter your registered email"
                      className="w-full min-h-[44px] px-3.5 py-2 bg-white border border-[#063925]/20 rounded-[4px] focus:outline-none focus:border-[#063925] text-xs sm:text-sm font-['Inter'] text-[#1A3326] placeholder-[#4A6356]/60 transition-colors duration-180"
                    />
                  </div>

                  <div className="pt-1.5">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full min-h-[44px] py-3 bg-[#063925] hover:bg-[#0B2117] text-white font-['Inter'] font-semibold uppercase tracking-wider text-xs rounded-[4px] transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                        loading ? 'opacity-70 cursor-wait' : ''
                      }`}
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Sending Instructions...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Reset Instructions</span>
                          <span className="text-[#D4AF37] font-bold">→</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Footer Switcher */}
                  <div className="pt-3 text-center text-xs font-['Inter'] text-[#4A6356]">
                    Remember your password?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setView('login');
                        setError('');
                      }}
                      className="text-[#063925] hover:text-[#D4AF37] font-semibold underline ml-1 cursor-pointer"
                    >
                      Back to sign in
                    </button>
                  </div>
                </form>
              )}

            </motion.div>
          </div>

          {/* Minimal Clean Footer Note */}
          <div className="w-full pt-4 sm:pt-6 mt-auto text-center lg:text-left shrink-0">
            <p className="text-[11.5px] text-[#4A6356]/75 font-['Inter']">
              Access for authorized students & administrators.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPageSection;