import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Helmet } from 'react-helmet-async';

const AdminVisitors = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('visitors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVisitors(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('visitors')
        .update({ status: newStatus })
        .eq('id', id);
        
      if (error) throw error;
      fetchVisitors();
    } catch (err) {
      alert("Error updating status: " + err.message);
    }
  };

  const filteredVisitors = visitors.filter(v => 
    v.name?.toLowerCase().includes(search.toLowerCase()) || 
    v.email?.toLowerCase().includes(search.toLowerCase()) ||
    v.phone?.includes(search)
  );

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <Helmet>
        <title>Manage Leads & Visitors - Admin</title>
      </Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Visitors & Leads</h1>
          <p className="text-sm text-text-secondary mt-1">Manage inquiries from the contact forms.</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <input 
            type="text" 
            placeholder="Search leads..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#166534] text-sm"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium">{error}</div>}

      {loading && visitors.length === 0 ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-[#166534] border-t-transparent rounded-full animate-spin"></div></div>
      ) : filteredVisitors.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <h3 className="text-lg font-bold text-text-primary">No leads found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredVisitors.map(visitor => (
            <div key={visitor.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
              <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
                <div>
                  <h3 className="font-bold text-lg text-text-primary">{visitor.name}</h3>
                  <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    {visitor.email}
                  </div>
                  <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    {visitor.phone}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400 font-medium mb-2">{new Date(visitor.created_at).toLocaleDateString()}</div>
                  <select 
                    value={visitor.status} 
                    onChange={(e) => updateStatus(visitor.id, e.target.value)}
                    className={`text-xs font-bold uppercase px-3 py-1.5 rounded-lg border-none focus:ring-0 ${
                      visitor.status === 'new' ? 'bg-blue-50 text-blue-600' :
                      visitor.status === 'contacted' ? 'bg-yellow-50 text-yellow-600' :
                      visitor.status === 'converted' ? 'bg-green-50 text-green-600' :
                      'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="converted">Converted</option>
                    <option value="closed">Closed / Not Interested</option>
                  </select>
                </div>
              </div>

              {visitor.interested_course && (
                <div className="mb-3 flex items-start gap-2">
                  <span className="text-xs font-bold text-gray-500 uppercase mt-0.5">Interest:</span>
                  <span className="text-sm font-medium text-[#166534] bg-[#166534]/10 px-2 py-0.5 rounded">{visitor.interested_course}</span>
                </div>
              )}

              {visitor.message && (
                <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-700 italic border border-gray-100">
                  "{visitor.message}"
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminVisitors;
