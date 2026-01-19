import React from 'react';

export default function Privacy() {
  return (
    <div className="site-container py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-6 font-heading">গোপনীয়তা নীতি</h1>
        <div className="w-24 h-1 bg-emerald-500 mb-8 rounded-full"></div>
        
        <div className="space-y-8 text-slate-600">
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">আমরা কি তথ্য সংগ্রহ করি?</h2>
            <p>
              রিপোর্ট সাবমিট করার সময় আপনি যে তথ্য (যেমন ঘটনার বিবরণ, স্থান, প্রমাণাদি) প্রদান করেন, 
              শুধুমাত্র সেটুকুই আমরা সংরক্ষণ করি। আপনি যদি "অ্যানোনিমাস" অপশন সিলেক্ট করেন, 
              তবে আপনার কোনো ব্যক্তিগত পরিচয় (নাম, ইমেইল, ফোন নম্বর) আমরা সংগ্রহ করি না।
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">আপনার তথ্যের নিরাপত্তা</h2>
            <p>
              আমরা সর্বাধুনিক এনক্রিপশন প্রযুক্তি ব্যবহার করি যাতে আপনার সাবমিট করা তথ্য সুরক্ষিত থাকে। 
              আমাদের ডাটাবেস সম্পূর্ণ নিরাপদ এবং তৃতীয় কোনো পক্ষের সাথে আমরা তথ্য শেয়ার করি না।
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">আইনি সহায়তা</h2>
            <p>
              প্রয়োজনীয় ক্ষেত্রে, আমরা আইন প্রয়োগকারী সংস্থার সাথে সহযোগিতা করতে পারি, 
              তবে সেক্ষেত্রেও আপনার পরিচয় গোপন রাখার সর্বোচ্চ চেষ্টা করা হবে।
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
