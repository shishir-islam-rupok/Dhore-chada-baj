import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck } from 'lucide-react'

export default function Hero(){
  return (
    <section className="relative pt-20 pb-16 lg:pt-32 lg:pb-24 px-4 overflow-hidden">
        <div className="site-container grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-6">
               <ShieldCheck className="w-4 h-4" />
               <span>সম্পূর্ণ গোপনীয়তা নিশ্চিত</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6 font-heading text-slate-900">
               নিরাপদ সমাজ গড়তে<br />
              <span className="text-emerald-600">
                আজই রিপোর্ট করুন
              </span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
              চাঁদাবাজি, হুমকি বা যেকোনো অপরাধমূলক কর্মকাণ্ডের বিরুদ্ধে রুখে দাঁড়ান। আপনার পরিচয় গোপন রেখে আমরা আছি আপনার পাশে।
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <Link to="/report" className="btn-primary group">
                রিপোর্ট করুন
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a 
                href="#how-it-works"
                className="px-6 py-3 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-emerald-600 font-medium transition-all"
              >
                কিভাবে কাজ করে?
              </a>
            </div>
          </div>

          <div className="relative mt-8 lg:mt-0">
             {/* Abstract Graphic */}
            <div className="relative z-10 glass-panel rounded-2xl p-6 sm:p-8 border border-white/40 shadow-xl lg:rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    </div>
                </div>
                <div className="space-y-4 font-mono text-sm">
                    <div className="flex gap-4 text-slate-600">
                        <span className="text-emerald-600">$</span>
                        <span>initiate_secure_report()</span>
                    </div>
                    <div className="flex gap-4 text-slate-500">
                        <span className="text-emerald-600">&gt;</span>
                        <span>Encrypting user data...</span>
                    </div>
                     <div className="flex gap-4 text-slate-500">
                        <span className="text-emerald-600">&gt;</span>
                        <span>Connection established: <span className="text-emerald-600 font-bold">SECURE</span></span>
                    </div>
                    <div className="flex gap-4 text-slate-500">
                        <span className="text-emerald-600">&gt;</span>
                        <span>Anonymity: <span className="text-emerald-600 font-bold">100% CONFIRMED</span></span>
                    </div>
                </div>
            </div>
            
             {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-emerald-200/40 rounded-full blur-[80px] -z-10" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-teal-200/40 rounded-full blur-[80px] -z-10" />
          </div>
        </div>
    </section>
  )
}
