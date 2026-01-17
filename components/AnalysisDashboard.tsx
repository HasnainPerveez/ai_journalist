import React from 'react';
import { BlogData, VerificationStatus } from '../types';
import { ShieldCheck, ShieldAlert, ShieldX, Image as ImageIcon, Link2, Search, BarChart3 } from 'lucide-react';

interface AnalysisDashboardProps {
  data: BlogData;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ data }) => {
  const verifiedCount = data.verificationReport.filter(i => i.status === VerificationStatus.Verified).length;
  const partialCount = data.verificationReport.filter(i => i.status === VerificationStatus.PartiallyVerified).length;
  
  return (
    <div className="space-y-6">
      {/* Verification Summary Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Verification Report
          </h3>
          <span className="text-xs font-medium px-2 py-1 bg-white border border-slate-200 rounded-full text-slate-600">
            {data.verificationReport.length} Claims Checked
          </span>
        </div>
        <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
          {data.verificationReport.map((item, idx) => (
            <div key={idx} className="flex gap-3 text-sm">
              <div className="mt-0.5 shrink-0">
                {item.status === VerificationStatus.Verified && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
                {item.status === VerificationStatus.PartiallyVerified && <ShieldAlert className="w-4 h-4 text-amber-500" />}
                {item.status === VerificationStatus.Unverified && <ShieldX className="w-4 h-4 text-red-500" />}
              </div>
              <div>
                <p className="text-slate-800 font-medium mb-1">{item.claim}</p>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded
                    ${item.status === VerificationStatus.Verified ? 'bg-emerald-50 text-emerald-700' : 
                      item.status === VerificationStatus.PartiallyVerified ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}
                  `}>
                    {item.status}
                  </span>
                  <span className="text-xs text-slate-500 italic">{item.sourceNote}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SEO Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-600" />
            SEO Strategy
          </h3>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase">Optimized Title</label>
            <p className="text-sm font-medium text-slate-800 mt-1">{data.seo.title}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase">Meta Description</label>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">{data.seo.metaDescription}</p>
          </div>
        </div>
      </div>

      {/* Image Prompts */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-purple-600" />
            AI Image Assets
          </h3>
        </div>
        <div className="p-4 space-y-4">
          {data.imagePrompts.map((img, idx) => (
            <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                  {img.type.toUpperCase()}
                </span>
                {img.context && <span className="text-xs text-slate-400">{img.context}</span>}
              </div>
              <p className="text-xs text-slate-600 font-mono leading-relaxed select-all">
                {img.prompt}
              </p>
            </div>
          ))}
        </div>
      </div>

       {/* Internal Links */}
       <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Link2 className="w-4 h-4 text-indigo-600" />
            Internal Linking
          </h3>
        </div>
        <div className="p-4 space-y-3">
          {data.internalLinks.map((link, idx) => (
            <div key={idx} className="text-sm">
              <span className="text-blue-600 font-medium hover:underline cursor-pointer">{link.anchorText}</span>
              <p className="text-xs text-slate-500 mt-0.5">Insert at: {link.placementContext}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
