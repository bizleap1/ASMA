import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { toast } from '../utils/notification';

const DashboardSection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  // Core Data State
  const [user, setUser] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [notes, setNotes] = useState([]);
  const [accessRequests, setAccessRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // UI State
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'courses' | 'resources' | 'announcements' | 'profile'
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [activeNote, setActiveNote] = useState(null);
  const [requestingItemId, setRequestingItemId] = useState(null);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Check demo mode from URL query or localStorage
  const searchParams = new URLSearchParams(location.search);
  const isUrlDemo = searchParams.get('demo') === 'true' || searchParams.get('demo') === '1';

  // Fetch student session and authorized data
  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      const isLocalStorageDemo = localStorage.getItem('demoStudent') === 'true';
      const isDemo = isUrlDemo || isLocalStorageDemo;

      if (isUrlDemo && !isLocalStorageDemo) {
        localStorage.setItem('demoStudent', 'true');
      }

      const currentUser = session?.user ?? (isDemo ? {
        id: 'demo-student-id',
        email: 'student@advaitacademy.com',
        user_metadata: { full_name: 'Rahul Sharma', phone: '+91 98765 43210' },
        created_at: new Date('2024-01-15').toISOString()
      } : null);

      setUser(currentUser);

      if (!currentUser) {
        setIsLoading(false);
        return;
      }

      // Initialize profile edit state
      setEditName(currentUser.user_metadata?.full_name || '');
      setEditPhone(currentUser.user_metadata?.phone || '');

      // Handle Demo Student Mode (clean preview for verification)
      if (currentUser.id === 'demo-student-id') {
        setEnrollments([{
          id: 'demo-enr-1',
          auth_user_id: 'demo-student-id',
          student_name: 'Rahul Sharma',
          student_email: 'student@advaitacademy.com',
          student_phone: '+91 98765 43210',
          student_id: 'ASMA-2024-042',
          course_id: 'demo-course-1',
          course_name: 'Professional Stock Market Trader Program',
          status: 'approved',
          created_at: '2024-02-01T10:00:00Z',
          courses: {
            title: 'Professional Stock Market Trader Program',
            duration: '3 Months (Weekend & Weekday Batches)',
            mode: 'Classroom & Live Market Sessions',
            category: 'Professional Program',
            description: 'Comprehensive institutional trading curriculum covering technical price action, derivatives strategy, risk management, and live floor execution.'
          },
          notes: JSON.stringify([
            {
              id: 'note-inst-1',
              text: 'Welcome to the Professional Batch! Live trading floor access begins next Monday at 9:15 AM. Please review Module 1 notes before attending.',
              date: '2024-02-05T09:30:00Z',
              pdfUrl: ''
            },
            {
              id: 'note-inst-2',
              text: 'Reminder: Saturday live market case study session starts at 10:00 AM at Nagpur Campus.',
              date: '2024-02-12T11:00:00Z',
              pdfUrl: ''
            }
          ])
        }]);

        // Fetch active notes from database so real admin notes are also available
        const { data: notesData } = await supabase
          .from('notes')
          .select('*, courses(title)')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        setNotes(notesData && notesData.length > 0 ? notesData : [
          {
            id: 'demo-n-1',
            title: 'Price Action & Support-Resistance Architecture',
            description: 'Core concepts of multi-timeframe support/resistance, liquidity sweeps, and price rejection candles.',
            file_type: 'pdf',
            file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            display_order: 1,
            is_active: true
          },
          {
            id: 'demo-n-2',
            title: 'Options Greeks & Risk Management Blueprint',
            description: 'Practical handbook on Delta, Gamma, Theta decay and position sizing for retail derivative traders.',
            file_type: 'pdf',
            file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            display_order: 2,
            is_active: true
          },
          {
            id: 'demo-n-3',
            title: 'NSE Real-Time Trading Terminal Guidelines',
            description: 'Checklist and institutional setup protocol for live market trading hours.',
            file_type: 'link',
            file_url: 'https://www.nseindia.com',
            display_order: 3,
            is_active: true
          }
        ]);

        setAccessRequests([
          { item_id: 'demo-n-1', status: 'approved' },
          { item_id: 'demo-n-2', status: 'pending' }
        ]);

        setIsLoading(false);
        return;
      }

      // 1. Fetch Student Enrollments strictly scoped to current auth user
      const { data: enrollmentData, error: enrollmentError } = await supabase
        .from('enrollments')
        .select('*, courses(*)')
        .eq('auth_user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (enrollmentError) throw enrollmentError;
      setEnrollments(enrollmentData || []);

      const approvedCourses = (enrollmentData || []).filter(e => e.status === 'approved');
      const approvedCourseIds = approvedCourses.map(e => e.course_id).filter(Boolean);
      const isApproved = approvedCourses.length > 0;

      // 2. Fetch Learning Notes only if authorized
      if (isApproved) {
        const { data: notesData, error: notesError } = await supabase
          .from('notes')
          .select('*, courses(title)')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (notesError) throw notesError;

        // Filter notes: general notes (no course_id) or matching an approved course
        const filteredNotes = (notesData || []).filter(note => {
          return !note.course_id || approvedCourseIds.includes(note.course_id);
        });

        setNotes(filteredNotes);
      } else {
        setNotes([]);
      }

      // 3. Fetch Access Requests for this student
      try {
        const { data: reqData } = await supabase
          .from('access_requests')
          .select('*')
          .eq('auth_user_id', currentUser.id);
        setAccessRequests(reqData || []);
      } catch (reqErr) {
        console.warn('Could not fetch access_requests:', reqErr);
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      toast.error('Unable to load dashboard records: ' + (err.message || 'Network error'));
    } finally {
      setIsLoading(false);
    }
  }, [isUrlDemo]);

  useEffect(() => {
    fetchDashboardData();

    // Listen to Supabase auth state transitions
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setEnrollments([]);
        setNotes([]);
      } else if (event === 'SIGNED_IN' && session) {
        fetchDashboardData();
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [fetchDashboardData]);

  // Request Access to a study note
  const handleRequestAccess = async (note) => {
    if (!user) return;
    setRequestingItemId(note.id);
    try {
      const primaryEnrollment = enrollments[0];
      const studentName = user.user_metadata?.full_name || primaryEnrollment?.student_name || user.email.split('@')[0];
      const studentId = primaryEnrollment?.student_id || null;

      if (user.id === 'demo-student-id') {
        setAccessRequests(prev => [
          ...prev.filter(r => r.item_id !== String(note.id)),
          { id: 'demo-req-' + Date.now(), item_id: String(note.id), status: 'pending' }
        ]);
        toast.success(`Access requested for "${note.title}". Faculty review in progress.`);
        setRequestingItemId(null);
        return;
      }

      const { data, error } = await supabase.from('access_requests').insert({
        auth_user_id: user.id,
        student_name: studentName,
        student_email: user.email,
        student_id: studentId,
        item_id: String(note.id),
        item_title: note.title,
        item_type: 'note',
        status: 'pending'
      }).select().single();

      if (error) {
        if (error.code === '42P01') {
          throw new Error("Table 'access_requests' not configured. Please contact academy admin.");
        }
        throw error;
      }

      setAccessRequests(prev => [...prev.filter(r => r.item_id !== String(note.id)), data]);
      toast.success(`Access request submitted for "${note.title}". Access is typically approved within 24 hours.`);
    } catch (err) {
      toast.error('Request failed: ' + err.message);
    } finally {
      setRequestingItemId(null);
    }
  };

  // Profile update handler
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      if (user?.id === 'demo-student-id') {
        setUser(prev => ({
          ...prev,
          user_metadata: {
            ...prev.user_metadata,
            full_name: editName,
            phone: editPhone
          }
        }));
        toast.success('Profile updated successfully.');
        setIsEditingProfile(false);
        return;
      }

      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: editName,
          phone: editPhone
        }
      });

      if (error) throw error;

      setUser(prev => ({
        ...prev,
        user_metadata: {
          ...prev.user_metadata,
          full_name: editName,
          phone: editPhone
        }
      }));

      toast.success('Profile updated successfully.');
      setIsEditingProfile(false);
    } catch (err) {
      toast.error('Failed to update profile: ' + (err.message || 'Error occurred'));
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Sign out handler
  const handleSignOut = async () => {
    try {
      localStorage.removeItem('demoStudent');
      await supabase.auth.signOut();
      toast.success('Signed out successfully.');
      navigate('/login');
    } catch (err) {
      console.error('Sign out error:', err);
      navigate('/login');
    }
  };

  // Close modal or drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveNote(null);
        setMobileDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock body scroll when modal or mobile drawer is open
  useEffect(() => {
    if (activeNote || mobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [activeNote, mobileDrawerOpen]);

  // Derived student attributes
  const primaryEnrollment = enrollments[0] || null;
  const approvedEnrollment = enrollments.find(e => e.status === 'approved') || null;
  const hasApprovedEnrollment = Boolean(approvedEnrollment);

  const studentName = user?.user_metadata?.full_name || primaryEnrollment?.student_name || user?.email?.split('@')[0] || 'Student';
  const studentEmail = user?.email || primaryEnrollment?.student_email || '';
  const studentPhone = user?.user_metadata?.phone || primaryEnrollment?.student_phone || '';
  const studentId = approvedEnrollment?.student_id || primaryEnrollment?.student_id || null;

  // Extract real instructor notices from enrollment.notes
  const instructorNotesList = useMemo(() => {
    const list = [];
    enrollments.forEach(enr => {
      if (!enr.notes) return;
      try {
        const parsed = typeof enr.notes === 'string' ? JSON.parse(enr.notes) : enr.notes;
        const array = Array.isArray(parsed) ? parsed : (parsed && typeof parsed === 'object' ? [parsed] : []);
        array.forEach(item => {
          if (item && item.text) {
            list.push({
              id: item.id || Math.random().toString(),
              text: item.text,
              date: item.date || enr.created_at,
              pdfUrl: item.pdfUrl || null,
              courseName: enr.course_name || enr.courses?.title || 'Enrolled Course'
            });
          }
        });
      } catch {
        if (typeof enr.notes === 'string' && enr.notes.trim()) {
          list.push({
            id: Math.random().toString(),
            text: enr.notes,
            date: enr.created_at,
            pdfUrl: null,
            courseName: enr.course_name || 'Enrolled Course'
          });
        }
      }
    });
    return list;
  }, [enrollments]);

  // Navigation Items (Minimal, Institutional, Functional)
  const navItems = useMemo(() => {
    const items = [
      {
        id: 'overview',
        label: 'Overview',
        icon: (
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
          </svg>
        )
      },
      {
        id: 'courses',
        label: 'My Courses',
        badge: enrollments.length > 0 ? String(enrollments.length) : null,
        icon: (
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
          </svg>
        )
      },
      {
        id: 'resources',
        label: 'Learning Resources',
        badge: notes.length > 0 ? String(notes.length) : null,
        icon: (
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        )
      }
    ];

    if (instructorNotesList.length > 0) {
      items.push({
        id: 'announcements',
        label: 'Announcements',
        badge: String(instructorNotesList.length),
        icon: (
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
        )
      });
    }

    items.push({
      id: 'profile',
      label: 'Profile & Support',
      icon: (
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      )
    });

    return items;
  }, [enrollments.length, notes.length, instructorNotesList.length]);

  // Loading Screen (Restrained, Institutional)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center p-6 text-center select-none">
        <Helmet>
          <title>Student Portal | Advait Stock Market Academy</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="w-7 h-7 border-2 border-[#08291D] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-medium tracking-wide text-[#4A6356] font-['Inter']">
          Loading student records...
        </p>
      </div>
    );
  }

  // Unauthenticated Screen (Clean, Institutional Sign-in Gate)
  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center p-6 text-center">
        <Helmet>
          <title>Student Portal Access | Advait Stock Market Academy</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="max-w-md w-full bg-white border border-[#08291D]/12 rounded-[4px] p-8 sm:p-10 text-center">
          <Link to="/" className="inline-block mb-6" title="Advait Stock Market Academy">
            <img src="/logo-dark.png" alt="ASMA" className="h-10 w-auto mx-auto object-contain" />
          </Link>
          <h2 className="text-xl sm:text-2xl font-['Manrope'] font-semibold text-[#08291D] mb-2 tracking-tight">
            Student Learning Portal
          </h2>
          <p className="text-xs sm:text-sm text-[#4A6356] font-['Inter'] mb-6 leading-relaxed">
            Please sign in with your authorized academy credentials to view enrolled courses, schedules, and learning materials.
          </p>
          <div className="flex flex-col gap-2.5">
            <Link
              to="/login"
              className="w-full py-2.5 px-4 bg-[#08291D] hover:bg-[#06261A] text-white text-xs font-semibold tracking-wider uppercase rounded-[3px] transition-colors"
            >
              Sign In to Your Account
            </Link>
            <button
              type="button"
              onClick={() => {
                localStorage.setItem('demoStudent', 'true');
                window.location.reload();
              }}
              className="w-full py-2.5 px-4 bg-white hover:bg-[#FAF9F6] border border-[#08291D]/15 text-[#08291D] text-xs font-medium rounded-[3px] transition-colors cursor-pointer"
            >
              Preview Demo Student View
            </button>
            <Link
              to="/"
              className="text-xs text-[#4A6356] hover:text-[#08291D] font-medium transition-colors mt-2"
            >
              ← Return to Main Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#08291D] font-['Inter'] flex flex-col md:flex-row antialiased">
      <Helmet>
        <title>Student Learning Portal | Advait Stock Market Academy</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* =========================================================================
          DESKTOP SIDEBAR (236px Wide, Minimal Editorial Architecture)
          ========================================================================= */}
      <aside className="hidden md:flex flex-col w-[236px] bg-[#FAF9F6] border-r border-[#08291D]/10 shrink-0 sticky top-0 h-screen select-none z-30">
        
        {/* Top Branding */}
        <div className="p-5 border-b border-[#08291D]/8">
          <Link to="/" className="block focus:outline-none" title="Return to ASMA Website">
            <img
              src="/logo-dark.png"
              alt="Advait Stock Market Academy"
              className="h-9 w-auto object-contain"
            />
          </Link>
          <div className="text-[11px] font-medium text-[#4A6356] mt-1.5 tracking-normal">
            Student Learning Portal
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto" aria-label="Student Navigation">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-[3px] text-[13px] transition-colors duration-150 cursor-pointer text-left ${
                  isActive
                    ? 'bg-[#08291D] text-white font-medium'
                    : 'text-[#3B4D44] hover:text-[#08291D] hover:bg-[#08291D]/5'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={isActive ? 'text-[#D4AF37]' : 'text-[#4A6356]'}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-[2px] font-semibold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#08291D]/8 text-[#08291D]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer: Support & Sign Out */}
        <div className="p-4 border-t border-[#08291D]/8 space-y-3 bg-[#FAF9F6]">
          {/* Direct Support Snippet */}
          <div className="p-3 rounded-[3px] bg-white border border-[#08291D]/10">
            <div className="text-[11px] font-semibold text-[#08291D] font-['Manrope']">Academy Support</div>
            <a
              href="tel:09156953895"
              className="text-xs text-[#08291D] hover:underline font-mono font-medium block mt-0.5"
            >
              +91 91569 53895
            </a>
            <div className="text-[10px] text-[#4A6356] mt-0.5">Nagpur Campus • 8 AM–10 PM</div>
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <Link
              to="/"
              className="text-[#4A6356] hover:text-[#08291D] transition-colors font-medium"
            >
              ← Public Website
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="text-red-700 hover:text-red-900 transition-colors font-medium cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* =========================================================================
          MOBILE TOP BAR & DRAWER
          ========================================================================= */}
      <div className="md:hidden flex items-center justify-between h-13 px-4 bg-[#FAF9F6] border-b border-[#08291D]/10 sticky top-0 z-40">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo-dark.png" alt="ASMA" className="h-7 w-auto object-contain" />
          <span className="text-[11px] font-medium text-[#4A6356]">
            Portal
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          className="p-1.5 rounded-[3px] text-[#08291D] hover:bg-[#08291D]/5 cursor-pointer focus:outline-none"
          aria-label="Open Navigation Drawer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileDrawerOpen(false)}
              className="fixed inset-0 bg-black/40"
            />

            {/* Slide-in Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-4/5 max-w-xs bg-[#FAF9F6] h-full flex flex-col justify-between p-5 z-10 border-r border-[#08291D]/10"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#08291D]/10">
                  <img src="/logo-dark.png" alt="ASMA" className="h-7 w-auto object-contain" />
                  <button
                    type="button"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="p-1 text-[#08291D]/70 hover:text-[#08291D] cursor-pointer"
                    aria-label="Close Navigation"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Authenticated Student Identifier */}
                <div className="py-3.5 border-b border-[#08291D]/8">
                  <div className="text-sm font-semibold text-[#08291D] truncate font-['Manrope']">{studentName}</div>
                  <div className="text-xs text-[#4A6356] truncate mt-0.5">{studentEmail}</div>
                  {studentId && (
                    <div className="mt-1.5 text-[11px] font-mono text-[#08291D]/80">
                      ID: {studentId}
                    </div>
                  )}
                </div>

                {/* Drawer Links */}
                <nav className="py-3 space-y-1">
                  {navItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileDrawerOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-[3px] text-sm transition-colors ${
                          isActive
                            ? 'bg-[#08291D] text-white font-medium'
                            : 'text-[#3B4D44] hover:bg-[#08291D]/5'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={isActive ? 'text-[#D4AF37]' : 'text-[#4A6356]'}>
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-[2px] font-semibold ${
                            isActive ? 'bg-white/20 text-white' : 'bg-[#08291D]/8 text-[#08291D]'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Drawer Bottom Actions */}
              <div className="pt-3 border-t border-[#08291D]/10 space-y-2">
                <Link
                  to="/"
                  className="block text-xs text-[#4A6356] hover:text-[#08291D] font-medium"
                >
                  ← Return to Main Website
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full py-2 px-3 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-[3px] border border-red-200 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MAIN WORKSPACE AREA
          ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Compact Top Header Bar */}
        <header className="hidden md:flex items-center justify-between h-13 px-6 lg:px-8 bg-[#FAF9F6] border-b border-[#08291D]/10 shrink-0 sticky top-0 z-20">
          <div className="text-xs font-medium text-[#4A6356] font-['Inter']">
            <span>Student Portal</span>
            <span className="mx-1.5 text-[#08291D]/30">/</span>
            <span className="text-[#08291D] font-semibold">
              {activeTab === 'overview' && 'Overview'}
              {activeTab === 'courses' && 'My Courses'}
              {activeTab === 'resources' && 'Learning Resources'}
              {activeTab === 'announcements' && 'Announcements'}
              {activeTab === 'profile' && 'Profile & Support'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-xs text-[#4A6356] hover:text-[#08291D] font-medium transition-colors"
            >
              Public Website ↗
            </Link>

            {/* Authenticated Profile Info */}
            <div className="flex items-center gap-2 pl-3 border-l border-[#08291D]/10">
              <div className="w-6 h-6 rounded-full bg-[#08291D] text-white flex items-center justify-center font-bold text-[11px] font-['Manrope']">
                {(studentName.charAt(0) || 'S').toUpperCase()}
              </div>
              <div className="text-left hidden lg:block">
                <span className="text-xs font-semibold text-[#08291D] font-['Manrope']">{studentName}</span>
                {studentId && (
                  <span className="text-[10px] text-[#4A6356] font-mono ml-1.5">
                    ({studentId})
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="text-xs text-[#4A6356] hover:text-red-700 transition-colors font-medium cursor-pointer ml-1"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-5xl xl:max-w-6xl w-full mx-auto">
          <motion.div
            key={activeTab}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >

            {/* ===================================================================
                TAB 1: OVERVIEW
                =================================================================== */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* Clean Editorial Page Title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#08291D]/10">
                  <div>
                    <h1 className="text-2xl sm:text-[26px] font-['Manrope'] font-semibold text-[#08291D] tracking-tight">
                      Welcome, {studentName}
                    </h1>
                    <p className="text-xs sm:text-[13px] text-[#4A6356] mt-0.5">
                      Advait Stock Market Academy • {studentEmail}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    {hasApprovedEnrollment ? (
                      <span className="text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-[3px] font-medium">
                        Active Enrolled
                      </span>
                    ) : (
                      <span className="text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-[3px] font-medium">
                        Registration Under Review
                      </span>
                    )}
                    {studentId && (
                      <span className="text-[#08291D] bg-white border border-[#08291D]/12 font-mono px-2 py-0.5 rounded-[3px] font-medium">
                        ID: {studentId}
                      </span>
                    )}
                  </div>
                </div>

                {/* PRIMARY SPOTLIGHT: ENROLLED COURSE */}
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#4A6356] mb-2.5 font-['Inter']">
                    Enrolled Program
                  </div>

                  {primaryEnrollment ? (
                    <div className="bg-white border border-[#08291D]/12 rounded-[4px] p-5 sm:p-6 hover:border-[#08291D]/25 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2.5">
                        <div>
                          <div className="text-[11px] font-medium uppercase tracking-wide text-[#7C6624] font-['Inter'] mb-0.5">
                            {primaryEnrollment.courses?.category || 'Trading Program'}
                          </div>
                          <h2 className="text-lg sm:text-xl font-['Manrope'] font-semibold text-[#08291D]">
                            {primaryEnrollment.course_name || primaryEnrollment.courses?.title || 'Professional Stock Market Trader Program'}
                          </h2>
                        </div>

                        <span className={`text-xs font-medium px-2 py-0.5 rounded-[3px] self-start shrink-0 ${
                          primaryEnrollment.status === 'approved'
                            ? 'text-emerald-800 bg-emerald-50 border border-emerald-200'
                            : 'text-amber-800 bg-amber-50 border border-amber-200'
                        }`}>
                          {primaryEnrollment.status === 'approved' ? 'Enrolled' : 'Pending Verification'}
                        </span>
                      </div>

                      {primaryEnrollment.courses?.description && (
                        <p className="text-xs sm:text-sm text-[#4A6356] font-['Inter'] leading-relaxed mb-4 max-w-3xl">
                          {primaryEnrollment.courses.description}
                        </p>
                      )}

                      {/* Course Meta Data Row */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-[#08291D]/8 mb-4 text-xs">
                        <div>
                          <div className="text-[#4A6356] text-[11px]">Training Mode</div>
                          <div className="font-medium text-[#08291D] mt-0.5">
                            {primaryEnrollment.courses?.mode || 'Classroom & Live Market'}
                          </div>
                        </div>
                        <div>
                          <div className="text-[#4A6356] text-[11px]">Duration</div>
                          <div className="font-medium text-[#08291D] mt-0.5">
                            {primaryEnrollment.courses?.duration || '3 Months'}
                          </div>
                        </div>
                        <div>
                          <div className="text-[#4A6356] text-[11px]">Student ID</div>
                          <div className="font-mono font-medium text-[#08291D] mt-0.5">
                            {primaryEnrollment.student_id || 'Pending Assignment'}
                          </div>
                        </div>
                        <div>
                          <div className="text-[#4A6356] text-[11px]">Enrolled Date</div>
                          <div className="font-medium text-[#08291D] mt-0.5">
                            {new Date(primaryEnrollment.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-2.5">
                        {primaryEnrollment.status === 'approved' ? (
                          <button
                            type="button"
                            onClick={() => setActiveTab('resources')}
                            className="px-4 py-2 bg-[#08291D] hover:bg-[#06261A] text-white text-xs font-semibold rounded-[3px] transition-colors cursor-pointer"
                          >
                            Access Study Materials →
                          </button>
                        ) : (
                          <div className="text-xs text-[#4A6356] bg-[#FAF9F6] px-3 py-1.5 rounded-[3px] border border-[#08291D]/8">
                            Your registration is under verification. Study notes unlock upon approval.
                          </div>
                        )}

                        <Link
                          to={primaryEnrollment.course_id ? `/course/${primaryEnrollment.course_id}` : '/courses'}
                          className="px-3.5 py-2 bg-white hover:bg-[#FAF9F6] text-[#08291D] text-xs font-medium rounded-[3px] border border-[#08291D]/15 transition-colors"
                        >
                          View Syllabus Curriculum
                        </Link>
                      </div>
                    </div>
                  ) : (
                    /* Clean Informational Empty State */
                    <div className="bg-white border border-[#08291D]/12 rounded-[4px] p-6 text-center">
                      <h3 className="text-base font-['Manrope'] font-semibold text-[#08291D] mb-1">
                        No Active Course Enrollment Found
                      </h3>
                      <p className="text-xs sm:text-sm text-[#4A6356] font-['Inter'] max-w-md mx-auto mb-4 leading-relaxed">
                        You do not currently have an approved program registered under this account. Explore our course catalog or contact the campus desk.
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-2.5">
                        <Link
                          to="/courses"
                          className="px-4 py-2 bg-[#08291D] hover:bg-[#06261A] text-white text-xs font-semibold rounded-[3px] transition-colors"
                        >
                          View Courses
                        </Link>
                        <a
                          href="tel:09156953895"
                          className="px-3.5 py-2 bg-white border border-[#08291D]/15 text-[#08291D] text-xs font-medium rounded-[3px] hover:bg-[#FAF9F6] transition-colors"
                        >
                          Call Campus Desk
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* TWO-COLUMN EDITORIAL SECTION: STUDY MATERIALS & NOTICES */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                  
                  {/* Left Column: Study Materials (7 cols) */}
                  <div className="lg:col-span-7 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#4A6356] font-['Inter']">
                        Study Materials ({notes.length})
                      </span>
                      {notes.length > 3 && (
                        <button
                          type="button"
                          onClick={() => setActiveTab('resources')}
                          className="text-xs text-[#08291D] hover:underline font-medium cursor-pointer"
                        >
                          View All →
                        </button>
                      )}
                    </div>

                    {hasApprovedEnrollment && notes.length > 0 ? (
                      <div className="bg-white border border-[#08291D]/12 rounded-[4px] divide-y divide-[#08291D]/8">
                        {notes.slice(0, 3).map((note) => {
                          const req = accessRequests.find(r => r.item_id === String(note.id));
                          const isUnlocked = req ? req.status === 'approved' : false;
                          const isPending = req ? req.status === 'pending' : false;

                          return (
                            <div key={note.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 text-[11px] text-[#4A6356] mb-0.5">
                                  <span className="font-mono uppercase">{note.file_type === 'pdf' ? 'PDF' : 'Link'}</span>
                                  <span>•</span>
                                  {isUnlocked ? (
                                    <span className="text-emerald-800 font-medium">Available</span>
                                  ) : isPending ? (
                                    <span className="text-amber-800 font-medium">Requested</span>
                                  ) : (
                                    <span className="text-gray-500 font-medium">Restricted</span>
                                  )}
                                </div>
                                <div className="text-sm font-semibold text-[#08291D] font-['Manrope'] truncate">
                                  {note.title}
                                </div>
                              </div>

                              <div className="shrink-0">
                                {isUnlocked ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (note.file_type === 'pdf') {
                                        setActiveNote(note);
                                      } else {
                                        window.open(note.file_url, '_blank');
                                      }
                                    }}
                                    className="px-3 py-1.5 bg-[#FAF9F6] hover:bg-[#08291D] text-[#08291D] hover:text-white text-xs font-medium rounded-[3px] border border-[#08291D]/12 transition-colors cursor-pointer"
                                  >
                                    Open
                                  </button>
                                ) : isPending ? (
                                  <span className="text-xs text-amber-800 font-medium">
                                    Under Review
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleRequestAccess(note)}
                                    className="px-3 py-1.5 bg-white hover:bg-[#FAF9F6] text-[#08291D] text-xs font-medium rounded-[3px] border border-[#08291D]/15 transition-colors cursor-pointer"
                                  >
                                    Request Access
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="bg-white border border-[#08291D]/12 rounded-[4px] p-5 text-center text-xs text-[#4A6356]">
                        {hasApprovedEnrollment 
                          ? 'No module notes published yet. Resources will appear as sessions progress.'
                          : 'Course materials unlock upon enrollment approval.'}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Notices & Mentorship Contact (5 cols) */}
                  <div className="lg:col-span-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#4A6356] font-['Inter']">
                        Batch Notices
                      </span>
                      {instructorNotesList.length > 2 && (
                        <button
                          type="button"
                          onClick={() => setActiveTab('announcements')}
                          className="text-xs text-[#08291D] hover:underline font-medium cursor-pointer"
                        >
                          View All →
                        </button>
                      )}
                    </div>

                    <div className="bg-white border border-[#08291D]/12 rounded-[4px] p-4 divide-y divide-[#08291D]/8">
                      {instructorNotesList.length > 0 ? (
                        instructorNotesList.slice(0, 2).map((item) => (
                          <div key={item.id} className="py-2.5 first:pt-0 last:pb-0">
                            <div className="text-[11px] text-[#4A6356] mb-1">
                              {new Date(item.date).toLocaleDateString()}
                            </div>
                            <p className="text-xs text-[#08291D] leading-relaxed">
                              {item.text}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-[#4A6356] py-2 text-center">
                          No active notices posted.
                        </div>
                      )}
                    </div>

                    {/* Academy Campus Direct Helpline */}
                    <div className="p-4 bg-white border border-[#08291D]/12 rounded-[4px]">
                      <div className="text-xs font-semibold text-[#08291D] font-['Manrope'] mb-1">
                        Nagpur Campus Mentorship Desk
                      </div>
                      <div className="text-xs text-[#4A6356] leading-relaxed mb-2">
                        Plot No. 20, Near Pipla Fata, Besa–Pipla Road, Nagpur
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-[#08291D]/8 text-xs">
                        <a href="tel:09156953895" className="font-mono text-[#08291D] font-semibold hover:underline">
                          +91 91569 53895
                        </a>
                        <a
                          href="https://wa.me/919156953895"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#08291D] font-medium hover:underline"
                        >
                          WhatsApp Support ↗
                        </a>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* ===================================================================
                TAB 2: MY COURSES
                =================================================================== */}
            {activeTab === 'courses' && (
              <div className="space-y-6">
                <div className="border-b border-[#08291D]/10 pb-4">
                  <h1 className="text-xl sm:text-2xl font-['Manrope'] font-semibold text-[#08291D]">
                    My Enrolled Programs
                  </h1>
                  <p className="text-xs sm:text-sm text-[#4A6356] font-['Inter'] mt-0.5">
                    Verified course registrations and batch status assigned to your student account.
                  </p>
                </div>

                {enrollments.length === 0 ? (
                  <div className="bg-white border border-[#08291D]/12 rounded-[4px] p-8 text-center">
                    <h3 className="text-base font-['Manrope'] font-semibold text-[#08291D] mb-1">
                      No Enrollments Found
                    </h3>
                    <p className="text-xs sm:text-sm text-[#4A6356] font-['Inter'] max-w-md mx-auto mb-4 leading-relaxed">
                      You are not currently enrolled in any ASMA program. Browse available stock market courses or call the academy campus.
                    </p>
                    <Link
                      to="/courses"
                      className="px-4 py-2 bg-[#08291D] hover:bg-[#06261A] text-white text-xs font-semibold rounded-[3px] transition-colors inline-block"
                    >
                      View All Courses
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {enrollments.map((enr) => (
                      <div
                        key={enr.id}
                        className="bg-white border border-[#08291D]/12 rounded-[4px] p-5 sm:p-6 hover:border-[#08291D]/25 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2.5">
                          <div>
                            <span className="text-[11px] font-medium uppercase tracking-wide text-[#7C6624] font-['Inter']">
                              {enr.courses?.category || 'Trading Program'}
                            </span>
                            <h3 className="text-lg font-['Manrope'] font-semibold text-[#08291D] mt-0.5">
                              {enr.course_name || enr.courses?.title || 'Professional Stock Market Trader Program'}
                            </h3>
                          </div>

                          <span className={`text-xs font-medium px-2 py-0.5 rounded-[3px] self-start shrink-0 ${
                            enr.status === 'approved'
                              ? 'text-emerald-800 bg-emerald-50 border border-emerald-200'
                              : enr.status === 'rejected'
                              ? 'text-red-800 bg-red-50 border border-red-200'
                              : 'text-amber-800 bg-amber-50 border border-amber-200'
                          }`}>
                            {enr.status === 'approved' ? 'Enrolled' : enr.status}
                          </span>
                        </div>

                        {enr.courses?.description && (
                          <p className="text-xs sm:text-sm text-[#4A6356] font-['Inter'] leading-relaxed mb-4">
                            {enr.courses.description}
                          </p>
                        )}

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-[#08291D]/8 mb-4 text-xs">
                          <div>
                            <div className="text-[#4A6356] text-[11px]">Training Mode</div>
                            <div className="font-medium text-[#08291D] mt-0.5">
                              {enr.courses?.mode || 'Classroom & Live Market'}
                            </div>
                          </div>
                          <div>
                            <div className="text-[#4A6356] text-[11px]">Duration</div>
                            <div className="font-medium text-[#08291D] mt-0.5">
                              {enr.courses?.duration || '12 Weeks'}
                            </div>
                          </div>
                          <div>
                            <div className="text-[#4A6356] text-[11px]">Student ID</div>
                            <div className="font-mono font-medium text-[#08291D] mt-0.5">
                              {enr.student_id || 'Pending'}
                            </div>
                          </div>
                          <div>
                            <div className="text-[#4A6356] text-[11px]">Registered Date</div>
                            <div className="font-medium text-[#08291D] mt-0.5">
                              {new Date(enr.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                          {enr.status === 'approved' && (
                            <button
                              type="button"
                              onClick={() => setActiveTab('resources')}
                              className="px-3.5 py-1.5 bg-[#08291D] hover:bg-[#06261A] text-white text-xs font-semibold rounded-[3px] transition-colors cursor-pointer"
                            >
                              Access Course Materials →
                            </button>
                          )}
                          <Link
                            to={enr.course_id ? `/course/${enr.course_id}` : '/courses'}
                            className="px-3 py-1.5 bg-white hover:bg-[#FAF9F6] text-[#08291D] text-xs font-medium rounded-[3px] border border-[#08291D]/15 transition-colors"
                          >
                            Course Syllabus
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ===================================================================
                TAB 3: LEARNING RESOURCES (STUDY NOTES & DOCS)
                =================================================================== */}
            {activeTab === 'resources' && (
              <div className="space-y-6">
                <div className="border-b border-[#08291D]/10 pb-4">
                  <h1 className="text-xl sm:text-2xl font-['Manrope'] font-semibold text-[#08291D]">
                    Learning Resources & Study Materials
                  </h1>
                  <p className="text-xs sm:text-sm text-[#4A6356] font-['Inter'] mt-0.5">
                    Authorized reference documents, lecture notes, and formula sheets curated by ASMA mentors.
                  </p>
                </div>

                {!hasApprovedEnrollment ? (
                  <div className="bg-white border border-[#08291D]/12 rounded-[4px] p-8 text-center">
                    <h3 className="text-base font-['Manrope'] font-semibold text-[#08291D] mb-1">
                      Protected Learning Materials
                    </h3>
                    <p className="text-xs sm:text-sm text-[#4A6356] font-['Inter'] max-w-md mx-auto mb-4 leading-relaxed">
                      Course notes and materials unlock automatically once an authorized course enrollment is approved for your student account.
                    </p>
                    <a
                      href="tel:09156953895"
                      className="inline-block text-xs font-medium text-[#08291D] underline"
                    >
                      Contact Admissions for Registration Status
                    </a>
                  </div>
                ) : notes.length === 0 ? (
                  <div className="bg-white border border-[#08291D]/12 rounded-[4px] p-8 text-center">
                    <p className="text-xs sm:text-sm text-[#4A6356] font-['Inter']">
                      No study materials published yet for this course. Resources are released by mentors during scheduled classroom modules.
                    </p>
                  </div>
                ) : (
                  <div className="bg-white border border-[#08291D]/12 rounded-[4px] divide-y divide-[#08291D]/8">
                    {notes.map((note) => {
                      const req = accessRequests.find(r => r.item_id === String(note.id));
                      const isApproved = req ? req.status === 'approved' : false;
                      const isPending = req ? req.status === 'pending' : false;
                      const isRequesting = requestingItemId === note.id;

                      return (
                        <div
                          key={note.id}
                          className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          <div className="flex-1 min-w-0 pr-4">
                            <div className="flex items-center gap-2 mb-1 text-xs">
                              <span className="font-mono uppercase text-[10px] text-[#4A6356]">
                                {note.file_type === 'pdf' ? 'PDF Document' : note.file_type === 'link' ? 'External Link' : 'Study Text'}
                              </span>
                              <span className="text-[#08291D]/20">•</span>
                              {isApproved ? (
                                <span className="text-[11px] font-medium text-emerald-800">
                                  Available
                                </span>
                              ) : isPending ? (
                                <span className="text-[11px] font-medium text-amber-800">
                                  Requested (Pending Review)
                                </span>
                              ) : (
                                <span className="text-[11px] font-medium text-gray-500">
                                  Restricted
                                </span>
                              )}
                            </div>

                            <h3 className="text-base font-['Manrope'] font-semibold text-[#08291D] mb-1">
                              {note.title}
                            </h3>
                            <p className="text-xs text-[#4A6356] font-['Inter'] leading-relaxed">
                              {note.description || 'Reference material for enrolled ASMA students.'}
                            </p>
                          </div>

                          <div className="shrink-0 flex items-center gap-2">
                            {isApproved ? (
                              note.file_type === 'link' ? (
                                <a
                                  href={note.file_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3.5 py-2 bg-[#08291D] hover:bg-[#06261A] text-white text-xs font-semibold rounded-[3px] transition-colors"
                                >
                                  Open Resource ↗
                                </a>
                              ) : note.file_type === 'pdf' ? (
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setActiveNote(note)}
                                    className="px-3 py-2 bg-white hover:bg-[#FAF9F6] border border-[#08291D]/15 text-[#08291D] text-xs font-medium rounded-[3px] transition-colors cursor-pointer"
                                  >
                                    Preview
                                  </button>
                                  <a
                                    href={note.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3.5 py-2 bg-[#08291D] hover:bg-[#06261A] text-white text-xs font-semibold rounded-[3px] transition-colors"
                                  >
                                    Download PDF
                                  </a>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setActiveNote(note)}
                                  className="px-3.5 py-2 bg-[#08291D] hover:bg-[#06261A] text-white text-xs font-semibold rounded-[3px] transition-colors cursor-pointer"
                                >
                                  Read Document
                                </button>
                              )
                            ) : isPending ? (
                              <span className="text-xs text-amber-800 font-medium px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-[3px]">
                                Review In Progress
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleRequestAccess(note)}
                                disabled={isRequesting}
                                className="px-3.5 py-2 bg-white hover:bg-[#FAF9F6] border border-[#08291D]/15 text-[#08291D] text-xs font-medium rounded-[3px] transition-colors cursor-pointer disabled:opacity-50"
                              >
                                {isRequesting ? 'Requesting...' : 'Request Access'}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ===================================================================
                TAB 4: ACADEMY ANNOUNCEMENTS
                =================================================================== */}
            {activeTab === 'announcements' && (
              <div className="space-y-6">
                <div className="border-b border-[#08291D]/10 pb-4">
                  <h1 className="text-xl sm:text-2xl font-['Manrope'] font-semibold text-[#08291D]">
                    Academy Announcements & Updates
                  </h1>
                  <p className="text-xs sm:text-sm text-[#4A6356] font-['Inter'] mt-0.5">
                    Direct communications, batch schedules, and session notices from ASMA mentors.
                  </p>
                </div>

                {instructorNotesList.length === 0 ? (
                  <div className="bg-white border border-[#08291D]/12 rounded-[4px] p-8 text-center">
                    <p className="text-xs sm:text-sm text-[#4A6356] font-['Inter']">
                      No active announcements from mentors. Scheduled batch notices and schedule updates will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {instructorNotesList.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white border border-[#08291D]/12 rounded-[4px] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left"
                      >
                        <div className="flex-1 min-w-0 pr-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[11px] font-medium text-[#7C6624] uppercase tracking-wide">
                              {item.courseName}
                            </span>
                            <span className="text-[11px] text-[#4A6356]">
                              • {new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <p className="text-sm text-[#08291D] leading-relaxed">
                            {item.text}
                          </p>
                        </div>

                        {item.pdfUrl && (
                          <a
                            href={item.pdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#FAF9F6] text-[#08291D] border border-[#08291D]/15 text-xs font-medium rounded-[3px] transition-colors shrink-0 self-start sm:self-auto"
                          >
                            <span>Attached Document ↗</span>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ===================================================================
                TAB 5: MY PROFILE & SUPPORT
                =================================================================== */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="border-b border-[#08291D]/10 pb-4">
                  <h1 className="text-xl sm:text-2xl font-['Manrope'] font-semibold text-[#08291D]">
                    Student Profile & Academy Support
                  </h1>
                  <p className="text-xs sm:text-sm text-[#4A6356] font-['Inter'] mt-0.5">
                    Your authenticated credentials, contact information, and direct campus mentorship channels.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Credentials & Profile Edit Card */}
                  <div className="bg-white border border-[#08291D]/12 rounded-[4px] p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#08291D]/8">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#08291D] text-white flex items-center justify-center font-bold text-sm font-['Manrope']">
                            {(studentName.charAt(0) || 'S').toUpperCase()}
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-[#08291D] font-['Manrope'] leading-tight">
                              {studentName}
                            </h3>
                            <div className="text-xs text-[#4A6356] font-mono mt-0.5">
                              {studentId ? `Student ID: ${studentId}` : 'Student Account'}
                            </div>
                          </div>
                        </div>

                        {!isEditingProfile && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditName(studentName);
                              setEditPhone(studentPhone);
                              setIsEditingProfile(true);
                            }}
                            className="text-xs text-[#08291D] hover:underline px-2.5 py-1 rounded-[3px] border border-[#08291D]/15 hover:bg-[#FAF9F6] transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                        )}
                      </div>

                      {isEditingProfile ? (
                        <form onSubmit={handleSaveProfile} className="space-y-3 text-left text-xs">
                          <div>
                            <label className="block text-[#4A6356] text-[11px] font-medium mb-1">
                              Full Name
                            </label>
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              required
                              className="w-full px-3 py-2 border border-[#08291D]/20 rounded-[3px] text-xs font-medium text-[#08291D] focus:outline-none focus:border-[#08291D]"
                            />
                          </div>

                          <div>
                            <label className="block text-[#4A6356] text-[11px] font-medium mb-1">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              value={editPhone}
                              onChange={(e) => setEditPhone(e.target.value)}
                              placeholder="+91 XXXXX XXXXX"
                              className="w-full px-3 py-2 border border-[#08291D]/20 rounded-[3px] text-xs font-medium text-[#08291D] focus:outline-none focus:border-[#08291D]"
                            />
                          </div>

                          <div>
                            <div className="text-[#4A6356] text-[11px] font-medium">Registered Email</div>
                            <div className="font-mono text-xs text-[#08291D]/70 mt-1 bg-[#FAF9F6] p-2 rounded-[3px] border border-[#08291D]/8">
                              {studentEmail}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-2">
                            <button
                              type="submit"
                              disabled={isSavingProfile}
                              className="px-3.5 py-1.5 bg-[#08291D] hover:bg-[#06261A] text-white text-xs font-semibold rounded-[3px] transition-colors cursor-pointer disabled:opacity-50"
                            >
                              {isSavingProfile ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsEditingProfile(false)}
                              className="px-3 py-1.5 bg-white hover:bg-gray-50 border border-[#08291D]/15 text-[#08291D] text-xs font-medium rounded-[3px] transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="space-y-3 text-left text-xs">
                          <div>
                            <div className="text-[#4A6356] text-[11px]">Full Name</div>
                            <div className="font-semibold text-[#08291D] text-sm mt-0.5">{studentName}</div>
                          </div>
                          <div>
                            <div className="text-[#4A6356] text-[11px]">Registered Email</div>
                            <div className="font-semibold text-[#08291D] text-sm mt-0.5">{studentEmail}</div>
                          </div>
                          <div>
                            <div className="text-[#4A6356] text-[11px]">Phone Number</div>
                            <div className="font-semibold text-[#08291D] text-sm mt-0.5">{studentPhone || 'Not provided'}</div>
                          </div>
                          <div>
                            <div className="text-[#4A6356] text-[11px]">Enrollment Status</div>
                            <div className="font-semibold text-[#08291D] text-sm mt-0.5">
                              {hasApprovedEnrollment ? 'Active Enrolled Student' : 'Registration Pending'}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 mt-5 border-t border-[#08291D]/8">
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full py-2 px-3 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-[3px] border border-red-200 transition-colors cursor-pointer"
                      >
                        Sign Out of Portal
                      </button>
                    </div>
                  </div>

                  {/* Academy Contact & Desk Card */}
                  <div className="bg-white border border-[#08291D]/12 rounded-[4px] p-6 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] font-medium text-[#4A6356] mb-1">
                        Advait Stock Market Academy
                      </div>
                      <h3 className="text-lg font-['Manrope'] font-semibold text-[#08291D] mb-4">
                        Campus Mentorship Desk
                      </h3>

                      <div className="space-y-3.5 text-xs text-left">
                        <div>
                          <div className="text-[#4A6356] text-[11px]">Campus Location</div>
                          <div className="text-[#08291D] font-medium leading-relaxed mt-0.5">
                            Plot No. 20, Near Pipla Fata, Besa–Pipla Road, Nagpur, Maharashtra – 440034
                          </div>
                        </div>

                        <div>
                          <div className="text-[#4A6356] text-[11px]">Admissions & Helpdesk</div>
                          <a
                            href="tel:09156953895"
                            className="text-[#08291D] font-semibold hover:underline block text-sm font-mono mt-0.5"
                          >
                            +91 91569 53895
                          </a>
                        </div>

                        <div>
                          <div className="text-[#4A6356] text-[11px]">Campus Hours</div>
                          <div className="text-[#08291D] font-medium mt-0.5">
                            Monday to Sunday: 8:00 AM – 10:00 PM
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-5 mt-5 border-t border-[#08291D]/8 space-y-2">
                      <a
                        href="https://wa.me/919156953895?text=Hi%20Advait%20Academy!%20I%20am%20an%20enrolled%20student%20inquiring%20about%20my%20learning%20portal."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-[#08291D] hover:bg-[#06261A] text-white text-xs font-semibold rounded-[3px] transition-colors"
                      >
                        <span>Message Mentorship on WhatsApp</span>
                      </a>
                      <Link
                        to="/contact"
                        className="w-full inline-flex items-center justify-center py-2 px-3 bg-[#FAF9F6] hover:bg-gray-100 border border-[#08291D]/15 text-[#08291D] text-xs font-medium rounded-[3px] transition-colors"
                      >
                        Official Contact Information
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            )}

          </motion.div>
        </main>
      </div>

      {/* =========================================================================
          READING / PREVIEW MODAL (Focused, Minimal Document Viewer)
          ========================================================================= */}
      <AnimatePresence>
        {activeNote && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setActiveNote(null)}
              className="fixed inset-0 bg-black/40"
            />

            {/* Modal Card */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="relative bg-white rounded-[4px] border border-[#08291D]/15 w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden z-10"
            >
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#08291D]/10 shrink-0">
                <div className="pr-4">
                  <div className="text-[10px] font-mono uppercase text-[#7C6624]">
                    {activeNote.file_type === 'pdf' ? 'PDF Document' : 'Study Note'}
                  </div>
                  <h3 className="text-base font-['Manrope'] font-semibold text-[#08291D] line-clamp-1">
                    {activeNote.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveNote(null)}
                  className="p-1 text-[#08291D]/60 hover:text-[#08291D] rounded-[3px] hover:bg-[#FAF9F6] transition-colors cursor-pointer"
                  aria-label="Close Note"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-5 overflow-y-auto flex-1 space-y-4 text-left">
                {activeNote.description && (
                  <p className="text-xs sm:text-sm text-[#4A6356] font-['Inter'] leading-relaxed whitespace-pre-wrap">
                    {activeNote.description}
                  </p>
                )}

                {activeNote.file_url && activeNote.file_type === 'pdf' && (
                  <div className="mt-3 border border-[#08291D]/10 rounded-[3px] overflow-hidden">
                    <iframe
                      src={activeNote.file_url}
                      className="w-full h-[450px] bg-[#FAF9F6]"
                      title={activeNote.title}
                    />
                  </div>
                )}
              </div>

              <div className="px-5 py-3 bg-[#FAF9F6] border-t border-[#08291D]/10 flex items-center justify-between text-xs">
                <span className="text-[#4A6356]">Advait Stock Market Academy • Protected Content</span>
                <div className="flex gap-2">
                  {activeNote.file_url && activeNote.file_type === 'pdf' && (
                    <a
                      href={activeNote.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-[#08291D] hover:bg-[#06261A] text-white font-medium rounded-[3px] transition-colors"
                    >
                      Download PDF
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => setActiveNote(null)}
                    className="px-3 py-1.5 bg-white border border-[#08291D]/15 text-[#08291D] font-medium rounded-[3px] hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default DashboardSection;