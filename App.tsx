import React, { useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import APIManager from './components/APIManager';
import SecureTerminal from './components/SecureTerminal';
import PageDeployer from './components/PageDeployer';
import LandingPage from './components/LandingPage';

export type ActiveTab = 'orchestrator' | 'api_inspector' | 'secure_terminal' | 'deployments';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('orchestrator');
  const [showLandingPage, setShowLandingPage] = useState(true);

  if (showLandingPage) {
    return <LandingPage onLaunch={() => setShowLandingPage(false)} />;
  }

  return (
    <div className="min-h-screen text-slate-200 font-sans">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="p-4 sm:p-6 lg:p-8">
        {activeTab === 'orchestrator' && <Dashboard />}
        {activeTab === 'api_inspector' && <APIManager />}
        {activeTab === 'secure_terminal' && <SecureTerminal />}
        {activeTab === 'deployments' && <PageDeployer />}
      </main>
      <footer className="text-center p-4 text-xs text-slate-500">
        <p>Cross-Domain AI Orchestration Platform | Status: Fully Operational</p>
      </footer>
    </div>
  );
};

export default App;
