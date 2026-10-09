import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import TopNav from './components/TopNav';
import PageHero from './components/PageHero';
import MultiChartSection from './components/MultiChartSection';
import AboutSection from './components/AboutSection';
import AchievementsSection from './components/AchievementsSection';
import MissionVisionSection from './components/MissionVisionSection';
import CoreValuesSection from './components/CoreValuesSection';
import ServiceDetailsPage from './pages/ServiceDetailsPage';
import ServicesPageSection from './pages/ServicesPageSection';
import CoursesSection from './pages/CoursesSection';
import CourseDetailsPage from './pages/CourseDetailsPage';
import GallerySection from './pages/GallerySection';
import ContactSection from './pages/ContactSection';
import FooterSection from './components/FooterSection';
import PrivacyPolicySection from './pages/PrivacyPolicySection';
import TermsConditionsSection from './pages/TermsConditionsSection';
import BlogPageSection from './pages/BlogPageSection';
import BlogPostSection from './pages/BlogPostSection';
import Home from './pages/Home';
import PageWrapper from './components/PageWrapper';
import MarketNewsSection from './components/MarketNewsSection';
import LoginPageSection from './pages/LoginPageSection';
import DashboardSection from './pages/DashboardSection';
import ScrollToTop from './components/ScrollToTop';
import FaqSection from './components/FaqSection';
import { analysisFaqs, servicesFaqs, aboutContactFaqs } from './data';
import NotFound from './pages/NotFound';

