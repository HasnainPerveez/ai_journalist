import React, { useState } from 'react';
import { BlogData } from '../types';
import { Globe, BookOpen, Copy, Check, Menu, X } from 'lucide-react';

interface BlogDisplayProps {
  data: BlogData;
}

const BlogDisplay: React.FC<BlogDisplayProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'english' | 'urdu'>('english');
  const [copied, setCopied] = useState(false);
  const [showMobileTOC, setShowMobileTOC] = useState(false);

  const handleCopy = () => {
    const text = activeTab === 'english' ? data.blogContent : data.urduContent;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ContentRenderer = ({ content, isUrdu }: { content: string; isUrdu: boolean }) => (
    <div className={`prose prose-lg max-w-none ${isUrdu ? 'font-urdu text-right' : 'font-serif'} text-slate-800`}>
      {content.split('\n').map((line, i) => {
        // Headers
        if (line.startsWith('## ')) return <h2 key={i} className="text-2xl md:text-3xl font-bold text-slate-900 mt-12 mb-6 tracking-tight leading-tight">{line.replace('## ', '')}</h2>;
        if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold text-slate-800 mt-8 mb-4">{line.replace('### ', '')}</h3>;
        
        // Lists
        if (line.trim().startsWith('- ')) return <li key={i} className="ml-4 list-disc marker:text-indigo-400 pl-2 mb-2">{line.replace('- ', '')}</li>;

        // Empty lines
        if (line.trim() === '') return <div key={i} className="h-4"></div>;

        // Paragraphs with formatting
        const parts = line.split(/(\*\*.*?\*\*|\[BACKLINK OPPORTUNITY:.*?\]|\[REFERENCE SIGNAL:.*?\])/g);
        
        return (
            <p key={i} className={`mb-6 ${isUrdu ? 'text-xl leading-loose' : 'text-lg leading-8'} text-slate-700`}>
                {parts.map((part, index) => {
                    // Bold
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={index} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
                    }
                    // Backlink Markers - Visual distinction
                    if (part.startsWith('[BACKLINK')) {
                        return (
                            <span key={index} className="mx-1 inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                {part.replace('[', '').replace(']', '')}
                            </span>
                        );
                    }
                    // Reference Markers
                    if (part.startsWith('[REFERENCE')) {
                        return (
                             <span key={index} className="mx-1 inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-700/10">
                                {part.replace('[', '').replace(']', '')}
                             </span>
                        );
                    }
                    return part;
                })}
            </p>
        );
      })}
    </div>
  );

  return (
    <div className="flex flex-col xl:flex-row gap-8 h-full">
        
        {/* Sticky Table of Contents (Desktop) */}
        {activeTab === 'english' && (
            <div className="hidden xl:block w-64 shrink-0">
                <div className="sticky top-24 space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Contents</h4>
                    <nav className="space-y-1 border-l border-slate-200">
                        {data.tableOfContents.map((item, idx) => (
                            <a 
                                key={idx} 
                                href="#"
                                onClick={(e) => e.preventDefault()} // In a real app, implement smooth scroll to ID
                                className="block pl-4 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:border-l-2 hover:border-indigo-600 -ml-[1px] transition-all truncate"
                            >
                                {item}
                            </a>
                        ))}
                    </nav>
                </div>
            </div>
        )}

        {/* Main Content Card */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[800px]">
            
            {/* Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white/80 backdrop-blur-sm sticky top-0 z-20">
                <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('english')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                        activeTab === 'english' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        English
                    </button>
                    <button
                        onClick={() => setActiveTab('urdu')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                        activeTab === 'urdu' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        Urdu (اردو)
                    </button>
                </div>
                
                <div className="flex items-center gap-2">
                    <button 
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy Text'}</span>
                    </button>
                </div>
            </div>

            {/* Reading Canvas */}
            <div className="p-8 md:p-16 max-w-4xl mx-auto w-full">
                
                {/* Meta Header */}
                <div className={`mb-12 ${activeTab === 'urdu' ? 'text-right' : 'text-left'}`}>
                    <div className="flex items-center gap-3 mb-6">
                         <span className="px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase bg-indigo-600 rounded-full">
                            Verified Report
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                            {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                    </div>
                    
                    <h1 className={`text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight ${activeTab === 'urdu' ? 'font-urdu' : 'font-serif'}`}>
                        {activeTab === 'english' ? data.seo.title : "تفصیلی تجزیاتی رپورٹ"}
                    </h1>
                    
                    <div className="flex items-center gap-3 pt-6 border-t border-slate-100">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-lg">🤖</div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">AI Journalist with Hasnain</p>
                            <p className="text-xs text-slate-500">Fact-Checked Investigative Unit</p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <ContentRenderer content={activeTab === 'english' ? data.blogContent : data.urduContent} isUrdu={activeTab === 'urdu'} />

            </div>
        </div>
    </div>
  );
};

export default BlogDisplay;
