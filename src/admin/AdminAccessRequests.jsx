import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Helmet } from 'react-helmet-async';

const AdminAccessRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'approved', 'rejected', 'all'
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('access_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (err) {
      console.error("Error fetching access requests:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, itemTitle, studentName) => {
    try {
      setActionLoading(id);
      const { error } = await supabase
        .from('access_requests')
        .update({ status: 'approved', updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      alert(`Access granted for "${itemTitle}" to ${studentName}! The student can now download/open this note.`);
      fetchRequests();
    } catch (err) {
      alert("Error approving request: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this access request?")) return;
    try {
      setActionLoading(id);
      const { error } = await supabase
        .from('access_requests')
        .update({ status: 'rejected', updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      fetchRequests();
    } catch (err) {
      alert("Error rejecting request: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this request?")) return;
    try {
      setActionLoading(id);
      const { error } = await supabase
        .from('access_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchRequests();
    } catch (err) {
      alert("Error deleting request: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Filter requests by tab and search
  const filteredRequests = requests.filter(req => {
    const matchesTab = activeTab === 'all' || req.status === activeTab;
    const matchesSearch = 
      (req.student_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.student_email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.item_title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.student_id || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;

  const tabs = [
    { id: 'pending', label: 'Pending Requests', shortLabel: 'Pending', count: pendingCount, highlight: pendingCount > 0 },
    { id: 'approved', label: 'Granted / Approved', shortLabel: 'Approved', count: approvedCount },
    { id: 'rejected', label: 'Rejected', shortLabel: 'Rejected', count: rejectedCount },
    { id: 'all', label: 'All Requests', shortLabel: 'All', count: requests.length },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in font-sans">
      <Helmet>
        <title>Notes Access Requests - ASMA Admin</title>
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Notes Access Requests</h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">Review student requests and grant access to study notes & materials.</p>
        </div>
        <button 
          onClick={fetchRequests} 
          className="px-3.5 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-bold transition-colors border border-gray-200 flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          Refresh
        </button>
      </div>

      {/* Stats Cards - Compact 3 columns on mobile, full on desktop */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="bg-white p-3 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0">
          <div className="min-w-0">
            <div className="text-[10px] sm:text-xs font-bold text-amber-600 uppercase tracking-wider truncate">
              <span className="hidden sm:inline">Pending Action</span>
              <span className="sm:hidden">Pending</span>
            </div>
            <div className="text-lg sm:text-3xl font-extrabold text-text-primary mt-0.5 sm:mt-1">{pendingCount}</div>
          </div>
          <div className="w-7 h-7 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs sm:text-base shrink-0 self-end sm:self-auto">
            ⏳
          </div>
        </div>

        <div className="bg-white p-3 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0">
          <div className="min-w-0">
            <div className="text-[10px] sm:text-xs font-bold text-green-700 uppercase tracking-wider truncate">
              <span className="hidden sm:inline">Active Permissions</span>
              <span className="sm:hidden">Approved</span>
            </div>
            <div className="text-lg sm:text-3xl font-extrabold text-text-primary mt-0.5 sm:mt-1">{approvedCount}</div>
          </div>
          <div className="w-7 h-7 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-green-50 text-green-700 flex items-center justify-center font-bold text-xs sm:text-base shrink-0 self-end sm:self-auto">
            🔓
          </div>
        </div>

        <div className="bg-white p-3 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0">
          <div className="min-w-0">
            <div className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider truncate">
              <span className="hidden sm:inline">Total Handled</span>
              <span className="sm:hidden">Total</span>
            </div>
            <div className="text-lg sm:text-3xl font-extrabold text-text-primary mt-0.5 sm:mt-1">{requests.length}</div>
          </div>
          <div className="w-7 h-7 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gray-50 text-gray-600 flex items-center justify-center font-bold text-xs sm:text-base shrink-0 self-end sm:self-auto">
            📋
          </div>
        </div>
      </div>

      {/* Search and Responsive Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 sm:gap-4">
        {/* Modern Pill Tabs with horizontal touch scroll */}
        <div className="flex items-center gap-1 sm:gap-1.5 p-1 bg-gray-100/80 rounded-2xl overflow-x-auto scrollbar-none touch-pan-x w-full md:w-auto shrink-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === tab.id 
                  ? 'bg-[#166534] text-white shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
              }`}
            >
              <span>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </span>
              <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-extrabold ${
                activeTab === tab.id
                  ? 'bg-white/20 text-white'
                  : tab.highlight
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-white text-gray-600 shadow-2xs'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-auto md:min-w-[260px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student or note..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-[#166534] transition-colors shadow-sm"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium">{error}</div>}

      {/* Requests List */}
      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-[#166534] border-t-transparent rounded-full animate-spin"></div></div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 sm:p-12 text-center shadow-sm">
          <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h3 className="text-lg font-bold text-text-primary">No requests found</h3>
          <p className="text-sm text-gray-500 mt-1">
            {activeTab === 'pending' ? 'Great! There are no pending access requests at the moment.' : 'No access requests matching your filters.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 sm:gap-4">
          {filteredRequests.map(req => {
            const isActing = actionLoading === req.id;
            return (
              <div key={req.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 flex flex-col gap-3.5 hover:shadow-md transition-shadow w-full max-w-full min-w-0">
                
                {/* Header: Status, Request Category, Date */}
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                      req.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      req.status === 'approved' ? 'bg-green-50 text-green-700 border border-green-200' :
                      'bg-red-50 text-red-600 border border-red-200'
                    }`}>
                      {req.status === 'approved' ? '✓ Note Unlocked' : req.status === 'pending' ? '⏳ Note Access Requested' : '✕ Note Access Denied'}
                    </span>
                    <span className="text-[10px] font-semibold text-gray-400 hidden sm:inline">
                      Single Note Permission
                    </span>
                  </div>
                  <div className="text-xs font-medium text-gray-400">
                    {new Date(req.created_at).toLocaleDateString()}
                  </div>
                </div>

                {/* Requested Note Highlight Card (Central Subject) */}
                <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-3 sm:p-3.5 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100/80 text-amber-800 flex items-center justify-center shrink-0 font-bold text-lg shadow-2xs">
                    📄
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded">
                        Requested Note
                      </span>
                      <span className="text-[10px] font-bold uppercase text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                        {req.item_type || 'PDF Document'}
                      </span>
                    </div>
                    <div className="font-extrabold text-sm sm:text-base text-gray-900 mt-1 leading-snug">
                      "{req.item_title}"
                    </div>
                    <p className="text-[11px] text-amber-900/80 mt-1 leading-relaxed">
                      Permission is granted <strong className="font-bold underline decoration-amber-400">only for this specific note</strong>.
                    </p>
                  </div>
                </div>

                {/* Student Information Box */}
                <div className="bg-gray-50/70 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-gray-100 text-xs">
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Requested by Student</div>
                    <div className="font-bold text-gray-900 text-sm truncate flex items-center gap-1.5">
                      <span>👤</span>
                      <span>{req.student_name}</span>
                    </div>
                    <div className="text-gray-500 text-xs truncate mt-0.5">{req.student_email}</div>
                  </div>
                  {req.student_id ? (
                    <div className="shrink-0 self-start sm:self-center">
                      <span className="text-[11px] font-mono font-bold text-[#166534] bg-green-50 border border-green-200 px-2 py-1 rounded-lg">
                        ID: {req.student_id}
                      </span>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400 italic">No Student ID</div>
                  )}
                </div>

                {/* Actions with Clear Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  {req.status === 'pending' ? (
                    <>
                      <button 
                        onClick={() => handleApprove(req.id, req.item_title, req.student_name)}
                        disabled={isActing}
                        className="flex-1 px-4 py-2.5 bg-[#166534] hover:bg-green-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-green-900/15 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <span>Approve Note Access 🔓</span>
                      </button>
                      <button 
                        onClick={() => handleReject(req.id)}
                        disabled={isActing}
                        className="flex-1 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer disabled:opacity-50 text-center"
                      >
                        Reject Request
                      </button>
                    </>
                  ) : req.status === 'approved' ? (
                    <button 
                      onClick={() => handleReject(req.id)}
                      disabled={isActing}
                      className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer disabled:opacity-50 text-center"
                    >
                      Lock / Revoke Access
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleApprove(req.id, req.item_title, req.student_name)}
                      disabled={isActing}
                      className="flex-1 px-4 py-2.5 bg-green-50 hover:bg-green-100 text-[#166534] rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer disabled:opacity-50 text-center"
                    >
                      Re-Approve Note 🔓
                    </button>
                  )}

                  <button 
                    onClick={() => handleDelete(req.id)}
                    disabled={isActing}
                    className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                    title="Delete Request"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
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

export default AdminAccessRequests;
