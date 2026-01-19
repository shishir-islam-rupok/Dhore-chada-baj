import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShieldAlert, LogIn, User, Bell, Clock, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const { user } = useAuth();
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await fetch(`http://localhost:4000/api/notifications/user/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.read).length);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await fetch(`http://localhost:4000/api/notifications/${id}/read`, {
        method: 'PATCH'
      });
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const navLinks = [
    { name: 'হোম', path: '/' },
    { name: 'আমাদের সম্পর্কে', path: '/about' },
    { name: 'গোপনীয়তা নীতি', path: '/privacy' },
  ];

  const isActive = (path) => location.pathname === path;

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="site-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
              <ShieldAlert className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-xl font-bold text-slate-800 font-heading">
              Dhore <span className="text-emerald-600">Chada Baj</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-emerald-600'
                    : 'text-slate-600 hover:text-emerald-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center gap-4">
                {/* Notifications Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors relative cursor-pointer"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-2">
                       <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                          <h3 className="font-bold text-slate-800">Notifications</h3>
                          {unreadCount > 0 && <span className="text-xs text-emerald-600 font-medium">{unreadCount} new</span>}
                       </div>
                       <div className="max-h-96 overflow-y-auto">
                          {notifications.length > 0 ? (
                            notifications.map((n) => (
                              <div 
                                key={n.id} 
                                onClick={() => markAsRead(n.id)}
                                className={`p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer ${!n.read ? 'bg-emerald-50/30' : ''}`}
                              >
                                <div className="flex gap-3">
                                  <div className="mt-0.5">{getIcon(n.type)}</div>
                                  <div className="flex-1">
                                    <p className={`text-sm ${!n.read ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>{n.message}</p>
                                    <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                                      <Clock className="w-3 h-3" />
                                      {new Date(n.created_at).toLocaleString()}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-8 text-center text-slate-500">
                              <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                              <p className="text-sm">No notifications yet</p>
                            </div>
                          )}
                       </div>
                    </div>
                  )}
                </div>

                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Dashboard
                </Link>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            )}

            <Link
              to="/#report"
              className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-sm hover:shadow-emerald-500/30"
            >
              জরুরী রিপোর্ট
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 absolute w-full left-0 shadow-lg animate-in slide-in-from-top-2">
          <div className="p-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {user && (
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-lg text-base font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Dashboard
              </Link>
            )}

            {!user && (
               <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-lg text-base font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Login
              </Link>
            )}

            <Link
              to="/#report"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center px-4 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
            >
              জরুরী রিপোর্ট
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
