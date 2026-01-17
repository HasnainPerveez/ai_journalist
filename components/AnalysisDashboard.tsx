import React from 'react';
import { BlogData, VerificationStatus } from '../types';
import { ShieldCheck, ShieldAlert, ShieldX, Image as ImageIcon, Link2, Search, Zap, ExternalLink } from 'lucide-react';

interface AnalysisDashboardProps {
  data: BlogData;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ data }) => {
  const verifiedCount = data.verificationReport.filter(i => i.status === VerificationStatus.Verified).length;
  
  return (
    <div className="space-y-6">
        {/* Verification Widget */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="bg-emerald-100 p-1.5 rounded-lg">
                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-sm">Fact-Check Report</h3>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Web Verified</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="block text-2xl font-bold text-slate-900 leading-none">{verifiedCount}</span>
                    <span className="text-[10px] text-slate-400 font-medium">Claims Verified</span>
                </div>
            </div>
            <div className="max-h-[350px] overflow-y-auto p-2 scrollbar-hide">
                {data.verificationReport.map((item, idx) => (
                    <div key={idx} className="p-3 mb-2 rounded-xl bg-slate-50 border border-slate-100 last:mb-0 hover:bg-white hover:shadow-sm hover:border-indigo-100 transition-all">
                        <div className="flex justify-between items-start gap-3 mb-2">
                             <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border
                                ${item.status === VerificationStatus.Verified ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                                  item.status === VerificationStatus.PartiallyVerified ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-red-50 text-red-700 border-red-100'}
                             `}>
                                {item.status}
                             </span>
                        </div>
                        <p className="text-xs font-medium text-slate-800 leading-relaxed mb-1.5">"{item.claim}"</p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1">
                             <ExternalLink className="w-3 h-3" />
                             {item.sourceNote}
                        </p>
                    </div>
                ))}
            </div>
        </div>

        {/* SEO Widget */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center gap-2.5">
                <div className="bg-blue-100 p-1.5 rounded-lg">
                    <Search className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">SEO Strategy</h3>
            </div>
            <div className="p-5 space-y-4">
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Title Tag</label>
                    <p className="text-sm font-semibold text-slate-900 leading-snug">{data.seo.title}</p>
                </div>
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Meta Description</label>
                    <p className="text-xs text-slate-600 leading-relaxed">{data.seo.metaDescription}</p>
                </div>
            </div>
        </div>

        {/* Assets Widget */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="p-5 border-b border-slate-100 flex items-center gap-2.5">
                <div className="bg-purple-100 p-1.5 rounded-lg">
                    <ImageIcon className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">Visual Prompts</h3>
            </div>
            <div className="p-4 space-y-3">
                 {data.imagePrompts.map((img, idx) => (
                    <div key={idx} className="group relative bg-slate-50 p-3 rounded-xl border border-slate-100 hover:border-purple-200 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                             <span className="text-[10px] font-bold text-purple-600 uppercase bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                                {img.type}
                             </span>
                             <span className="text-[10px] text-slate-400">{img.context}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 font-mono leading-relaxed opacity-80 group-hover:opacity-100">
                            {img.prompt}
                        </p>
                    </div>
                 ))}
            </div>
        </div>
    </div>
  );
};

export default AnalysisDashboard;
