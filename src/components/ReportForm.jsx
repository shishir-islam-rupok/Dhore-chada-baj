import React, { useState, useRef } from "react";
import { Upload, CheckCircle, AlertCircle, Shield, File, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';

export default function ReportForm(){
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    type: 'চাঁদাবাজি',
    incidentDate: '',
    description: '',
    location: '',
    anonymous: true
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
        if (selectedFile.size > 10 * 1024 * 1024) {
            alert('File size must be less than 10MB');
            return;
        }
        setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      let evidence_url = null;

      // 1. Upload file to Supabase Storage if exists
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('evidence')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('evidence')
          .getPublicUrl(filePath);
        
        evidence_url = publicUrl;
      }

      // 2. Submit report with payload
      const payload = {
        ...formData,
        user_id: user?.id || null,
        evidence_url
      };

      console.log('Submitting report payload:', payload);

      const res = await fetch('http://localhost:4000/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if(res.ok) {
        setMessage({ type: 'success', text: '✅ অভিযোগ সফলভাবে জমা দেওয়া হয়েছে! (Report ID: ' + data.id + ')' });
        setFormData(prev => ({...prev, description: '', location: '', incidentDate: ''}));
        setFile(null);
      } else {
        console.error('Server error response:', data);
        throw new Error(data.error || 'Failed to submit');
      }
    } catch (err) {
      console.error('Report submission error:', err);
      setMessage({ type: 'error', text: '❌ জমা দেওয়া সম্ভব হয়নি। এরর: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="reportForm" className="max-w-3xl mx-auto">
      <div className="bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-xl relative overflow-hidden">
        {/* Glow behind form */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10">
            <div className="text-center mb-10">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-4">
                    <Shield className="w-3 h-3" />
                    Secure Submission
                </span>
                <h2 className="text-3xl font-bold text-slate-900 mb-2 font-heading">অভিযোগ জানান</h2>
                <p className="text-slate-600">আপনার তথ্য সম্পূর্ণ গোপন রাখা হবে</p>
            </div>

            {message && (
              <div className={`flex items-center gap-3 p-4 mb-6 rounded-lg ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {message.type === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                <span>{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-700">অভিযোগের ধরণ</span>
                    <select 
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                    >
                        <option>চাঁদাবাজি</option>
                        <option>প্রাণনাশের হুমকি</option>
                        <option>শারীরিক নির্যাতন</option>
                        <option>সাইবার হ্যারেসমেন্ট</option>
                        <option>অন্যান্য</option>
                    </select>
                </label>

                <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-700">তারিখ</span>
                    <input 
                      type="date" 
                      name="incidentDate"
                      value={formData.incidentDate}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors" 
                    />
                </label>
            </div>

            <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">বিস্তারিত বিবরণ</span>
                <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={6} 
                    required
                    placeholder="ঘটনার বিস্তারিত বর্ণনা দিন..." 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors resize-none" 
                />
            </label>

            <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">ঘটনাস্থল</span>
                <input 
                    type="text" 
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    placeholder="এলাকা / থানা / জেলা" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors" 
                />
            </label>

             <div 
                onClick={() => fileInputRef.current?.click()}
                className={`p-6 rounded-lg border border-dashed transition-colors text-center cursor-pointer group ${file ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-300 bg-slate-50 hover:bg-emerald-50/50'}`}
             >
                <div className={`w-12 h-12 rounded-full border mx-auto flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${file ? 'bg-emerald-100 border-emerald-500 text-emerald-600' : 'bg-white border-slate-200 text-slate-400 group-hover:text-emerald-600 group-hover:border-emerald-500/50'}`}>
                    {file ? <File className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
                </div>
                
                {file ? (
                    <div className="flex items-center justify-center gap-2">
                        <p className="text-sm text-emerald-700 font-medium truncate max-w-[200px]">{file.name}</p>
                        <button 
                            onClick={(e) => { e.stopPropagation(); setFile(null); }}
                            className="p-1 hover:bg-emerald-200 rounded-full text-emerald-600 transition-colors"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-slate-600 font-medium">প্রমাণাদি আপলোড করুন (ঐচ্ছিক)</p>
                        <p className="text-xs text-slate-400 mt-1">ছবি, ভিডিও বা অডিও ক্লিপ (সর্বোচ্চ ১০ মেগাবাইট)</p>
                    </>
                )}
                
                <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden" 
                />
            </div>

            <label className="flex items-center gap-3 p-4 rounded-lg bg-emerald-50 border border-emerald-100 cursor-pointer hover:bg-emerald-100/50 transition-colors">
                 <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.anonymous ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-400 bg-white'}`}>
                    {formData.anonymous && <CheckCircle className="w-3.5 h-3.5" />}
                 </div>
                 <input 
                    type="checkbox" 
                    name="anonymous"
                    checked={formData.anonymous}
                    onChange={handleChange}
                    className="hidden" 
                  />
                <span className="text-sm text-slate-700 select-none font-medium">আমি নিশ্চিত করছি যে সম্পূর্ণ বেনামে রিপোর্ট করতে চাই।</span>
            </label>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary py-4 text-lg shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'জমা দেওয়া হচ্ছে...' : 'রিপোর্ট জমা দিন'}
            </button>
            
            <p className="text-center text-xs text-slate-500 mt-4 flex items-center justify-center gap-1">
                <Shield className="w-3 h-3" />
                আপনার আইপি এড্রেস এবং পরিচয় গোপন রাখা হবে।
            </p>
            </form>
        </div>
      </div>
    </section>
  )
}
