import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkAdmin = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          if (isMounted) {
            setIsAdmin(false);
            setLoading(false);
          }
          return;
        }

        // Verify if user is in the admins table by email
        const { data, error } = await supabase
          .from('admins')
          .select('email')
          .eq('email', session.user.email)
          .single();

        if (isMounted) {
          if (data && !error) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
            // Optionally sign them out if they tried to access admin
            // await supabase.auth.signOut();
          }
          setLoading(false);
        }
      } catch (err) {
        console.error("Error checking admin status:", err);
        if (isMounted) {
          setIsAdmin(false);
          setLoading(false);
        }
      }
    };

    checkAdmin();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setIsAdmin(false);
      } else {
        checkAdmin();
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-[#166534] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
