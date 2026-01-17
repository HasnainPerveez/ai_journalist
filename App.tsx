import React, { useState } from 'react';
import { ScriptInputs, GenerationState } from './types';
import { generateBlogFromScripts } from './services/geminiService';
import InputSection from './components/InputSection';
import BlogDisplay from './components/BlogDisplay';
import AnalysisDashboard from './components/AnalysisDashboard';
import { Newspaper, Loader2 } from 'lucide-react';

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

  const handleGenerate = async () => {
    if (!process.env.API_KEY) {
      alert("API Key is missing from environment variables.");
      return;
    }

    setGenerationState({ isGenerating: true, stage: 'merging' });

    try {
      const data = await generateBlogFromScripts(
        [inputs.script1, inputs.script2, inputs.script3],
        process.env.API_KEY,
        (stage) => setGenerationState(prev => ({ ...prev, stage: stage as any }))
      );
      setGenerationState({ isGenerating: false, stage: 'complete', data });
    } catch (error) {
      setGenerationState({ 
        isGenerating: false, 
        stage: 'error', 
        error: error instanceof Error ? error.message : "An unexpected error occurred" 
      });
    }
  };

  // Progress Bar Helper
  const getProgress = () => {
    switch(generationState.stage) {
      case 'merging': return 25;
      case 'fact-checking': return 50;
      case 'writing': return 75;
      case 'translating': return 90;
      case 'complete': return 100;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Newspaper className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">VeriScript</h1>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">AI Investigative Suite</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-600">
                v1.0.0
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Hero / Input Section */}
        {generationState.stage === 'idle' || generationState.stage === 'error' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Turn Raw Transcripts into Verified Journalism</h2>
              <p className="text-lg text-slate-600">
                Input your broadcast scripts. We merge, fact-check against global sources, and write a production-ready news blog.
              </p>
              {generationState.stage === 'error' && (
                <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
                  Error: {generationState.error}
                </div>
              )}
            </div>
            
            <InputSection 
              inputs={inputs} 
              setInputs={setInputs} 
              onGenerate={handleGenerate}
              isGenerating={generationState.isGenerating}
              hasApiKey={!!process.env.API_KEY}
            />
          </div>
        ) : null}

        {/* Loading State */}
        {generationState.isGenerating && (
          <div className="max-w-xl mx-auto text-center py-20 animate-in fade-in duration-500">
            <div className="mb-8 relative">
              <div className="w-16 h-16 mx-auto bg-blue-50 rounded-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {generationState.stage === 'merging' && "Merging Scripts & Identifying Topics..."}
              {generationState.stage === 'fact-checking' && "Verifying Claims with Global Sources..."}
              {generationState.stage === 'writing' && "Drafting Investigative Report..."}
              {generationState.stage === 'translating' && "Generating Urdu Edition..."}
            </h3>
            <p className="text-slate-500 mb-8">This requires complex reasoning. Please wait.</p>
            
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden max-w-sm mx-auto">
              <div 
                className="h-full bg-blue-600 transition-all duration-1000 ease-out"
                style={{ width: `${getProgress()}%` }}
              />
            </div>
          </div>
        )}

        {/* Results View */}
        {generationState.stage === 'complete' && generationState.data && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Left Column: Blog Content */}
            <div className="lg:col-span-8">
               <BlogDisplay data={generationState.data} />
            </div>

            {/* Right Column: Analysis & Assets */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg mb-6">
                 <h3 className="font-bold text-lg mb-2">Ready to Publish?</h3>
                 <p className="text-blue-100 text-sm mb-4">Review the verification report below before publishing. Verified claims are prioritized.</p>
                 <button 
                  onClick={() => window.location.reload()}
                  className="w-full py-2 bg-white text-blue-600 rounded-lg font-bold text-sm hover:bg-blue-50 transition-colors"
                 >
                   Start New Project
                 </button>
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
