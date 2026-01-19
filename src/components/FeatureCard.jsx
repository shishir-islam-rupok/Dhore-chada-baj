import React from 'react';

export default function FeatureCard({icon, title, text}){
  return (
    <div className="group p-8 rounded-2xl bg-white border border-slate-100 hover:border-emerald-100 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1">
      <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
          {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3 font-heading">{title}</h3>
      <p className="text-slate-600 leading-relaxed text-sm">
        {text}
      </p>
    </div>
  )
}
