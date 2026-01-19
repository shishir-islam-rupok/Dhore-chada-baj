import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Bell, FileText, Settings, Users, LogOut, Menu, Eye, CheckCircle, XCircle, Clock, TrendingUp, Plus, Trash2, Edit, Send, X } from 'lucide-react';

export default function AdminDashboard() {
  const [admin, setAdmin] = useState(null);
  const [activeTab, setActiveTab] = useState('reports');
  const [reports, setReports] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [settings, setSettings] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [adminForm, setAdminForm] = useState({ name: '', email: '', pin_hash: '', role: 'admin' });
  const [notificationForm, setNotificationForm] = useState({ message: '', type: 'info' });
  const navigate = useNavigate();

  useEffect(() => {
    const storedAdmin = localStorage.getItem('admin_user');
    if (!storedAdmin) {
      navigate('/admin');
    } else {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, [navigate]);

  useEffect(() => {
    if (admin) {
      fetchReports();
    }
  }, [admin]);

  useEffect(() => {
    if (admin && activeTab === 'admins') {
      fetchAdmins();
    }
    if (admin && activeTab === 'settings') {
      fetchSettings();
    }
  }, [activeTab, admin]);

  const fetchReports = async () => {
    try {
        console.log('Fetching reports...');
        const res = await fetch('http://localhost:4000/api/reports');
        const data = await res.json();
        console.log('Reports fetched:', data);
        if(res.ok) setReports(data);
        else console.error('Failed to fetch reports:', data);
    } catch (err) {
        console.error("Failed to fetch reports", err);
    }
  };

  const fetchAdmins = async () => {
    try {
        console.log('Fetching admins...');
        const res = await fetch('http://localhost:4000/api/admin/list');
        const data = await res.json();
        console.log('Admins fetched:', data);
        if(res.ok) setAdmins(data);
        else console.error('Failed to fetch admins:', data);
    } catch (err) {
        console.error("Failed to fetch admins", err);
    }
  };

  const fetchSettings = async () => {
    try {
        console.log('Fetching settings...');
        const res = await fetch('http://localhost:4000/api/settings');
        const data = await res.json();
        console.log('Settings fetched:', data);
        if(res.ok) setSettings(data);
        else console.error('Failed to fetch settings:', data);
    } catch (err) {
        console.error("Failed to fetch settings", err);
    }
  };

  const updateReportStatus = async (reportId, newStatus) => {
    try {
      console.log('Updating report status:', reportId, newStatus);
      const res = await fetch(`http://localhost:4000/api/reports/${reportId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (res.ok) {
        console.log('Status updated successfully');
        fetchReports();
        setSelectedReport(null);
        alert('Report status updated successfully!');
      } else {
        const data = await res.json();
        console.error('Failed to update status:', data);
        alert('Failed to update status: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error("Failed to update status", err);
      alert('Error updating status: ' + err.message);
    }
  };

  const createAdmin = async (e) => {
    e.preventDefault();
    try {
      console.log('Creating admin:', adminForm);
      const res = await fetch('http://localhost:4000/api/admin/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminForm)
      });
      
      const data = await res.json();
      console.log('Create admin response:', data);
      
      if (res.ok) {
        fetchAdmins();
        setShowAdminModal(false);
        setAdminForm({ name: '', email: '', pin_hash: '', role: 'admin' });
        alert('Admin created successfully!');
      } else {
        console.error('Failed to create admin:', data);
        alert('Failed to create admin: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error("Failed to create admin", err);
      alert('Error creating admin: ' + err.message);
    }
  };

  const deleteAdmin = async (adminId) => {
    if (!confirm('Are you sure you want to deactivate this admin?')) return;
    
    try {
      const res = await fetch(`http://localhost:4000/api/admin/${adminId}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        fetchAdmins();
      }
    } catch (err) {
      console.error("Failed to delete admin", err);
    }
  };

  const sendNotification = async (e) => {
    e.preventDefault();
    try {
      console.log('Sending notification:', notificationForm);
      const res = await fetch('http://localhost:4000/api/notifications/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationForm)
      });
      
      const data = await res.json();
      console.log('Notification response:', data);
      
      if (res.ok) {
        setShowNotificationModal(false);
        setNotificationForm({ message: '', type: 'info' });
        alert(`Notification sent successfully to ${data.count || 0} users!`);
      } else {
        console.error('Failed to send notification:', data);
        alert('Failed to send notification: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error("Failed to send notification", err);
      alert('Error sending notification: ' + err.message);
    }
  };

  const updateSetting = async (key, value) => {
    try {
      const res = await fetch(`http://localhost:4000/api/settings/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value })
      });
      
      if (res.ok) {
        fetchSettings();
      }
    } catch (err) {
      console.error("Failed to update setting", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_user');
    navigate('/admin');
  };

  const filteredReports = statusFilter === 'all' 
    ? reports 
    : reports.filter(r => (r.status || 'pending') === statusFilter);

  const stats = {
    total: reports.length,
    pending: reports.filter(r => !r.status || r.status === 'pending').length,
    processing: reports.filter(r => r.status === 'processing').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
    rejected: reports.filter(r => r.status === 'rejected').length
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-slate-300 z-50 transform transition-transform lg:translate-x-0 lg:static flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
            <div className="w-8 h-8 rounded bg-emerald-500 flex items-center justify-center text-white">
                <Shield className="w-5 h-5" />
            </div>
            <span className="font-bold text-white tracking-wide">ADMIN PANEL</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
            <NavItem icon={<FileText />} label="Reports" active={activeTab === 'reports'} onClick={() => {setActiveTab('reports'); setSidebarOpen(false)}} />
            <NavItem icon={<TrendingUp />} label="Analytics" active={activeTab === 'analytics'} onClick={() => {setActiveTab('analytics'); setSidebarOpen(false)}} />
            <NavItem icon={<Bell />} label="Notifications" active={activeTab === 'notifications'} onClick={() => {setActiveTab('notifications'); setSidebarOpen(false)}} />
            <NavItem icon={<Users />} label="Admins" active={activeTab === 'admins'} onClick={() => {setActiveTab('admins'); setSidebarOpen(false)}} />
            <NavItem icon={<Settings />} label="Settings" active={activeTab === 'settings'} onClick={() => {setActiveTab('settings'); setSidebarOpen(false)}} />
        </nav>

        <div className="p-4 border-t border-slate-800">
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-800 rounded-lg mb-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold">
                    {admin?.name?.charAt(0)}
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-medium text-white truncate">{admin?.name}</p>
                    <p className="text-xs text-slate-500 truncate">{admin?.role}</p>
                </div>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-slate-800 rounded-lg transition-colors text-sm cursor-pointer">
                <LogOut className="w-4 h-4" />
                Sign Out
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-600 cursor-pointer">
                <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold text-slate-800 capitalize hidden sm:block">{activeTab}</h1>
            <div className="flex items-center gap-4">
                <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
            </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
            {/* Reports Tab */}
            {activeTab === 'reports' && (
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                        <div className="flex gap-2 flex-wrap">
                            <button onClick={() => setStatusFilter('all')} className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-all hover:scale-105 ${statusFilter === 'all' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>All: {stats.total}</button>
                            <button onClick={() => setStatusFilter('pending')} className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-all hover:scale-105 ${statusFilter === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Pending: {stats.pending}</button>
                            <button onClick={() => setStatusFilter('processing')} className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-all hover:scale-105 ${statusFilter === 'processing' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Processing: {stats.processing}</button>
                            <button onClick={() => setStatusFilter('resolved')} className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-all hover:scale-105 ${statusFilter === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Resolved: {stats.resolved}</button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Type</th>
                                        <th className="px-6 py-4">Description</th>
                                        <th className="px-6 py-4">Location</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredReports.map((report) => (
                                        <tr key={report.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-1 rounded-md text-xs font-semibold capitalize
                                                    ${(report.status || 'pending') === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 
                                                      (report.status || 'pending') === 'rejected' ? 'bg-red-100 text-red-700' :
                                                      (report.status || 'pending') === 'processing' ? 'bg-blue-100 text-blue-700' :
                                                      'bg-yellow-100 text-yellow-700'}`}>
                                                    {report.status || 'pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-900">{report.type}</td>
                                            <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{report.description}</td>
                                            <td className="px-6 py-4 text-slate-600">{report.location}</td>
                                            <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{new Date(report.created_at).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                <button onClick={() => setSelectedReport(report)} className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 cursor-pointer transition-colors">
                                                    <Eye className="w-4 h-4" />
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredReports.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-8 text-center text-slate-500">No reports found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard icon={<FileText />} label="Total Reports" value={stats.total} color="blue" />
                        <StatCard icon={<Clock />} label="Pending" value={stats.pending} color="yellow" />
                        <StatCard icon={<CheckCircle />} label="Resolved" value={stats.resolved} color="green" />
                        <StatCard icon={<XCircle />} label="Rejected" value={stats.rejected} color="red" />
                    </div>
                    
                    <div className="bg-white p-8 rounded-xl border border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
                        <p className="text-slate-500">Analytics dashboard coming soon...</p>
                    </div>
                </div>
            )}
            
            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
                <div className="space-y-6">
                    <button 
                        onClick={() => setShowNotificationModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer transition-colors font-medium"
                    >
                        <Send className="w-4 h-4" />
                        Broadcast Notification
                    </button>

                    <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
                        <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900">Notification Center</h3>
                        <p className="text-slate-500 mt-2">Send alerts to users about report updates or important announcements.</p>
                    </div>
                </div>
            )}
            
            {/* Admins Tab */}
            {activeTab === 'admins' && (
                <div className="space-y-6">
                    <button 
                        onClick={() => setShowAdminModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer transition-colors font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Create Admin
                    </button>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Created</th>
                                    <th className="px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {admins.map((adm) => (
                                    <tr key={adm.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 font-medium text-slate-900">{adm.name}</td>
                                        <td className="px-6 py-4 text-slate-600">{adm.email || 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex px-2 py-1 rounded-md text-xs font-semibold bg-blue-100 text-blue-700">
                                                {adm.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-1 rounded-md text-xs font-semibold ${adm.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                {adm.status || 'active'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">{new Date(adm.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <button 
                                                onClick={() => deleteAdmin(adm.id)}
                                                className="text-red-600 hover:text-red-700 cursor-pointer transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
                <div className="bg-white p-8 rounded-xl border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-900 mb-6">Site Settings</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Site Name</label>
                            <input 
                                type="text" 
                                value={settings.site_name || ''} 
                                onChange={(e) => setSettings({...settings, site_name: e.target.value})}
                                onBlur={(e) => updateSetting('site_name', e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Contact Email</label>
                            <input 
                                type="email" 
                                value={settings.contact_email || ''} 
                                onChange={(e) => setSettings({...settings, contact_email: e.target.value})}
                                onBlur={(e) => updateSetting('contact_email', e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Emergency Contact</label>
                            <input 
                                type="text" 
                                value={settings.emergency_contact || ''} 
                                onChange={(e) => setSettings({...settings, emergency_contact: e.target.value})}
                                onBlur={(e) => updateSetting('emergency_contact', e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
      </main>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedReport(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Report Details</h2>
              <button onClick={() => setSelectedReport(null)} className="p-2 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-500">Report ID</label>
                <p className="text-sm text-slate-900 font-mono">{selectedReport.id}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-500">Type</label>
                <p className="text-slate-900">{selectedReport.type}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-500">Description</label>
                <p className="text-slate-900 whitespace-pre-wrap">{selectedReport.description}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-500">Evidence</label>
                {selectedReport.evidence_url ? (
                  <div className="mt-1">
                    <a 
                      href={selectedReport.evidence_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-lg border border-emerald-100 hover:bg-emerald-100 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      View Uploaded Evidence
                    </a>
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm italic">No evidence uploaded</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-500">Location</label>
                  <p className="text-slate-900">{selectedReport.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500">Incident Date</label>
                  <p className="text-slate-900">{new Date(selectedReport.incident_date).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-500">Submitted</label>
                <p className="text-slate-900">{new Date(selectedReport.created_at).toLocaleString()}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-500 block mb-2">Update Status</label>
                <div className="flex gap-2">
                  <button onClick={() => updateReportStatus(selectedReport.id, 'pending')} className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 text-sm font-medium cursor-pointer transition-colors">Pending</button>
                  <button onClick={() => updateReportStatus(selectedReport.id, 'processing')} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm font-medium cursor-pointer transition-colors">Processing</button>
                  <button onClick={() => updateReportStatus(selectedReport.id, 'resolved')} className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 text-sm font-medium cursor-pointer transition-colors">Resolved</button>
                  <button onClick={() => updateReportStatus(selectedReport.id, 'rejected')} className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium cursor-pointer transition-colors">Rejected</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Admin Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAdminModal(false)}>
          <div className="bg-white rounded-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Create New Admin</h2>
              <button onClick={() => setShowAdminModal(false)} className="p-2 hover:bg-slate-100 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={createAdmin} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                <input 
                  type="text" 
                  required
                  value={adminForm.name}
                  onChange={(e) => setAdminForm({...adminForm, name: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input 
                  type="email" 
                  value={adminForm.email}
                  onChange={(e) => setAdminForm({...adminForm, email: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">PIN (10 digits)</label>
                <input 
                  type="text" 
                  required
                  maxLength="10"
                  value={adminForm.pin_hash}
                  onChange={(e) => setAdminForm({...adminForm, pin_hash: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
                <select 
                  value={adminForm.role}
                  onChange={(e) => setAdminForm({...adminForm, role: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="worker">Worker</option>
                </select>
              </div>
              <button type="submit" className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer transition-colors font-medium">
                Create Admin
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowNotificationModal(false)}>
          <div className="bg-white rounded-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Broadcast Notification</h2>
              <button onClick={() => setShowNotificationModal(false)} className="p-2 hover:bg-slate-100 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={sendNotification} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                <textarea 
                  required
                  rows="4"
                  value={notificationForm.message}
                  onChange={(e) => setNotificationForm({...notificationForm, message: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter notification message..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                <select 
                  value={notificationForm.type}
                  onChange={(e) => setNotificationForm({...notificationForm, type: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="success">Success</option>
                  <option value="error">Error</option>
                </select>
              </div>
              <button type="submit" className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer transition-colors font-medium">
                Send to All Users
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
    return (
        <button 
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium cursor-pointer
            ${active ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            {React.cloneElement(icon, { className: 'w-5 h-5' })}
            {label}
        </button>
    )
}

function StatCard({ icon, label, value, color }) {
    const colors = {
        blue: 'bg-blue-100 text-blue-600',
        yellow: 'bg-yellow-100 text-yellow-600',
        green: 'bg-emerald-100 text-emerald-600',
        red: 'bg-red-100 text-red-600'
    };
    
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-slate-500 font-medium">{label}</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
                </div>
                <div className={`p-3 rounded-lg ${colors[color]}`}>
                    {React.cloneElement(icon, { className: 'w-6 h-6' })}
                </div>
            </div>
        </div>
    )
}
