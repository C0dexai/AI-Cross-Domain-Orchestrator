
import React from 'react';
import { GeminiIcon } from './icons/GeminiIcon';
import { OpenAIIcon } from './icons/OpenAIIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface MetaAgentPanelProps {
  recommendation: string;
  isProcessing: boolean;
}

const MetaAgentPanel: React.FC<MetaAgentPanelProps> = ({ recommendation, isProcessing }) => {
  return (
    <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-300/10 rounded-2xl shadow-lg p-6">
      <h2 className="text-lg font-semibold text-purple-400 mb-4">Meta-Agent Supervision</h2>
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center space-x-2">
          <GeminiIcon className="w-6 h-6" />
          <span className="font-medium text-slate-300">Gemini</span>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        </div>
        <div className="flex items-center space-x-2">
          <OpenAIIcon className="w-5 h-5" />
          <span className="font-medium text-slate-300">OpenAI</span>
           <div className="w-2 h-2 rounded-full bg-green-500"></div>
        </div>
      </div>
      <div className="bg-black/20 p-4 rounded-lg min-h-[80px] flex items-center justify-center">
        {isProcessing && !recommendation && (
            <div className="flex items-center space-x-2 text-slate-400">
                <SpinnerIcon className="animate-spin h-5 w-5" />
                <span>Awaiting supervisory input...</span>
            </div>
        )}
        {recommendation && (
            <p className="text-slate-300 italic text-center">"{recommendation}"</p>
        )}
        {!isProcessing && !recommendation && (
             <p className="text-slate-500 italic text-center">Standing by for orchestration task.</p>
        )}
      </div>
    </div>
  );
};

export default MetaAgentPanel;
