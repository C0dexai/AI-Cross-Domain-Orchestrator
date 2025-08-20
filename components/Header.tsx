import React from 'react';
import { SyncIcon } from './icons/SyncIcon';
import { AgentIcon } from './icons/AgentIcon';
import { TerminalIcon } from './icons/TerminalIcon';
import { ServerIcon } from './icons/ServerIcon';
import { CloudUploadIcon } from './icons/CloudUploadIcon';
import { ActiveTab } from '../App';

interface HeaderProps {
    activeTab: ActiveTab;
    setActiveTab: (tab: ActiveTab) => void;
}


const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const commonTabClass = "flex items-center space-x-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors";
  const activeTabClass = "bg-sky-500/40 text-white";
  const inactiveTabClass = "text-slate-300 hover:bg-slate-300/10 hover:text-white";
  
  return (
    <header className="sticky top-0 z-50 bg-slate-900/60 backdrop-blur-lg border-b border-slate-300/10 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <SyncIcon className="w-8 h-8 text-sky-400" />
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Cross-Domain AI Orchestrator
          </h1>
        </div>
        <nav className="flex items-center space-x-1 bg-slate-800/30 p-1 rounded-lg">
           <button
             onClick={() => setActiveTab('orchestrator')}
             className={`${commonTabClass} ${activeTab === 'orchestrator' ? activeTabClass : inactiveTabClass}`}
             aria-current={activeTab === 'orchestrator' ? 'page' : undefined}
           >
             <AgentIcon className="w-5 h-5" />
             <span>Orchestrator</span>
           </button>
           <button
             onClick={() => setActiveTab('api_inspector')}
             className={`${commonTabClass} ${activeTab === 'api_inspector' ? activeTabClass : inactiveTabClass}`}
             aria-current={activeTab === 'api_inspector' ? 'page' : undefined}
           >
             <TerminalIcon className="w-5 h-5" />
             <span>API Inspector</span>
           </button>
           <button
             onClick={() => setActiveTab('secure_terminal')}
             className={`${commonTabClass} ${activeTab === 'secure_terminal' ? activeTabClass : inactiveTabClass}`}
             aria-current={activeTab === 'secure_terminal' ? 'page' : undefined}
           >
             <ServerIcon className="w-5 h-5" />
             <span>Secure Terminal</span>
           </button>
           <button
             onClick={() => setActiveTab('deployments')}
             className={`${commonTabClass} ${activeTab === 'deployments' ? activeTabClass : inactiveTabClass}`}
             aria-current={activeTab === 'deployments' ? 'page' : undefined}
           >
             <CloudUploadIcon className="w-5 h-5" />
             <span>Deployments</span>
           </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
