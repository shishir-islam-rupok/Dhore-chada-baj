import React from 'react'

export default function Steps(){
  return (
    <section className="py-20 relative overflow-hidden bg-slate-50/50">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
      
      <div className="site-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-heading">কিভাবে কাজ করে?</h2>
          <p className="text-slate-600">সহজ ৩টি ধাপে রিপোর্ট করুন</p>
        </div>

        <div className="relative">
          {/* Connector Line - Desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500/50 to-transparent -translate-x-1/2" />
          {/* Connector Line - Mobile */}
          <div className="md:hidden absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500/30 to-transparent" />

          <div className="space-y-12">
            {/* Step 1 */}
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 group">
              <div className="md:w-1/2 flex justify-end pl-20 md:pl-0 w-full">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm md:text-right max-w-sm w-full hover:border-emerald-500/30 hover:shadow-md transition-all">
                  <h3 className="text-xl font-bold text-emerald-600 mb-2">১. ফরম পূরণ</h3>
                  <p className="text-slate-600 text-sm">আমাদের সিকিউর ফরমে ঘটনার বিস্তারিত বিবরণ দিন।</p>
                </div>
              </div>
              <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white border-4 border-emerald-500 flex items-center justify-center z-10 shadow-lg">
                <span className="text-emerald-700 font-bold">1</span>
              </div>
              <div className="md:w-1/2 hidden md:block" />
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 group">
              <div className="md:w-1/2 hidden md:block" />
              <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white border-4 border-green-500 flex items-center justify-center z-10 shadow-lg">
                <span className="text-green-700 font-bold">2</span>
              </div>
              <div className="md:w-1/2 flex justify-start pl-20 md:pl-0 w-full">
                 <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-sm w-full hover:border-green-500/30 hover:shadow-md transition-all">
                  <h3 className="text-xl font-bold text-green-600 mb-2">২. যাচাইকরণ</h3>
                  <p className="text-slate-600 text-sm">আমাদের টিম তথ্যের সত্যতা যাচাই করবে এবং এনালাইসিস করবে।</p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 group">
              <div className="md:w-1/2 flex justify-end pl-20 md:pl-0 w-full">
                 <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm md:text-right max-w-sm w-full hover:border-teal-500/30 hover:shadow-md transition-all">
                  <h3 className="text-xl font-bold text-teal-600 mb-2">৩. পদক্ষেপ গ্রহণ</h3>
                  <p className="text-slate-600 text-sm">যথাযথ কর্তৃপক্ষের মাধ্যমে আইনি ব্যবস্থা নেওয়া হবে।</p>
                </div>
              </div>
               <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white border-4 border-teal-500 flex items-center justify-center z-10 shadow-lg">
                <span className="text-teal-700 font-bold">3</span>
              </div>
              <div className="md:w-1/2 hidden md:block" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
