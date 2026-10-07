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

  const handleRemoveStudentId = async (id) => {
    try {
      const { error } = await supabase
        .from('enrollments')
        .update({ student_id: null })
        .eq('id', id);
        
      if (error) throw error;
      fetchEnrollments();
    } catch (err) {
      alert("Error removing Student ID: " + err.message);
    }
  };

  const handleRegenerateStudentId = async (id) => {
    if (!window.confirm("Generate a new Student ID for this enrollment?")) return;
    try {
      // Temporarily set status to pending to bypass the RPC's "Already approved" check
      const { error: resetError } = await supabase
        .from('enrollments')
        .update({ status: 'pending' })
        .eq('id', id);
        
      if (resetError) throw resetError;

      const { data, error } = await supabase.rpc('approve_enrollment', {
        enrollment_uuid: id
      });
      
      if (error) {
        // Revert back to approved if it fails
        await supabase.from('enrollments').update({ status: 'approved' }).eq('id', id);
        throw error;
      }
      
      alert(`New Student ID generated: ${data}`);
      fetchEnrollments();
    } catch (err) {
      alert("Error generating student ID: " + err.message);
    }
  };

  const handleDeleteEnrollment = async (id, studentName) => {
    if (!window.confirm(`Are you sure you want to completely delete the enrollment for ${studentName}? This action cannot be undone.`)) return;
    
    const confirmText = window.prompt(`Please type DELETE to confirm the deletion of ${studentName}'s enrollment:`);
    if (confirmText !== "DELETE") {
      alert("Deletion cancelled. You didn't type DELETE.");
      return;
    }

    try {
      const { error } = await supabase
        .from('enrollments')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      fetchEnrollments();
    } catch (err) {
      alert("Error deleting enrollment: " + err.message);
    }
  };

  const filteredEnrollments = activeTab === 'all' 
    ? enrollments 
    : enrollments.filter(e => e.status === activeTab);

  const tabs = [
    { id: 'pending', label: 'Pending Approvals', count: enrollments.filter(e => e.status === 'pending').length },
    { id: 'approved', label: 'Active Students', count: enrollments.filter(e => e.status === 'approved').length },
    { id: 'rejected', label: 'Rejected', count: enrollments.filter(e => e.status === 'rejected').length },
    { id: 'all', label: 'All Enrollments', count: enrollments.length }
  ];

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <Helmet>
        <title>Manage Enrollments - Admin</title>
      </Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Enrollments</h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">Manage course requests and student IDs.</p>
        </div>
      </div>

      {/* Tabs with smooth horizontal scroll on mobile */}
      <div className="flex space-x-2 border-b border-gray-200 overflow-x-auto pb-1 scrollbar-none no-scrollbar -mx-1 px-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 sm:px-4 py-2.5 sm:py-3 font-bold text-xs sm:text-sm transition-colors border-b-2 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === tab.id 
                ? 'border-[#166534] text-[#166534]' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <span>{tab.label}</span>
            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-bold">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium">{error}</div>}

      {loading && enrollments.length === 0 ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-[#166534] border-t-transparent rounded-full animate-spin"></div></div>
      ) : filteredEnrollments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 sm:p-12 text-center shadow-sm">
          <h3 className="text-lg font-bold text-text-primary">No enrollments found</h3>
        </div>
      ) : (
        <div className="flex flex-col gap-3 sm:gap-4">
          {filteredEnrollments.map(enrollment => {
            let noteText = enrollment.notes;
            try {
              const parsed = JSON.parse(enrollment.notes);
              if (parsed && typeof parsed === 'object') {
                noteText = parsed.text || 'Attached PDF';
              }
            } catch (e) {}

            return (
              <div key={enrollment.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-6 hover:shadow-md transition-shadow w-full max-w-full min-w-0 overflow-hidden">
                
                {/* Status & Date */}
                <div className="flex flex-row lg:flex-col items-center lg:items-start justify-between w-full lg:w-28 shrink-0 pb-2.5 lg:pb-0 border-b lg:border-b-0 border-gray-100">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider w-max ${
                    enrollment.status === 'pending' ? 'bg-yellow-50 text-yellow-600 border border-yellow-200' :
                    enrollment.status === 'approved' ? 'bg-green-50 text-green-700 border border-green-200' :
                    'bg-red-50 text-red-600 border border-red-200'
                  }`}>
                    {enrollment.status}
                  </span>
                  <div className="text-xs font-medium text-gray-400">
                    {new Date(enrollment.created_at).toLocaleDateString()}
                  </div>
                </div>

                {/* Student Details */}
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Student</div>
                  <div className="font-bold text-text-primary text-sm sm:text-base leading-tight truncate">{enrollment.student_name}</div>
                  <div className="text-xs text-gray-500 mt-0.5 break-all sm:truncate">{enrollment.email}</div>
                  <div className="text-xs text-gray-400">{enrollment.phone}</div>
                </div>

                {/* Course */}
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Course</div>
                  <div className="font-medium text-text-primary text-xs sm:text-sm line-clamp-2">{enrollment.course_name || 'General Registration'}</div>
                  {noteText && (
                    <div className="text-[10px] text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded mt-1 truncate max-w-full">
                      Note: {noteText}
                    </div>
                  )}
                </div>

                {/* Student ID */}
                <div className="w-full lg:w-auto lg:min-w-[130px] flex flex-row lg:flex-col items-center lg:items-start justify-between">
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Student ID</div>
                  {enrollment.student_id ? (
                    <div className="flex items-center gap-2">
                      <div className="font-bold text-[#166534] bg-[#166534]/10 border border-[#166534]/20 px-2 py-0.5 rounded-md text-xs sm:text-sm">{enrollment.student_id}</div>
                      <button 
                        onClick={() => handleRemoveStudentId(enrollment.id)}
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-colors cursor-pointer"
                        title="Remove Student ID"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 italic">Unassigned</span>
                      {enrollment.status === 'approved' && (
                        <button 
                          onClick={() => handleRegenerateStudentId(enrollment.id)}
                          className="text-[#166534] hover:text-green-800 hover:bg-green-50 p-1 rounded transition-colors cursor-pointer"
                          title="Generate Student ID"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto shrink-0 justify-end pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                  {enrollment.status === 'pending' && (
                    <>
                      <button onClick={() => handleApprove(enrollment.id)} className="flex-1 sm:flex-none px-4 py-2 bg-[#166534] hover:bg-green-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-green-900/20 transition-all cursor-pointer text-center">Approve</button>
                      <button onClick={() => handleReject(enrollment.id)} className="flex-1 sm:flex-none px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer text-center">Reject</button>
                    </>
                  )}
                  
                  {enrollment.status === 'approved' && enrollment.auth_user_id && (
                    <Link 
                      to={`/admin/enrollments/${enrollment.id}/student-view`}
                      className="flex-1 sm:flex-none px-4 py-2 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      Preview
                    </Link>
                  )}

                  {!enrollment.auth_user_id && enrollment.status !== 'pending' && (
                    <span className="text-xs text-gray-500 font-medium italic self-center px-2">Guest Lead</span>
                  )}
                  
                  {/* Delete Button */}
                  <button 
                    onClick={() => handleDeleteEnrollment(enrollment.id, enrollment.student_name)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                    title="Delete Enrollment Completely"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminEnrollments;
