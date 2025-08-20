import React, { useState } from 'react';
import { ConnectionDetails, Protocol } from '../types';

interface ConnectionManagerProps {
    onConnect: (details: ConnectionDetails) => void;
}

const ConnectionManager: React.FC<ConnectionManagerProps> = ({ onConnect }) => {
    const [host, setHost] = useState('domain-a.internal.net');
    const [user, setUser] = useState('lyra');
    const [password, setPassword] = useState('***********');
    const [protocol, setProtocol] = useState<Protocol>('SSH');
    const [isConnecting, setIsConnecting] = useState(false);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsConnecting(true);
        // Simulate network delay
        setTimeout(() => {
            onConnect({ host, user, protocol });
            setIsConnecting(false);
        }, 1000);
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-slate-800/30 backdrop-blur-xl border border-slate-300/10 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-center text-green-400 mb-2">Secure Terminal Login</h2>
            <p className="text-center text-slate-400 mb-6 text-sm">This is a simulation. No real connection is established.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="host" className="block text-sm font-medium text-slate-300">Host</label>
                    <input
                        id="host"
                        type="text"
                        value={host}
                        onChange={(e) => setHost(e.target.value)}
                        className="mt-1 block w-full bg-slate-900/50 border border-slate-600/80 rounded-md p-2 text-slate-200 focus:border-green-500 focus:ring-green-500"
                        required
                    />
                </div>
                 <div>
                    <label htmlFor="protocol" className="block text-sm font-medium text-slate-300">Protocol</label>
                    <select
                        id="protocol"
                        value={protocol}
                        onChange={(e) => setProtocol(e.target.value as Protocol)}
                        className="mt-1 block w-full bg-slate-900/50 border border-slate-600/80 rounded-md p-2 text-slate-200 focus:border-green-500 focus:ring-green-500"
                    >
                        <option>SSH</option>
                        <option>SFTP</option>
                        <option>FTP</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="user" className="block text-sm font-medium text-slate-300">Username</label>
                    <input
                        id="user"
                        type="text"
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                        className="mt-1 block w-full bg-slate-900/50 border border-slate-600/80 rounded-md p-2 text-slate-200 focus:border-green-500 focus:ring-green-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-300">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full bg-slate-900/50 border border-slate-600/80 rounded-md p-2 text-slate-200 focus:border-green-500 focus:ring-green-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={isConnecting}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-green-500"
                >
                    {isConnecting ? 'Connecting...' : 'Connect'}
                </button>
            </form>
        </div>
    );
};

export default ConnectionManager;
