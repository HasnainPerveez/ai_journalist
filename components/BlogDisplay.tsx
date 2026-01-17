import React, { useState } from 'react';
import { BlogData } from '../types';
import { Globe, BookOpen, Copy, Check } from 'lucide-react';

interface BlogDisplayProps {
  data: BlogData;
}

const BlogDisplay: React.FC<BlogDisplayProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'english' | 'urdu'>('english');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = activeTab === 'english' ? data.blogContent : data.urduContent;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple formatter to handle bolding and basic newlines for cleaner display
  // In a full app, use react-markdown. Here we render text with whitespace preserving.
  const ContentRenderer = ({ content, isUrdu }: { content: string; isUrdu: boolean }) => (
    <div className={`prose prose-slate max-w-none ${isUrdu ? 'font-urdu text-right' : 'font-serif'} whitespace-pre-wrap`}>
      {content.split('\n').map((line, i) => {
        // Simple heuristic for headers in raw text if the AI outputs markdown headers
        if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold text-slate-900 mt-8 mb-4">{line.replace('## ', '')}</h2>;
        if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold text-slate-800 mt-6 mb-3">{line.replace('### ', '')}</h3>;
        
        // Handle bold text markers from markdown
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
            <p key={i} className={`mb-4 ${isUrdu ? 'text-lg leading-loose' : 'text-base leading-7'} text-slate-700`}>
                {parts.map((part, index) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={index} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
                    }
                    return part;
                })}
            </p>
        );
      })}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
      {/* Header / Tabs */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-10">
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('english')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'english' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              English Edition
            </div>
          </button>
          <button
            onClick={() => setActiveTab('urdu')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'urdu' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Urdu Version
            </div>
          </button>
        </div>
        
        <button 
          onClick={handleCopy}
          className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
          title="Copy to clipboard"
        >
          {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
        </button>
      </div>

      {/* Content Area */}
      <div className="p-8 md:p-12 overflow-y-auto bg-white min-h-[600px]">
        
        {/* Title Block */}
        <div className={`mb-10 ${activeTab === 'urdu' ? 'text-right' : 'text-left'}`}>
            <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-blue-600 uppercase bg-blue-50 rounded-full">
                Investigative Report
            </span>
            <h1 className={`text-3xl md:text-4xl font-bold text-slate-900 mb-4 ${activeTab === 'urdu' ? 'font-urdu leading-normal' : 'font-serif'}`}>
                {activeTab === 'english' ? data.seo.title : "تفصیلی تجزیاتی رپورٹ"}
            </h1>
            <div className={`flex items-center gap-4 text-sm text-slate-500 ${activeTab === 'urdu' ? 'flex-row-reverse' : ''}`}>
                <span className="flex items-center gap-1">
                    Verified by VeriScript AI
                </span>
                <span>•</span>
                <span>{new Date().toLocaleDateString()}</span>
            </div>
        </div>

        {/* Table of Contents */}
        {activeTab === 'english' && (
            <div className="mb-10 p-6 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide">In this Article</h4>
                <ul className="space-y-2">
                    {data.tableOfContents.map((item, idx) => (
                        <li key={idx} className="text-sm text-slate-600 hover:text-blue-600 cursor-pointer flex items-start gap-2">
                            <span className="text-slate-300 font-mono">0{idx + 1}</span>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        )}

        {/* Article Body */}
        <ContentRenderer content={activeTab === 'english' ? data.blogContent : data.urduContent} isUrdu={activeTab === 'urdu'} />

        {/* Trust Footer */}
        <div className="mt-16 pt-8 border-t border-slate-100 text-center">
             <p className="text-xs text-slate-400 uppercase tracking-widest">Generated & Fact-Checked by VeriScript AI</p>
        </div>

      </div>
    </div>
  );
};

export default BlogDisplay;
