import React, { useState, useEffect, useCallback } from 'react';
import { ConnectionDetails, DirectoryNode } from '../types';
import ConnectionManager from './ConnectionManager';
import FileExplorer from './FileExplorer';
import Terminal from './Terminal';
import { dbService, STORE_NAMES } from '../services/dbService';
import { initialFileSystem } from '../services/mockFileSystem';

interface SecureTerminalState {
    connection: ConnectionDetails | null;
    fileSystem: DirectoryNode;
}

const SecureTerminal: React.FC = () => {
    const [connection, setConnection] = useState<ConnectionDetails | null>(null);
    const [fileSystem, setFileSystem] = useState<DirectoryNode>(initialFileSystem);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    useEffect(() => {
        const loadState = async () => {
            try {
                const storedState = await dbService.get<SecureTerminalState>(STORE_NAMES.SECURE_TERMINAL, 'state');
                if (storedState) {
                    setConnection(storedState.connection);
                    setFileSystem(storedState.fileSystem);
                }
            } catch (error) {
                console.error('Failed to load terminal state from IndexedDB', error);
            } finally {
                setIsLoaded(true);
            }
        };
        loadState();
    }, []);

    const saveState = useCallback(async (conn: ConnectionDetails | null, fs: DirectoryNode) => {
        try {
            await dbService.set(STORE_NAMES.SECURE_TERMINAL, 'state', { connection: conn, fileSystem: fs });
        } catch (error) {
            console.error('Failed to save terminal state to IndexedDB', error);
        }
    }, []);
    
    const handleConnect = (details: ConnectionDetails) => {
        setConnection(details);
        // Reset file system on new connection for this simulation
        setFileSystem(initialFileSystem);
        saveState(details, initialFileSystem);
    };

    const handleDisconnect = () => {
        const conn = null;
        setConnection(conn);
        saveState(conn, fileSystem);
    };

    const handleFileSystemUpdate = useCallback((newFs: DirectoryNode) => {
        setFileSystem(newFs);
        saveState(connection, newFs);
    }, [connection, saveState]);

    if (!isLoaded) {
        return <div className="flex justify-center items-center h-64"><p>Loading Terminal State...</p></div>;
    }
    
    if (!connection) {
        return <ConnectionManager onConnect={handleConnect} />;
    }

    return (
        <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-300/10 rounded-2xl shadow-lg overflow-hidden">
            <div className="flex justify-between items-center p-3 border-b border-slate-300/10">
                <h2 className="text-lg font-semibold text-green-400">
                    Secure Session (Simulated)
                </h2>
                <div className="flex items-center space-x-4">
                     <p className="text-sm text-slate-300">Connected to <span className="font-mono text-green-300">{connection.host}</span> as <span className="font-mono text-green-300">{connection.user}</span></p>
                    <button onClick={handleDisconnect} className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded-md text-white text-sm font-semibold">
                        Disconnect
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                <div className="lg:col-span-3 border-r border-slate-300/10">
                    <FileExplorer fileSystem={fileSystem} />
                </div>
                <div className="lg:col-span-9">
                    <Terminal 
                        connection={connection} 
                        fileSystem={fileSystem}
                        onFileSystemUpdate={handleFileSystemUpdate}
                    />
                </div>
            </div>
        </div>
    );
};

export default SecureTerminal;
