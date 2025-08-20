
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Domain, AgentStatus, AuditLogEntry, LedgerStatus } from '../types';
import ControlPanel from './ControlPanel';
import DomainCard from './DomainCard';
import MetaAgentPanel from './MetaAgentPanel';
import AuditTrail from './AuditTrail';
import { getSupervisoryRecommendation } from '../services/geminiService';
import { dbService, STORE_NAMES } from '../services/dbService';

const initialDomains: Domain[] = [
  {
    id: 'A',
    name: 'Domain A (Core R&D)',
    agent: {
      name: 'Lyra',
      status: AgentStatus.Idle,
      contextLedger: [],
    },
    knowledgeBase: [
      { id: 'kb-a-1', name: 'Project Phoenix Specs', version: 'v1.0', lastUpdated: '2023-10-26' },
      { id: 'kb-a-2', name: 'Q3 Financials', version: 'v2.1', lastUpdated: '2023-09-15' },
    ],
  },
  {
    id: 'B',
    name: 'Domain B (Deployment)',
    agent: {
      name: 'Kara',
      status: AgentStatus.Idle,
      contextLedger: [],
    },
    knowledgeBase: [
      { id: 'kb-b-1', name: 'Project Phoenix Specs', version: 'v0.9', lastUpdated: '2023-10-20' },
      { id: 'kb-b-2', name: 'Deployment Playbook', version: 'v3.5', lastUpdated: '2023-10-22' },
    ],
  },
];

const Dashboard: React.FC = () => {
  const [domains, setDomains] = useState<Domain[]>(initialDomains);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [metaRecommendation, setMetaRecommendation] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    const loadState = async () => {
      try {
        const storedDomains = await dbService.get<Domain[]>(STORE_NAMES.DASHBOARD, 'domains');
        const storedAuditLog = await dbService.get<AuditLogEntry[]>(STORE_NAMES.DASHBOARD, 'auditLog');

        if (storedDomains) {
          setDomains(storedDomains);
        }
        if (storedAuditLog) {
          setAuditLog(storedAuditLog);
        }
      } catch (error) {
        console.error("Failed to load state from IndexedDB", error);
      } finally {
        isInitialLoad.current = false;
      }
    };
    loadState();
  }, []);

  useEffect(() => {
    if (isInitialLoad.current) return;
    
    const saveState = async () => {
        try {
            await dbService.set(STORE_NAMES.DASHBOARD, 'domains', domains);
            await dbService.set(STORE_NAMES.DASHBOARD, 'auditLog', auditLog);
        } catch(error) {
            console.error("Failed to save state to IndexedDB", error);
        }
    };
    saveState();
  }, [domains, auditLog]);

  const addAuditLog = useCallback((message: string, type: AuditLogEntry['type']) => {
    setAuditLog(prev => [{ id: Date.now().toString(), timestamp: new Date().toISOString(), message, type }, ...prev].slice(0, 100));
  }, []);

  const handleOrchestration = useCallback(async (taskName: string, taskDescription: string) => {
    setIsProcessing(true);
    setMetaRecommendation('');
    addAuditLog(`API Call: Orchestration triggered for "${taskName}"`, 'API_CALL');
    
    setDomains(prev => prev.map(d => ({ ...d, agent: { ...d.agent, status: AgentStatus.Syncing } })));
    addAuditLog(`System Status: Agents Lyra & Kara entering SYNC state.`, 'SYSTEM_STATUS');

    const recommendation = await getSupervisoryRecommendation(taskDescription);
    setMetaRecommendation(recommendation);
    addAuditLog(`GEMINI says: "${recommendation}"`, 'META_AGENT');

    // Simulate work
    setTimeout(() => {
      const timestamp = new Date();
      const formattedTimestamp = timestamp.toLocaleTimeString();

      setDomains(prev => {
        const newDomains = [...prev];
        const targetAsset = newDomains[0].knowledgeBase.find(asset => asset.name === 'Project Phoenix Specs');
        if (targetAsset) {
            const currentVersion = parseFloat(targetAsset.version.replace('v', ''));
            const newVersion = `v${(currentVersion + 0.1).toFixed(1)}`;
            
            return newDomains.map((d): Domain => ({
                ...d,
                agent: {
                    ...d.agent,
                    status: AgentStatus.Idle,
                    contextLedger: [{
                        id: `ledger-${d.id}-${Date.now()}`,
                        task: taskName,
                        rationale: 'Cross-domain knowledge synchronization.',
                        timestamp: formattedTimestamp,
                        status: LedgerStatus.Completed
                    }, ...d.agent.contextLedger].slice(0, 10)
                },
                knowledgeBase: d.knowledgeBase.map(asset => asset.name === 'Project Phoenix Specs' ? { ...asset, version: newVersion, lastUpdated: timestamp.toISOString().split('T')[0] } : asset)
            }));
        }
        return prev;
      });

      addAuditLog(`Agent Action: Lyra & Kara completed "${taskName}". Project Phoenix now at v1.1.`, 'AGENT_ACTION');
      addAuditLog(`System Status: Agents returned to IDLE state.`, 'SYSTEM_STATUS');
      setIsProcessing(false);
    }, 2500);

  }, [addAuditLog]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
            <ControlPanel onOrchestrate={handleOrchestration} isProcessing={isProcessing} />
            <MetaAgentPanel recommendation={metaRecommendation} isProcessing={isProcessing} />
        </div>
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {domains.map(domain => (
            <DomainCard key={domain.id} domain={domain} />
          ))}
        </div>
      </div>
      <AuditTrail logs={auditLog} />
    </div>
  );
};

export default Dashboard;
