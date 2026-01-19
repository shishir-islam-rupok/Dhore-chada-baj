import React from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function Layout({children}){
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-dark)] text-[var(--text-primary)]">
       {/* Ambient Background Gradient */}
      <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
      </div>

      <Navbar />
      
      <main className="flex-1 relative z-10 w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}
