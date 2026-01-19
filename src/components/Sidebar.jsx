import React from 'react'

export default function Sidebar(){
  return (
    <aside className="w-64 min-h-screen bg-[var(--card)] border-r" style={{borderColor: 'var(--border)'}}>
      <div className="px-4 py-6">
        <div className="text-xl font-semibold mb-6" style={{fontFamily:'Poppins, sans-serif'}}>Dhore Chada Baj</div>

        <nav className="flex flex-col gap-2 text-sm">
          <a href="#" className="px-3 py-2 rounded-md hover:bg-[var(--muted)]">Home</a>
          <a href="#report" className="px-3 py-2 rounded-md text-[var(--accent)] font-semibold">Report</a>
          <a href="#about" className="px-3 py-2 rounded-md hover:bg-[var(--muted)]">About</a>
          <a href="#privacy" className="px-3 py-2 rounded-md hover:bg-[var(--muted)]">Privacy</a>
        </nav>

        <div className="mt-8">
          <div className="text-xs text-[var(--muted-text)]">Quick links</div>
          <ul className="mt-2 text-sm space-y-1">
            <li><a href="#" className="px-3 py-1 block rounded-md hover:bg-[var(--muted)]">My Reports</a></li>
            <li><a href="#" className="px-3 py-1 block rounded-md hover:bg-[var(--muted)]">Resources</a></li>
          </ul>
        </div>
      </div>
    </aside>
  )
}
