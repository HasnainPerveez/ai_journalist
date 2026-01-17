import React, { useState } from 'react';
import { ScriptInputs, GenerationState } from './types';
import { generateBlogFromScripts } from './services/geminiService';
import InputSection from './components/InputSection';
import BlogDisplay from './components/BlogDisplay';
import AnalysisDashboard from './components/AnalysisDashboard';
import { Newspaper, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  const [inputs, setInputs] = useState<ScriptInputs>({
    script1: '',
    script2: '',
    script3: ''
  });

  const [generationState, setGenerationState] = useState<GenerationState>({
    isGenerating: false,
    stage: 'idle'
  });

  // UX State for view switching
  const [currentView, setCurrentView] = useState<'input' | 'processing' | 'result'>('input');

  const handleGenerate = async () => {
    if (!process.env.API_KEY) {
      alert("API Key is missing from environment variables.");
      return;
    }

    setGenerationState({ isGenerating: true, stage: 'merging' });
    setCurrentView('processing');

    try {
      const data = await generateBlogFromScripts(
        [inputs.script1, inputs.script2, inputs.script3],
        process.env.API_KEY,
        (stage) => setGenerationState(prev => ({ ...prev, stage: stage as any }))
      );
      setGenerationState({ isGenerating: false, stage: 'complete', data });
      setCurrentView('result');
    } catch (error) {
      setGenerationState({ 
        isGenerating: false, 
        stage: 'error', 
        error: error instanceof Error ? error.message : "An unexpected error occurred" 
      });
      setCurrentView('input'); // Return to input on error
    }
  };

  const StepIndicator = ({ step, label, current }: { step: number, label: string, current: string }) => {
    const isActive = current === label;
    const isCompleted = current === 'complete' || (label === 'merging' && current !== 'merging'); 
    // Simplified logic for demo visuals

    return (
      <div className={`flex items-center gap-3 transition-all duration-500 ${isActive ? 'opacity-100 scale-105' : 'opacity-40'}`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 
          ${isActive ? 'border-indigo-600 text-indigo-600 bg-white' : 'border-slate-300 text-slate-400 bg-slate-50'}`}>
           {isActive ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>{step}</span>}
        </div>
        <span className="font-bold text-slate-800">{label.charAt(0).toUpperCase() + label.slice(1)}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* Premium Header */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => window.location.reload()}>
              <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-200">
                <Newspaper className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">AI Journalist</h1>
                <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider mt-1">with Hasnain</span>
              </div>
            </div>
            
            {currentView === 'result' && (
                <button 
                    onClick={() => {
                        setInputs({ script1: '', script2: '', script3: '' });
                        setCurrentView('input');
                        setGenerationState({ isGenerating: false, stage: 'idle' });
                    }}
                    className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
                >
                    New Investigation
                </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* VIEW 1: INPUT */}
        {currentView === 'input' && (
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12 fade-in-up">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight font-serif">
                        Your Digital Newsroom Awaits.
                    </h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Transform raw live telecast transcripts into verified, high-quality investigative journalism in minutes.
                    </p>
                </div>
                
                <InputSection 
                    inputs={inputs} 
                    setInputs={setInputs} 
                    onGenerate={handleGenerate} 
                    isGenerating={false}
                    hasApiKey={!!process.env.API_KEY}
                />
            </div>
        )}

        {/* VIEW 2: PROCESSING */}
        {currentView === 'processing' && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] fade-in-up">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-slate-900 mb-2 font-serif">Synthesizing Story...</h3>
                        <p className="text-slate-500">Our AI agents are verifying facts and drafting the narrative.</p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 space-y-6">
                        <div className={`flex items-center gap-4 transition-all duration-300 ${generationState.stage === 'merging' ? 'opacity-100' : 'opacity-40'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${generationState.stage === 'merging' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100'}`}>
                                {generationState.stage === 'merging' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                            </div>
                            <span className="font-medium">Contextualizing Sources</span>
                        </div>

                        <div className={`flex items-center gap-4 transition-all duration-300 ${generationState.stage === 'fact-checking' ? 'opacity-100' : 'opacity-40'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${generationState.stage === 'fact-checking' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100'}`}>
                                {generationState.stage === 'fact-checking' ? <Loader2 className="w-4 h-4 animate-spin" /> : <div className="w-2 h-2 rounded-full bg-slate-300" />}
                            </div>
                            <span className="font-medium">Verifying Claims (Google Search)</span>
                        </div>

                        <div className={`flex items-center gap-4 transition-all duration-300 ${generationState.stage === 'writing' ? 'opacity-100' : 'opacity-40'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${generationState.stage === 'writing' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100'}`}>
                                {generationState.stage === 'writing' ? <Loader2 className="w-4 h-4 animate-spin" /> : <div className="w-2 h-2 rounded-full bg-slate-300" />}
                            </div>
                            <span className="font-medium">Drafting Editorial Content</span>
                        </div>

                        <div className={`flex items-center gap-4 transition-all duration-300 ${generationState.stage === 'translating' ? 'opacity-100' : 'opacity-40'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${generationState.stage === 'translating' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100'}`}>
                                {generationState.stage === 'translating' ? <Loader2 className="w-4 h-4 animate-spin" /> : <div className="w-2 h-2 rounded-full bg-slate-300" />}
                            </div>
                            <span className="font-medium">Translating to Urdu</span>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* VIEW 3: RESULTS */}
        {currentView === 'result' && generationState.data && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 fade-in-up">
                {/* Main Article */}
                <div className="lg:col-span-8 order-2 lg:order-1">
                    <BlogDisplay data={generationState.data} />
                </div>

                {/* Sidebar Dashboard */}
                <div className="lg:col-span-4 order-1 lg:order-2 space-y-6">
                    <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-xl bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                         <h3 className="text-xl font-bold font-serif mb-2">Investigation Complete</h3>
                         <p className="text-indigo-200 text-sm mb-4">Your report has been fact-checked against global sources.</p>
                         <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
                             <CheckCircle2 className="w-4 h-4" />
                             Ready for publication
                         </div>
                    </div>
                    <AnalysisDashboard data={generationState.data} />
                </div>
            </div>
        )}

      </main>
    </div>
  );
};

export default App;
