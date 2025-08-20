import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ConnectionDetails, DirectoryNode, TerminalLine } from '../types';
import { terminalService } from '../services/terminalService';
import { dbService, STORE_NAMES } from '../services/dbService';

interface TerminalProps {
    connection: ConnectionDetails;
    fileSystem: DirectoryNode;
    onFileSystemUpdate: (newFs: DirectoryNode) => void;
}

const Terminal: React.FC<TerminalProps> = ({ connection, fileSystem, onFileSystemUpdate }) => {
    const [lines, setLines] = useState<TerminalLine[]>([]);
    const [cwd, setCwd] = useState<string>('/');
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const endOfTerminalRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const prompt = `${connection.user}@${connection.host}:${cwd === '/' ? '~' : `~${cwd}`}$ `;

    useEffect(() => {
        const loadTerminalState = async () => {
             try {
                const storedCwd = await dbService.get<string>(STORE_NAMES.SECURE_TERMINAL, 'cwd');
                const storedHistory = await dbService.get<string[]>(STORE_NAMES.SECURE_TERMINAL, 'history');
                if (storedCwd) setCwd(storedCwd);
                if (storedHistory) setHistory(storedHistory);
            } catch (error) {
                console.error("Failed to load terminal CWD/History", error);
            }
        };
        loadTerminalState();
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        endOfTerminalRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [lines]);

    const handleCommand = useCallback((command: string) => {
        const newHistory = [command, ...history.filter(h => h !== command)].slice(0, 50);
        setHistory(newHistory);
        setHistoryIndex(-1);
        dbService.set(STORE_NAMES.SECURE_TERMINAL, 'history', newHistory);

        const result = terminalService.execute(command, cwd, connection.user, fileSystem);
        
        const outputLines: TerminalLine[] = [];
        if (result.output) {
            outputLines.push({ id: Date.now() + 1, type: 'output', text: result.output });
        }

        if (result.clear) {
            setLines([]);
            return;
        }

        setLines(prev => [...prev, { id: Date.now(), type: 'input', text: command, prompt }, ...outputLines]);

        if (result.newCwd !== undefined) {
            setCwd(result.newCwd);
            dbService.set(STORE_NAMES.SECURE_TERMINAL, 'cwd', result.newCwd);
        }
        if (result.newFs !== undefined) {
            onFileSystemUpdate(result.newFs);
        }

    }, [cwd, fileSystem, history, connection.user, onFileSystemUpdate]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (input.trim()) {
                handleCommand(input);
            } else {
                 setLines(prev => [...prev, { id: Date.now(), type: 'input', text: '', prompt }]);
            }
            setInput('');
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (history.length > 0) {
                const newIndex = Math.min(historyIndex + 1, history.length - 1);
                setHistoryIndex(newIndex);
                setInput(history[newIndex]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex >= 0) {
                const newIndex = Math.max(historyIndex - 1, -1);
                setHistoryIndex(newIndex);
                setInput(newIndex === -1 ? '' : history[newIndex]);
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const commands = ['ls', 'cd', 'cat', 'mkdir', 'pwd', 'whoami', 'ssh', 'help', 'clear'];
            const matchingCommands = commands.filter(cmd => cmd.startsWith(input));
            if (matchingCommands.length === 1) {
                setInput(matchingCommands[0]);
            }
        }
    };
    
    return (
        <div className="bg-black/80 font-mono text-sm h-[436px] overflow-y-auto p-4" onClick={() => inputRef.current?.focus()}>
            {lines.map(line => (
                <div key={line.id}>
                    {line.type === 'input' && (
                        <div>
                            <span className="text-green-400">{line.prompt}</span>
                            <span className="text-slate-200">{line.text}</span>
                        </div>
                    )}
                    {line.type === 'output' && <pre className="text-slate-300 whitespace-pre-wrap">{line.text}</pre>}
                    {line.type === 'error' && <pre className="text-red-400 whitespace-pre-wrap">{line.text}</pre>}
                </div>
            ))}
            <div className="flex">
                <span className="text-green-400">{prompt}</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent border-none text-slate-200 focus:ring-0 p-0 ml-2 outline-none"
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck="false"
                />
            </div>
            <div ref={endOfTerminalRef}></div>
        </div>
    );
};

export default Terminal;
