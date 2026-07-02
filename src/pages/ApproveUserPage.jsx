import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import AnimatedSection from '../components/AnimatedSection';

const ApproveUserPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [message, setMessage] = useState('Approving user...');

  useEffect(() => {
    const approveUser = async () => {
      const uid = searchParams.get('uid');
      const token = searchParams.get('token');

      if (!uid || !token) {
        setStatus('error');
        setMessage('Invalid approval link. Missing user ID or token.');
        return;
      }

      try {
        // Call the secure Supabase function
        const { data, error } = await supabase.rpc('approve_user_via_token', {
          p_user_id: uid,
          p_token: token
        });

        if (error) {
          throw error;
        }

        if (data === true) {
          setStatus('success');
          setMessage('User has been successfully approved!');
          
          // Fetch user's email to send them a notification
          const { data: profile } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', uid)
            .single();

          if (profile?.email) {
            // Send confirmation email to the student via Edge Function
            supabase.functions.invoke('send-approval-email', {
              body: { 
                email: profile.email, 
                type: 'student-success' 
              }
            }).catch(err => console.error("Failed to send notification email to student:", err));
          }
        } else {
          setStatus('error');
          setMessage('Approval failed. The link might be expired, invalid, or the user is already approved.');
        }
      } catch (err) {
        console.error(err);
        setStatus('error');
        setMessage('An error occurred during approval: ' + err.message);
      }
    };

    approveUser();
  }, [searchParams]);

  return (
    <AnimatedSection className="py-20 min-h-[60vh] flex items-center justify-center relative bg-bg-secondary/10">
      <div className="container mx-auto px-4 relative z-10 flex justify-center">
        <div className="w-full max-w-md bg-white rounded-[32px] p-8 md:p-12 shadow-2xl border border-text-primary/5 text-center">
          
          {status === 'loading' && (
            <div className="animate-pulse space-y-4">
              <div className="w-16 h-16 bg-accent-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h2 className="text-2xl font-bold text-text-primary">{message}</h2>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center text-green-600">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-3xl font-display font-bold text-text-primary">Approved!</h2>
              <p className="text-text-secondary">{message}</p>
              <Link to="/" className="inline-block mt-4 px-6 py-3 bg-text-primary text-white font-bold rounded-xl hover:bg-accent-primary transition-colors">
                Return to Home
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-6">
              <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center text-red-600">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </div>
              <h2 className="text-3xl font-display font-bold text-text-primary">Error</h2>
              <p className="text-red-500 text-sm font-medium">{message}</p>
              <Link to="/" className="inline-block mt-4 px-6 py-3 bg-text-primary text-white font-bold rounded-xl hover:bg-accent-primary transition-colors">
                Return to Home
              </Link>
            </div>
          )}

        </div>
      </div>
    </AnimatedSection>
  );
};

export default ApproveUserPage;
