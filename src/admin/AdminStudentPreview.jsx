import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const AdminStudentPreview = () => {
  const { enrollmentId } = useParams();
  const [enrollment, setEnrollment] = useState(null);
  const [studentEnrollments, setStudentEnrollments] = useState([]);
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // 1. Fetch the specific enrollment to get auth_user_id
        const { data: currentEnrollment, error: fetchErr } = await supabase
          .from('enrollments')
          .select('*')
          .eq('id', enrollmentId)
          .single();
        
        if (fetchErr) throw fetchErr;
        setEnrollment(currentEnrollment);

        if (currentEnrollment.auth_user_id) {
          // 2. Fetch all enrollments for this student
          const { data: allEnrollments, error: allErr } = await supabase
            .from('enrollments')
            .select('*, courses(*)')
            .eq('auth_user_id', currentEnrollment.auth_user_id)
            .order('created_at', { ascending: false });
          
          if (allErr) throw allErr;
          setStudentEnrollments(allEnrollments || []);

          // 3. Fetch Notes for approved courses
          const approvedCourseIds = (allEnrollments || [])
            .filter(e => e.status === 'approved' && e.course_id)
            .map(e => e.course_id);

          if (approvedCourseIds.length > 0) {
            const { data: notesData, error: notesError } = await supabase
              .from('notes')
              .select('*')
              .eq('is_active', true)
              .in('course_id', approvedCourseIds)
              .order('display_order', { ascending: true });
            
            if (notesError) throw notesError;
            setNotes(notesData || []);
          }
        }
      } catch (error) {
        console.error("Error fetching student preview data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudentData();
  }, [enrollmentId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-[#166534] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!enrollment) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Enrollment not found</h3>
        <Link to="/admin/enrollments" className="text-[#166534] hover:underline">Back to Enrollments</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Student Dashboard Preview</h2>
          <p className="text-gray-500 text-sm">Viewing as {enrollment.student_name} ({enrollment.email})</p>
        </div>
        <Link to="/admin/enrollments" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
          Back to Enrollments
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="mb-8 border-b pb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Student Enrollments</h3>
          {studentEnrollments.length === 0 ? (
            <p className="text-gray-500 text-sm">No enrollments found for this student.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {studentEnrollments.map(e => (
                <div key={e.id} className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-900">{e.course_name}</h4>
                    <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${
                      e.status === 'approved' ? 'bg-green-100 text-green-700' :
                      e.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {e.status}
                    </span>
                  </div>
                  {e.student_id && (
                    <p className="text-xs text-gray-500">Student ID: <span className="font-mono text-[#166534] font-bold">{e.student_id}</span></p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4">Accessible Notes</h3>
          {notes.length === 0 ? (
            <p className="text-gray-500 text-sm">No notes accessible to this student yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {notes.map(note => (
                <div key={note.id} className="p-4 border rounded-lg bg-gray-50 flex flex-col">
                  <h4 className="font-bold text-gray-900 mb-1">{note.title}</h4>
                  <p className="text-xs text-gray-500 mb-2 line-clamp-2">{note.description}</p>
                  <div className="mt-auto">
                    <span className="text-xs font-bold text-[#166534] uppercase">{note.file_type} Resource</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminStudentPreview;
