import React from 'react';
import { ScriptInputs } from '../types';
import { FileText, Sparkles, AlertCircle } from 'lucide-react';

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

  const isReady = inputs.script1.trim().length > 0 && hasApiKey;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 md:p-8 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Source Materials
        </h2>
        <p className="text-slate-500 text-sm">Paste your raw transcripts below. The AI will merge, fact-check, and synthesize them.</p>
        
        {!hasApiKey && (
           <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3 text-sm text-amber-800">
             <AlertCircle className="w-5 h-5 shrink-0" />
             <p>API Key missing. Ensure <code>process.env.API_KEY</code> is set in your environment.</p>
           </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 md:p-8">
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex flex-col h-full">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Script {num}
            </label>
            <textarea
              className="flex-1 w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm leading-relaxed resize-none min-h-[250px] outline-none placeholder:text-slate-300"
              placeholder={`Paste transcript #${num} here...`}
              value={inputs[`script${num}` as keyof ScriptInputs]}
              onChange={(e) => handleChange(`script${num}` as keyof ScriptInputs, e.target.value)}
              disabled={isGenerating}
            />
          </div>
        ))}
      </div>

      <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
        <button
          onClick={onGenerate}
          disabled={!isReady || isGenerating}
          className={`
            relative overflow-hidden group px-8 py-4 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-0.5
            ${!isReady || isGenerating 
              ? 'bg-slate-300 cursor-not-allowed shadow-none' 
              : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200'
            }
          `}
        >
          <div className="flex items-center gap-3 relative z-10">
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Investigative Blog</span>
              </>
            )}
          </div>
        </button>
      </div>
    </div>
  );
};

export default InputSection;
