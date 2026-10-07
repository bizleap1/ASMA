import React from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Helmet } from 'react-helmet-async';
import AdminChangePasswordModal from './AdminChangePasswordModal';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPasswordModal, setShowPasswordModal] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Close mobile drawer on route change
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    navigate('/');
    setTimeout(async () => {
      await supabase.auth.signOut();
    }, 100);
  };

  const [pendingRequestsCount, setPendingRequestsCount] = React.useState(0);

  React.useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const { count, error } = await supabase
          .from('access_requests')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');
        if (!error && count !== null) {
          setPendingRequestsCount(count);
        }
      } catch (e) {
        console.warn("Could not fetch pending access requests count:", e);
      }
    };

    fetchPendingCount();
    const interval = setInterval(fetchPendingCount, 15000); // Check every 15s
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { name: 'Courses', path: '/admin/courses', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { name: 'Notes & PDFs', path: '/admin/notes', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { name: 'Access Requests', path: '/admin/access-requests', badge: pendingRequestsCount, icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' },
    { name: 'Enrollments', path: '/admin/enrollments', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { name: 'Inquiries', path: '/admin/visitors', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' }
  ];

  return (
    <div className="h-screen bg-[#faf8f5] flex text-text-primary selection:bg-accent-primary/20 font-sans">
      <Helmet>
        <title>ASMA Admin Panel</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar (Responsive: Fixed Drawer on mobile, Static sidebar on desktop) */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 md:w-64 bg-white border-r border-gray-100 shadow-2xl md:shadow-sm flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0 shrink-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-5 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center p-1 border border-gray-100 shadow-sm shrink-0">
              <img 
                src="/admin-logo.png" 
                alt="ASMA Logo" 
                className="w-full h-full object-contain" 
                onError={(e) => {
                  e.target.src = '/logo-dark.png';
                }} 
              />
            </div>
            <div>
              <div className="font-bold text-[#0B2117] text-base leading-tight tracking-tight">ASMA</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Admin Panel</div>
            </div>
          </div>

          {/* Close Button on Mobile Drawer */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
            title="Close menu"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm ${
                  isActive
                    ? 'bg-[#166534] text-white font-bold shadow-md shadow-green-900/20'
                    : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'
                }`
              }
            >
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              <span className="flex-1">{item.name}</span>
              {item.badge > 0 && (
                <span className="bg-amber-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-1">
          <button 
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              setShowPasswordModal(true);
            }}
            className="flex items-center gap-3 px-4 py-2.5 w-full text-left rounded-xl transition-all duration-200 font-semibold text-xs text-gray-700 hover:bg-gray-100 hover:text-black cursor-pointer"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Change Password</span>
          </button>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 w-full text-left rounded-xl transition-all duration-200 font-bold text-xs text-red-500 hover:bg-red-50 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 w-full overflow-hidden">
        {/* Mobile Header with Hamburger Menu Button */}
        <header className="md:hidden bg-white border-b border-gray-100 p-3.5 sm:p-4 flex items-center justify-between shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-1 text-gray-700 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-xl transition-colors cursor-pointer flex items-center justify-center shadow-xs"
              aria-label="Open sidebar menu"
              title="Open Navigation"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center p-0.5 border border-gray-100 shadow-sm shrink-0">
                <img src="/admin-logo.png" alt="ASMA" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="font-bold text-sm text-[#0B2117] leading-tight">ASMA</div>
                <div className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">Admin Panel</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowPasswordModal(true)} 
              className="p-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer" 
              title="Change Password"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </button>
            <button onClick={handleLogout} className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer" title="Logout">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-6 md:p-8 w-full max-w-full min-w-0">
          <Outlet />
        </div>
      </main>

      {/* Change Password Modal */}
      <AdminChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
};

export default AdminLayout;
