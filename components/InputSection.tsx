import React from 'react';
import { ScriptInputs } from '../types';
import { FileText, Sparkles, AlertCircle, CheckCircle2, Eraser } from 'lucide-react';

interface InputSectionProps {
  inputs: ScriptInputs;
  setInputs: React.Dispatch<React.SetStateAction<ScriptInputs>>;
  onGenerate: () => void;
  isGenerating: boolean;
  hasApiKey: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ inputs, setInputs, onGenerate, isGenerating, hasApiKey }) => {
  const handleChange = (key: keyof ScriptInputs, value: string) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const handleClear = (key: keyof ScriptInputs) => {
    setInputs(prev => ({ ...prev, [key]: '' }));
  };

  // Check if we have at least one script with substantial content
  const hasContent = Object.values(inputs).some(s => s.trim().length > 50);
  const isReady = hasContent && hasApiKey;

  const renderInputCard = (num: number) => {
    const key = `script${num}` as keyof ScriptInputs;
    const value = inputs[key];
    const wordCount = value.trim().length > 0 ? value.trim().split(/\s+/).length : 0;

    return (
      <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 hover:border-indigo-200 transition-colors duration-300 overflow-hidden group">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px]">
              {num}
            </span>
            Transcript Source
          </label>
          {wordCount > 0 && (
            <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {wordCount} words
            </span>
          )}
        </div>
        <div className="relative flex-1">
            <textarea
              className="w-full h-full p-4 text-sm leading-relaxed text-slate-700 bg-white resize-none outline-none focus:bg-indigo-50/10 transition-colors placeholder:text-slate-300 min-h-[200px]"
              placeholder={`Paste the full transcript for source #${num} here...`}
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
              disabled={isGenerating}
            />
            {value.length > 0 && (
                <button 
                    onClick={() => handleClear(key)}
                    className="absolute bottom-3 right-3 p-1.5 text-slate-300 hover:text-red-400 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
                    title="Clear text"
                >
                    <Eraser className="w-4 h-4" />
                </button>
            )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {!hasApiKey && (
           <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-sm text-amber-900 shadow-sm">
             <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
             <div>
                <p className="font-bold">API Key Missing</p>
                <p className="text-amber-800/80 mt-1">This application requires a valid API key in <code>process.env.API_KEY</code> to function.</p>
             </div>
           </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderInputCard(1)}
        {renderInputCard(2)}
        {renderInputCard(3)}
      </div>

      <div className="flex flex-col items-center justify-center pt-4">
        <button
          onClick={onGenerate}
          disabled={!isReady || isGenerating}
          className={`
            relative overflow-hidden group px-10 py-5 rounded-2xl font-bold text-lg shadow-xl transition-all transform hover:-translate-y-1
            ${!isReady || isGenerating 
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200 ring-4 ring-indigo-50'
            }
          `}
        >
          <div className="flex items-center gap-3 relative z-10">
             <Sparkles className={`w-5 h-5 ${isReady ? 'animate-pulse' : ''}`} />
             <span>Initialize Journalist Engine</span>
          </div>
        </button>
        <p className="mt-4 text-xs text-slate-400 uppercase tracking-widest font-medium">
            AI Journalist with Hasnain
        </p>
      </div>
    </div>
  );
};

export default InputSection;
