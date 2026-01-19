import React from 'react';

export default function Footer(){
  return (
    <footer className="mt-16 bg-slate-900 border-t border-slate-800 text-slate-400 py-12">
      <div className="site-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-between">
          <div className="flex gap-4 items-center">
            <span className="text-2xl">🔒</span>
            <div>
                <h4 className="font-bold text-slate-200">Anonymous Reporting</h4>
                <p className="text-xs text-slate-500 mt-1">Your identity is cryptographically protected.</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-2xl">⚖️</span>
            <div>
                <h4 className="font-bold text-slate-200">Legal Disclaimer</h4>
                <p className="text-xs text-slate-500 mt-1">We facilitate reporting but are not law enforcement.</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-2xl">🛑</span>
            <div>
                <h4 className="font-bold text-slate-200">Zero Tolerance</h4>
                <p className="text-xs text-slate-500 mt-1">False reports will be flagged and banned.</p>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-600">
            <p>&copy; {new Date().getFullYear()} Dhore Chada Baj. All rights reserved.</p>
            <div className="flex justify-center gap-4 mt-4">
                <a href="/privacy" className="hover:text-emerald-500 transition-colors">Privacy Policy</a>
                <a href="/terms" className="hover:text-emerald-500 transition-colors">Terms of Service</a>
            </div>
        </div>
      </div>
    </footer>
  )
}
