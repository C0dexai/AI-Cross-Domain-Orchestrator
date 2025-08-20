
import React from 'react';
import { AuditLogEntry } from '../types';

interface AuditTrailProps {
  logs: AuditLogEntry[];
}

const getLogStyle = (type: AuditLogEntry['type']) => {
  switch (type) {
    case 'API_CALL':
      return {
        icon: '❯',
        color: 'text-cyan-400',
      };
    case 'AGENT_ACTION':
      return {
        icon: '✓',
        color: 'text-green-400',
      };
    case 'META_AGENT':
      return {
        icon: '✧',
        color: 'text-purple-400',
      };
    case 'SYSTEM_STATUS':
      return {
        icon: 'i',
        color: 'text-yellow-400',
      };
    default:
      return {
        icon: '•',
        color: 'text-slate-500',
      };
  }
};


const AuditTrail: React.FC<AuditTrailProps> = ({ logs }) => {
  return (
    <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-300/10 rounded-2xl shadow-lg p-6">
      <h2 className="text-lg font-semibold text-slate-300 mb-4">Global Audit Trail</h2>
      <div className="bg-black/30 rounded-lg p-4 h-64 overflow-y-auto font-mono text-xs">
        {logs.length > 0 ? (
          logs.map(log => {
            const { icon, color } = getLogStyle(log.type);
            return (
              <div key={log.id} className="flex items-start mb-2 last:mb-0">
                <span className={`mr-3 font-bold ${color}`}>{icon}</span>
                <span className="text-slate-500 mr-3">{new Date(log.timestamp).toLocaleTimeString()}</span>
                <p className="flex-1 text-slate-400 break-words">{log.message}</p>
              </div>
            )
          })
        ) : (
          <p className="text-slate-500 italic">No system events recorded yet.</p>
        )}
      </div>
    </div>
  );
};

export default AuditTrail;
