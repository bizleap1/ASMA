import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Helmet } from 'react-helmet-async';

const AdminEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('enrollments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEnrollments(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this enrollment? This will permanently assign a Student ID.")) return;
    try {
      // Call the secure RPC function to safely generate Student ID
      const { data, error } = await supabase.rpc('approve_enrollment', {
        enrollment_uuid: id
      });
      
      if (error) {
        if (error.message.includes("Could not find the function")) {
          throw new Error("RPC function 'approve_enrollment' not found. Please ensure the SQL migration was applied in Supabase.");
        }
        throw error;
      }
      
      alert(`Enrollment approved! Student ID generated: ${data}`);
      fetchEnrollments();
    } catch (err) {
      alert("Error approving enrollment: " + err.message);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this enrollment? It will remain in history.")) return;
    try {
      const { error } = await supabase
        .from('enrollments')
        .update({ 
          status: 'rejected',
          rejected_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) throw error;
      fetchEnrollments();
    } catch (err) {
      alert("Error rejecting enrollment: " + err.message);
    }
  };

  const filteredEnrollments = activeTab === 'all' 
    ? enrollments 
    : enrollments.filter(e => e.status === activeTab);

  const tabs = [
    { id: 'pending', label: 'Pending' },
    { id: 'approved', label: 'Approved' },
    { id: 'rejected', label: 'Rejected' },
    { id: 'all', label: 'All Enrollments' }
  ];

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <Helmet>
        <title>Manage Enrollments - Admin</title>
      </Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Enrollments</h1>
          <p className="text-sm text-text-secondary mt-1">Manage course requests and student IDs.</p>
        </div>
      </div>

      <div className="flex space-x-2 border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 font-bold text-sm transition-colors border-b-2 ${
              activeTab === tab.id 
                ? 'border-[#166534] text-[#166534]' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
            <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
              {tab.id === 'all' ? enrollments.length : enrollments.filter(e => e.status === tab.id).length}
            </span>
          </button>
        ))}
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium">{error}</div>}

      {loading && enrollments.length === 0 ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-[#166534] border-t-transparent rounded-full animate-spin"></div></div>
      ) : filteredEnrollments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <h3 className="text-lg font-bold text-text-primary">No enrollments found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEnrollments.map(enrollment => (
            <div key={enrollment.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={`px-3 py-1 rounded text-xs font-bold uppercase ${
                    enrollment.status === 'pending' ? 'bg-yellow-50 text-yellow-600' :
                    enrollment.status === 'approved' ? 'bg-green-50 text-green-600' :
                    'bg-red-50 text-red-600'
                  }`}>
                    {enrollment.status}
                  </span>
                </div>
                <div className="text-xs font-medium text-gray-400">
                  {new Date(enrollment.created_at).toLocaleDateString()}
                </div>
              </div>

              {enrollment.student_id && (
                <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-200 text-center">
                  <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Student ID</div>
                  <div className="text-lg font-bold text-[#166534]">{enrollment.student_id}</div>
                </div>
              )}

              <div className="space-y-2 mb-6">
                <div>
                  <div className="text-xs text-gray-500 font-bold uppercase">Student</div>
                  <div className="font-medium text-text-primary">{enrollment.student_name}</div>
                  <div className="text-sm text-gray-500">{enrollment.email}</div>
                  <div className="text-sm text-gray-500">{enrollment.phone}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-bold uppercase mt-3">Course</div>
                  <div className="font-medium text-text-primary">{enrollment.course_name}</div>
                </div>
                {enrollment.notes && (
                  <div>
                    <div className="text-xs text-gray-500 font-bold uppercase mt-3">Notes</div>
                    <div className="text-sm text-gray-600 italic bg-gray-50 p-2 rounded">{enrollment.notes}</div>
                  </div>
                )}
              </div>

              {enrollment.status === 'pending' && (
                <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100">
                  <button onClick={() => handleApprove(enrollment.id)} className="flex-1 bg-[#166534] hover:bg-green-800 text-white py-2.5 rounded-xl font-bold shadow-md transition-colors">Approve</button>
                  <button onClick={() => handleReject(enrollment.id)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-xl font-bold transition-colors">Reject</button>
                </div>
              )}
              
              {enrollment.status === 'approved' && enrollment.auth_user_id && (
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <Link 
                    to={`/admin/enrollments/${enrollment.id}/student-view`}
                    className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 rounded-xl font-bold transition-colors"
                  >
                    View Student Dashboard
                  </Link>
                </div>
              )}

              {!enrollment.auth_user_id && (
                <div className="mt-auto pt-4 border-t border-gray-100 text-center">
                  <p className="text-xs text-gray-500 font-medium italic">Guest lead — no student account linked</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminEnrollments;
