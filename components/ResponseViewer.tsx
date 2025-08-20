import React, { useState } from 'react';
import { ApiResponseState } from '../types';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface ResponseViewerProps {
    response: ApiResponseState;
}

const formatBytes = (bytes: number | null, decimals = 2) => {
    if (bytes === null || bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const ResponseViewer: React.FC<ResponseViewerProps> = ({ response }) => {
    const [activeTab, setActiveTab] = useState<'body' | 'headers'>('body');

    const statusColor = response.status ? (response.status >= 200 && response.status < 300 ? 'text-green-400' : response.status >= 400 ? 'text-red-400' : 'text-yellow-400') : 'text-slate-400';
    const tabButtonClass = (tabName: 'body' | 'headers') =>
        `px-4 py-2 text-sm font-medium border-b-2 transition-colors focus:outline-none ${
            activeTab === tabName
                ? 'border-purple-400 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
        }`;

    const renderBody = () => {
        if (response.loading) {
            return (
                <div className="flex items-center justify-center h-full text-slate-400 p-4">
                    <SpinnerIcon className="animate-spin h-8 w-8" />
                </div>
            );
        }
        if (response.error) {
            return <div className="text-red-400 p-4 font-mono whitespace-pre-wrap">{response.error}</div>;
        }
        if (response.data === null) {
            return <div className="text-slate-500 p-4 italic flex items-center justify-center h-full">Send a request to see the response here.</div>;
        }
        if (typeof response.data === 'object') {
            return (
                <pre className="text-sm text-slate-200 p-4 overflow-auto">
                    <code>{JSON.stringify(response.data, null, 2)}</code>
                </pre>
            );
        }
        return (
            <pre className="text-sm text-slate-200 p-4 overflow-auto whitespace-pre-wrap">
                <code>{String(response.data)}</code>
            </pre>
        );
    };

    return (
        <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-300/10 rounded-2xl shadow-lg">
            <div className="p-4 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center space-x-2">
                     <h2 className="text-lg font-semibold text-purple-400">Response</h2>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                    {response.status && <span className={statusColor}>Status: <b className="font-semibold">{response.status} {response.statusText}</b></span>}
                    {response.time !== null && <span className="text-slate-400">Time: <b className="font-semibold text-slate-200">{response.time}ms</b></span>}
                    {response.size !== null && <span className="text-slate-400">Size: <b className="font-semibold text-slate-200">{formatBytes(response.size)}</b></span>}
                </div>
            </div>

            <div className="border-t border-slate-300/10 px-4">
                 <nav className="flex space-x-2">
                    <button className={tabButtonClass('body')} onClick={() => setActiveTab('body')}>Body</button>
                    <button className={tabButtonClass('headers')} onClick={() => setActiveTab('headers')}>Headers</button>
                </nav>
            </div>
            
            <div className="bg-black/30 rounded-b-2xl min-h-[300px] max-h-[600px] overflow-y-auto">
                {activeTab === 'body' && renderBody()}
                {activeTab === 'headers' && (
                    <div className="p-4 font-mono text-xs">
                        {response.headers ? (
                           Object.entries(response.headers).map(([key, value]) => (
                            <div key={key} className="flex py-1 border-b border-slate-800">
                                <span className="text-slate-400 w-1/3 break-all font-semibold">{key}:</span>
                                <span className="text-slate-200 flex-1 break-all">{value}</span>
                            </div>
                           ))
                        ) : <div className="text-slate-500 p-4 italic">No headers received.</div>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResponseViewer;
