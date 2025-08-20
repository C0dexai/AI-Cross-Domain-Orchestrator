
import React from 'react';
import { Domain, AgentStatus } from '../types';
import { AgentIcon } from './icons/AgentIcon';
import { DocumentIcon } from './icons/DocumentIcon';
import { LedgerIcon } from './icons/LedgerIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface DomainCardProps {
  domain: Domain;
}

const statusColors: { [key in AgentStatus]: string } = {
  [AgentStatus.Idle]: 'text-green-400',
  [AgentStatus.Syncing]: 'text-yellow-400 animate-pulse',
  [AgentStatus.Updating]: 'text-blue-400',
  [AgentStatus.AwaitingApproval]: 'text-orange-400',
  [AgentStatus.Error]: 'text-red-500',
};

const DomainCard: React.FC<DomainCardProps> = ({ domain }) => {
  return (
    <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-300/10 rounded-2xl shadow-lg flex flex-col h-full">
      <div className="p-4 border-b border-slate-300/10">
        <h3 className="font-bold text-lg text-slate-100">{domain.name}</h3>
      </div>
      
      {/* Agent Status */}
      <div className="p-4 border-b border-slate-300/10">
        <div className="flex items-center justify-between">
           <div className="flex items-center space-x-3">
            <AgentIcon className="w-6 h-6 text-slate-400" />
            <span className="font-semibold text-slate-300">{domain.agent.name}</span>
          </div>
          <div className={`flex items-center space-x-2 text-sm font-medium ${statusColors[domain.agent.status]}`}>
            {domain.agent.status === AgentStatus.Syncing && <SpinnerIcon className="w-4 h-4 animate-spin" />}
            <span>{domain.agent.status}</span>
          </div>
        </div>
      </div>

      {/* Context Ledger */}
      <div className="p-4 flex-grow">
        <div className="flex items-center space-x-3 mb-3">
          <LedgerIcon className="w-5 h-5 text-slate-400" />
          <h4 className="font-semibold text-slate-300">Context Ledger</h4>
        </div>
        <div className="space-y-2 text-xs h-24 overflow-y-auto pr-2">
          {domain.agent.contextLedger.length > 0 ? (
            domain.agent.contextLedger.map(entry => (
              <div key={entry.id} className="bg-black/20 p-2 rounded">
                <p className="text-slate-400"><span className="font-bold text-slate-300">{entry.task}</span> - {entry.status} at {entry.timestamp}</p>
                <p className="text-slate-500 italic">"{entry.rationale}"</p>
              </div>
            ))
          ) : (
            <p className="text-slate-500 italic">No recent activity.</p>
          )}
        </div>
      </div>

      {/* Knowledge Base */}
      <div className="p-4 border-t border-slate-300/10">
        <div className="flex items-center space-x-3 mb-3">
            <DocumentIcon className="w-5 h-5 text-slate-400" />
            <h4 className="font-semibold text-slate-300">Knowledge Base</h4>
        </div>
        <ul className="space-y-2 text-sm">
          {domain.knowledgeBase.map(asset => (
            <li key={asset.id} className="flex justify-between items-center bg-slate-700/40 p-2 rounded-md">
              <span className="text-slate-300">{asset.name}</span>
              <span className="font-mono text-xs bg-slate-600 text-sky-300 px-2 py-0.5 rounded">{asset.version}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DomainCard;
