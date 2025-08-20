import React from 'react';
import { SyncIcon } from './icons/SyncIcon';
import { AgentIcon } from './icons/AgentIcon';
import { TerminalIcon } from './icons/TerminalIcon';
import { CloudUploadIcon } from './icons/CloudUploadIcon';

interface LandingPageProps {
  onLaunch: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLaunch }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 text-white font-sans overflow-y-auto">
      <div className="w-full max-w-4xl mx-auto bg-slate-900/40 backdrop-blur-xl border border-purple-400/30 rounded-2xl shadow-2xl shadow-purple-500/20">
        <div className="p-8 sm:p-12 lg:p-16 text-center">

          <div className="flex justify-center items-center gap-4 mb-6">
            <SyncIcon className="w-12 h-12 text-sky-400" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter" style={{ textShadow: '0 0 10px #0ea5e9, 0 0 20px #0ea5e9' }}>
              AI Cross-Domain Orchestrator
            </h1>
          </div>
          
          <p className="max-w-2xl mx-auto mt-4 text-lg text-slate-300">
            A dashboard to monitor and manage AI agents collaborating across two distinct domains, coordinating updates, upgrades, and knowledge synchronization.
          </p>

          <button
            onClick={onLaunch}
            className="mt-10 px-10 py-4 bg-sky-500 text-white font-bold text-xl rounded-lg shadow-lg shadow-sky-500/50 hover:bg-sky-400 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-sky-300 focus:ring-opacity-50"
          >
            Launch Orchestrator
          </button>
        </div>

        <div className="border-t border-purple-500/30 p-8 sm:p-10">
          <h2 className="text-2xl font-bold text-center text-purple-400 mb-6" style={{ textShadow: '0 0 8px #c084fc' }}>Core Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 p-3 bg-slate-700/50 rounded-lg">
                <AgentIcon className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Agent Supervision</h3>
                <p className="text-slate-400 text-sm">Monitor and direct AI agents Lyra & Kara in real-time.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 p-3 bg-slate-700/50 rounded-lg">
                <TerminalIcon className="w-6 h-6 text-sky-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">API Inspector</h3>
                <p className="text-slate-400 text-sm">Craft, send, and inspect API requests to any endpoint.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 p-3 bg-slate-700/50 rounded-lg">
                <CloudUploadIcon className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Page Deployments</h3>
                <p className="text-slate-400 text-sm">Generate and deploy static pages with AI assistance.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
       <footer className="text-center p-4 mt-8 text-xs text-slate-400/80">
          <p>AI Cross-Domain Orchestration Platform | Status: Ready for Initialization</p>
        </footer>
    </div>
  );
};

export default LandingPage;
