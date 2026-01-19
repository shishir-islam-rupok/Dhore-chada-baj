import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, ArrowRight, Delete } from 'lucide-react';

export default function AdminLogin() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 10) {
      setPin(value);
      setError('');
    }
  };

  const handleNumberClick = (num) => {
    if (pin.length < 10) {
      setPin(prev => prev + num);
      setError('');
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPin('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pin.length === 0) {
      setError('Please enter a PIN');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:4000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pin.trim() })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('admin_user', JSON.stringify(data.admin));
        navigate('/admin/dashboard');
      } else {
        throw new Error(data.error || 'Invalid PIN');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    } else if (e.key === 'Backspace') {
      handleBackspace();
    } else if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-2xl mb-4 shadow-lg shadow-emerald-500/50">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Access</h1>
          <p className="text-slate-400">Enter your 10-digit PIN to continue</p>
        </div>

        {/* Login Form */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PIN Input Display */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Lock className="w-5 h-5 text-slate-400" />
              </div>
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="10"
                value={pin}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                placeholder="Enter 10-digit PIN"
                className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-600 rounded-xl text-white text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                autoFocus
              />
              {pin.length > 0 && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <Delete className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* PIN Length Indicator */}
            <div className="flex justify-center gap-2">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i < pin.length ? 'bg-emerald-500 scale-125' : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            {/* Number Pad */}
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleNumberClick(num.toString())}
                  className="py-4 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 rounded-xl text-white text-xl font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClear}
                className="py-4 bg-slate-700/50 hover:bg-red-600/50 border border-slate-600 hover:border-red-500 rounded-xl text-slate-400 hover:text-white text-sm font-medium transition-all cursor-pointer"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => handleNumberClick('0')}
                className="py-4 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 rounded-xl text-white text-xl font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                className="py-4 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 rounded-xl text-slate-400 hover:text-white text-sm font-medium transition-all cursor-pointer"
              >
                ⌫
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || pin.length === 0}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Access Dashboard
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Hint */}
          <div className="mt-6 text-center text-sm text-slate-500">
            <p>💡 You can type using your keyboard or click the number pad</p>
            <p className="mt-1">Press Enter to submit • Esc to clear</p>
          </div>
        </div>

        {/* Back to Home */}
        <button
          onClick={() => navigate('/')}
          className="mt-6 w-full py-3 text-slate-400 hover:text-white transition-colors text-sm cursor-pointer"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
