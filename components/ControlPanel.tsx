
import React from 'react';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface ControlPanelProps {
  onOrchestrate: (taskName: string, taskDescription: string) => void;
  isProcessing: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ onOrchestrate, isProcessing }) => {
  const tasks = [
    {
      name: 'Sync Knowledge Bases',
      description: 'Synchronize "Project Phoenix" documentation across both domains.',
    },
    {
      name: 'Update Presentation Assets',
      description: 'Review and update Q3 presentation assets with the latest data.',
    },
    {
      name: 'Harmonize Compliance Docs',
      description: 'Ensure all compliance documents are aligned with the new regulatory standards.',
    },
  ];

  return (
    <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-300/10 rounded-2xl shadow-lg p-6">
      <h2 className="text-lg font-semibold text-sky-400 mb-4">Orchestration Control</h2>
      <div className="space-y-3">
        {tasks.map((task) => (
          <button
            key={task.name}
            onClick={() => onOrchestrate(task.name, task.description)}
            disabled={isProcessing}
            className="w-full flex items-center justify-center text-left px-4 py-3 bg-slate-700/50 hover:bg-slate-700/80 disabled:bg-slate-800/50 disabled:cursor-not-allowed disabled:text-slate-500 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            {isProcessing ? (
               <SpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
            ) : null}
            <span className="flex-grow">{task.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ControlPanel;