// Admin Imports
import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/AdminLogin';
import ProtectedRoute from './admin/ProtectedRoute';
import AdminCourses from './admin/AdminCourses';
import AdminNotes from './admin/AdminNotes';
import AdminAccessRequests from './admin/AdminAccessRequests';
import AdminEnrollments from './admin/AdminEnrollments';
import AdminVisitors from './admin/AdminVisitors';
import AdminStudentPreview from './admin/AdminStudentPreview';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'pearl');
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-500 bg-bg-primary text-text-primary selection:bg-accent-primary/20 selection:text-text-primary scroll-smooth overflow-x-hidden">
      <ScrollToTop />
      
      {!isAdminRoute && <TopNav />}
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/analysis" element={<PageWrapper seoTitle="Live Nifty & Sensex Charts and Market News | ASMA" seoDesc="Track Nifty, Bank Nifty and Sensex on live charts and read today's market news, curated by Advait Stock Market Academy, Nagpur." backHash="#analysis"><PageHero title="Analysis" subtitle="Real-time data, institutional insights, and proprietary technical sentiment." image="/hero_analysis_bg.png" tag="Market Intelligence" /><MarketNewsSection /><MultiChartSection /><FaqSection faqs={analysisFaqs} /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper seoTitle="About ASMA – Stock Market Trainers in Nagpur" seoDesc="Meet founder Satish Bobade and trainers behind Advait Stock Market Academy, Nagpur — our story, teaching approach and 20+ years of market experience." seoKeywords="about advait academy, stock market experts, trading academy background" backHash="#about" schema={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "mainEntity": {
            "@type": "EducationalOrganization",
            "name": "Advait Stock Market Academy",
            "founder": {
              "@type": "Person",
              "name": "Satish Bobade",
              "jobTitle": "Founder"
            }
          }
        }}><PageHero title="About Us" subtitle="Learn about our journey, our mission, and the experts behind Advait." image="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1920&auto=format&fit=crop" tag="Our Story" /><AboutSection hideExploreButton={true} /><AchievementsSection /><MissionVisionSection /><CoreValuesSection /><FaqSection faqs={aboutContactFaqs} /></PageWrapper>} />
        <Route path="/services" element={<PageWrapper seoTitle="Trading & Investment Education Services | ASMA Nagpur" seoDesc="Explore comprehensive trading and investment education services in Nagpur: technical analysis, derivatives, market psychology, and portfolio guidance." seoKeywords="portfolio management, stock advisory, trading services India" backHash="#services"><PageHero title="Services" subtitle="Comprehensive financial services designed to elevate your trading journey." image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1920&auto=format&fit=crop" tag="What We Offer" /><ServicesPageSection /><FaqSection faqs={servicesFaqs} /></PageWrapper>} />
        <Route path="/service/:serviceId" element={<ServiceDetailsPage />} />
        <Route path="/courses" element={<PageWrapper seoTitle="Stock Market Courses in Nagpur – Fees & Batches | ASMA" seoDesc="Compare ASMA's Advanced Foundation and Professional Master Program: syllabus, duration, fees and upcoming offline and online batches in Nagpur." seoKeywords="technical analysis course, options trading course, learn stock market" backHash="#courses"><PageHero title="Courses" subtitle="Master the stock market with our expertly crafted educational programs." image="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1920&auto=format&fit=crop" tag="Education" /><CoursesSection isCoursesPage={true} /></PageWrapper>} />
        <Route path="/course/:courseId" element={<CourseDetailsPage />} />
        <Route path="/gallery" element={<PageWrapper seoTitle="Classroom & Events Gallery | ASMA Nagpur" seoDesc="Photos of ASMA's Nagpur classroom, live trading sessions, workshops, student community, and campus events." backHash="#gallery"><PageHero title="Gallery" subtitle="A glimpse into our events, seminars, and academy culture." image="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1920&auto=format&fit=crop" tag="Our Community" /><GallerySection isGalleryPage={true} /></PageWrapper>} />
        <Route path="/contact" element={<PageWrapper seoTitle="Contact ASMA – Besa–Pipla Road, Nagpur" seoDesc="Visit or call Advait Stock Market Academy, Plot 28, Oshian SuperCity 3, Besa–Pipla Road, Nagpur. Open daily 8 AM–10 PM. Phone: +91 91569 53895." seoKeywords="contact trading academy, stock market institute near me" backHash="#contact"><PageHero title="Contact Us" subtitle="Get in touch with our experts. We're here to help you succeed." image="https://images.unsplash.com/photo-1516387938699-a93567ec168e?q=80&w=1920&auto=format&fit=crop" tag="Get in Touch" /><ContactSection isContactPage={true} /><FaqSection faqs={aboutContactFaqs} /></PageWrapper>} />
        <Route path="/blog" element={<PageWrapper seoTitle="Stock Market Learning Blog | ASMA Nagpur" seoDesc="Practical guides on technical analysis, risk management, F&O and investing from the mentors at Advait Stock Market Academy." backHash="#home"><PageHero title="Academy Blog" subtitle="Insights, strategies, and tutorials from stock market experts." image="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1920&auto=format&fit=crop" tag="Learning Hub" /><BlogPageSection /></PageWrapper>} />
        <Route path="/blog/:id" element={<BlogPostSection />} />
        <Route path="/dashboard" element={<PageWrapper seoTitle="Student Dashboard | ASMA" noindex={true} backHash="#home"><PageHero title="Student Dashboard" subtitle="Manage your courses, profile, and progress." image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1920&auto=format&fit=crop" tag="Dashboard" /><DashboardSection /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper seoTitle="Student Login | ASMA" seoDesc="Log in to access your ASMA student dashboard and course materials." noindex={true} backHash="#home"><PageHero title="Login" subtitle="Access your student dashboard and learning materials." image="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1920&auto=format&fit=crop" tag="Account" /><LoginPageSection /></PageWrapper>} />
        <Route path="/privacy" element={<PageWrapper seoTitle="Privacy Policy | Advait Stock Market Academy" seoDesc="How Advait Stock Market Academy (ASMA) collects, uses, and protects personal data." backHash="#home"><PageHero title="Privacy Policy" subtitle="How we handle and protect your personal data." image="/Home/4.png" tag="Legal" /><PrivacyPolicySection /></PageWrapper>} />
        <Route path="/terms" element={<PageWrapper seoTitle="Terms & Conditions | Advait Stock Market Academy" seoDesc="Terms and conditions for enrolling and training at Advait Stock Market Academy, Nagpur." backHash="#home"><PageHero title="Terms and Conditions" subtitle="Rules and regulations for the use of our website." image="/Home/5.png" tag="Legal" /><TermsConditionsSection /></PageWrapper>} />
        <Route path="*" element={<NotFound />} />
      
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="courses" replace />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="notes" element={<AdminNotes />} />
            <Route path="access-requests" element={<AdminAccessRequests />} />
            <Route path="enrollments" element={<AdminEnrollments />} />
            <Route path="enrollments/:enrollmentId/student-view" element={<AdminStudentPreview />} />
            <Route path="visitors" element={<AdminVisitors />} />
          </Route>
        </Route>
      </Routes>
      
      {!isAdminRoute && <FooterSection />}

      {/* Floating WhatsApp Button */}
      {!isAdminRoute && (
        <a
          href="https://wa.me/919156953895?text=Hi%20Advait%20Academy!%20I%20want%20to%20inquire%20about%20your%20courses."
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-[#25D366]/40 hover:scale-110 active:scale-95 transition-all duration-300 group"
          aria-label="Chat on WhatsApp"
        >
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25 group-hover:opacity-0 transition-opacity"></span>
          <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.66.986 3.292 1.493 4.9 1.495 5.429.001 9.85-4.417 9.853-9.848.001-2.633-1.025-5.101-2.871-6.948C16.62 1.997 14.161.98 11.536.98c-5.433 0-9.854 4.416-9.857 9.847-.001 1.93.515 3.501 1.49 5.093l-.989 3.616 3.733-.972.144.086zm11.352-7.147c-.287-.143-1.698-.838-1.96-.934-.263-.096-.454-.143-.645.143-.19.287-.738.934-.905 1.123-.166.19-.333.214-.62.071-.287-.143-1.21-.446-2.305-1.424-.853-.76-1.429-1.698-1.596-1.983-.167-.287-.018-.441.125-.583.129-.127.287-.335.43-.502.143-.167.19-.287.287-.477.096-.19.048-.358-.024-.502-.071-.143-.645-1.551-.884-2.123-.233-.56-.47-.482-.645-.49-.167-.008-.358-.01-.55-.01-.19 0-.501.071-.763.358-.262.287-1.002.979-1.002 2.387 0 1.408 1.026 2.768 1.17 2.96.143.19 2.019 3.084 4.891 4.324.683.294 1.217.47 1.633.603.687.218 1.312.187 1.806.114.549-.08 1.697-.693 1.937-1.362.24-.668.24-1.24.167-1.362-.072-.122-.263-.215-.55-.357z" />
          </svg>
          <span className="absolute right-full mr-3 bg-text-primary text-white text-xs font-bold py-2 px-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-xl whitespace-nowrap border border-white/10">
            Chat with us
          </span>
        </a>
      )}
    </div>
  );
}

export default App;