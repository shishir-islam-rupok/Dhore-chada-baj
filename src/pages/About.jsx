import React from 'react';

export default function About() {
  return (
    <div className="site-container py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-6 font-heading">আমাদের সম্পর্কে</h1>
        <div className="w-24 h-1 bg-emerald-500 mb-8 rounded-full"></div>
        
        <div className="prose prose-lg text-slate-600 space-y-6">
          <p>
            <strong>Dhore Chada Baj</strong> একটি সম্পূর্ণ বেনামী এবং নিরাপদ প্ল্যাটফর্ম যা সাধারণ মানুষকে চাঁদাবাজি, 
            হুমকি এবং অন্যান্য অপরাধমূলক কর্মকাণ্ডের বিরুদ্ধে কথা বলার সুযোগ করে দেয়।
          </p>
          <p>
            আমাদের লক্ষ্য হলো প্রযুক্তির সহায়তায় সমাজের অপরাধ নির্মূল করা এবং ভুক্তভোগীদের পরিচয় গোপন রেখে 
            তাদের অভিযোগ যথাযথ কর্তৃপক্ষের কাছে পৌঁছে দেওয়া।
          </p>
          <p>
            আমরা বিশ্বাস করি যে প্রতিটি নাগরিকের নিরাপদে বাঁচার অধিকার আছে। আপনার একটি সাহসী পদক্ষেপ 
            আমাদের সমাজকে আরও সুন্দর ও বাসযোগ্য করে তুলতে পারে।
          </p>
        </div>
      </div>
    </div>
  );
}
