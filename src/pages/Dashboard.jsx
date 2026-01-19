import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Shield, FileText, Calendar, MapPin, Clock, Download } from 'lucide-react';
import { supabase } from '../supabase';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
        fetchReports();
    }
  }, [user]);

  const fetchReports = async () => {
    try {
        const { data, error } = await supabase
            .from('reports')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        setReports(data || []);
    } catch (error) {
        console.error('Error fetching reports:', error);
    } finally {
        setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Status Badge Helper
  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
        case 'resolved':
        case 'solved':
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Solved</span>;
        case 'processing':
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Processing</span>;
        case 'rejected':
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Rejected</span>;
        default:
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
    }
  };

  const downloadPDF = (reportId) => {
    window.open(`http://localhost:4000/api/reports/${reportId}/pdf`, '_blank');
  };


  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          {/* Header */}
          <div className="px-6 py-8 border-b border-slate-100 bg-emerald-600">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                    <User className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white font-heading">User Dashboard</h1>
                    <p className="text-emerald-100 mt-1">Manage your account and view reports</p>
                </div>
                </div>
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-medium text-sm border border-white/20"
                >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign Out</span>
                </button>
            </div>
          </div>

          {/* Account Details */}
          <div className="p-6 sm:p-8 border-b border-slate-100">
             <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                Account Details
              </h2>
              <div className="bg-slate-50 rounded-xl p-4 sm:p-6 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                    <p className="text-sm font-medium text-slate-500">Email Address</p>
                    <p className="mt-1 text-sm text-slate-900 font-mono">{user?.email}</p>
                 </div>
                 <div>
                    <p className="text-sm font-medium text-slate-500">User ID</p>
                    <p className="mt-1 text-xs text-slate-500 font-mono break-all">{user?.id}</p>
                 </div>
              </div>
          </div>
        </div>

        {/* Reports History */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="px-6 py-6 border-b border-slate-100 flex items-center justify-between">
                 <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-600" />
                    My Reports
                 </h2>
                 <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-full text-xs font-semibold">{reports.length} Reports</span>
             </div>

             {loading ? (
                 <div className="p-8 text-center text-slate-500">Loading reports...</div>
             ) : reports.length === 0 ? (
                 <div className="p-12 text-center">
                     <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                         <FileText className="w-8 h-8 text-slate-300" />
                     </div>
                     <h3 className="text-lg font-medium text-slate-900">No reports yet</h3>
                     <p className="text-slate-500 mt-1">You haven't submitted any reports yet.</p>
                 </div>
             ) : (
                 <div className="divide-y divide-slate-100">
                     {reports.map((report) => (
                         <div key={report.id} className="p-6 hover:bg-slate-50 transition-colors">
                             <div className="flex items-start justify-between mb-2">
                                 <div>
                                     <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200 mb-2">
                                         {report.type}
                                     </span>
                                     <h3 className="text-sm font-semibold text-slate-900 line-clamp-1">{report.description}</h3>
                                 </div>
                                 {getStatusBadge(report.status)}
                             </div>
                             
                             <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3 text-xs text-slate-500">
                                 <div className="flex items-center gap-1.5">
                                     <Calendar className="w-3.5 h-3.5" />
                                     {new Date(report.incident_date).toLocaleDateString()}
                                 </div>
                                 <div className="flex items-center gap-1.5">
                                     <MapPin className="w-3.5 h-3.5" />
                                     {report.location}
                                 </div>
                                 <div className="flex items-center gap-1.5">
                                     <Clock className="w-3.5 h-3.5" />
                                     Submitted: {new Date(report.created_at).toLocaleDateString()}
                                 </div>
                             </div>
                         </div>
                     ))}
                 </div>
             )}
        </div>
      </div>
    </div>
  );
}
