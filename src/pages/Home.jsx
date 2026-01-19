import React from 'react'
import Hero from '../components/Hero'
import FeatureCard from '../components/FeatureCard'
import Steps from '../components/Steps'
import ReportForm from '../components/ReportForm'

export default function Home() {
  return (
    <>
      <Hero />

      <section className="py-16 site-container">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 font-heading">কেন আমরা আলাদা?</h2>
            <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            title="চাঁদাবাজি ও ভয় দেখানো" 
            icon="⚠️" 
            text="যে কোনো ধরণের চাঁদাবাজি বা হুমকির বিরুদ্ধে রুখে দাঁড়ান।" 
          />
          <FeatureCard 
            title="পরিচয় গোপন থাকবে" 
            icon="🛡️" 
            text="আপনার নাম ও পরিচয় সম্পূর্ণ গোপন রেখে অভিযোগ জানান।" 
          />
          <FeatureCard 
            title="আপনার কণ্ঠস্বর গুরুত্বপূর্ণ" 
            icon="📢" 
            text="আপনার একটি অভিযোগ আমাদের সমাজকে নিরাপদ করতে পারে।" 
          />
        </div>
      </section>

      <div id="how-it-works">
        <Steps />
      </div>

      <section id="report" className="py-16 bg-emerald-50/50">
        <div className="site-container">
            <ReportForm />
        </div>
      </section>
    </>
  )
}
