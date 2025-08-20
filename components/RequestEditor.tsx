import React, { useState } from 'react';
import { ApiRequest, HttpMethod, KeyValuePair } from '../types';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface RequestEditorProps {
  request: ApiRequest;
  setRequest: React.Dispatch<React.SetStateAction<ApiRequest>>;
  onSend: () => void;
  isLoading: boolean;
}

const RequestEditor: React.FC<RequestEditorProps> = ({ request, setRequest, onSend, isLoading }) => {
    const [activeTab, setActiveTab] = useState<'auth' | 'headers' | 'body'>('headers');

    const handleHeaderChange = (index: number, field: keyof KeyValuePair, value: string | boolean) => {
        const newHeaders = [...request.headers];
        const headerToUpdate = { ...newHeaders[index], [field]: value };
        newHeaders[index] = headerToUpdate;
        setRequest(prev => ({ ...prev, headers: newHeaders }));
    };

    const addHeader = () => {
        setRequest(prev => ({ ...prev, headers: [...prev.headers, { id: `h${Date.now()}`, key: '', value: '', enabled: true }]}));
    };
    
    const removeHeader = (id: string) => {
        setRequest(prev => ({ ...prev, headers: prev.headers.filter(h => h.id !== id) }));
    };

    const httpMethods: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    
    const tabButtonClass = (tabName: 'auth' | 'headers' | 'body') =>
        `px-4 py-2 text-sm font-medium border-b-2 transition-colors focus:outline-none ${
            activeTab === tabName
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-400'
        }`;

    return (
        <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-300/10 rounded-2xl shadow-lg">
            <div className="p-4">
                <h2 className="text-lg font-semibold text-sky-400 mb-4">API Request Inspector</h2>
                <div className="flex items-center space-x-2 bg-slate-900/50 border border-slate-300/10 rounded-lg p-1 has-[:focus-within]:ring-2 has-[:focus-within]:ring-sky-500">
                    <select
                        value={request.method}
                        onChange={(e) => setRequest(prev => ({...prev, method: e.target.value as HttpMethod}))}
                        className="bg-slate-700/80 text-white font-semibold rounded-md px-3 py-2 border-transparent focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    >
                        {httpMethods.map(m => <option key={m}>{m}</option>)}
                    </select>
                    <input
                        type="url"
                        value={request.url}
                        onChange={(e) => setRequest(prev => ({...prev, url: e.target.value}))}
                        placeholder="https://api.example.com/v1/users"
                        className="flex-grow bg-transparent p-2 text-slate-200 placeholder-slate-500 focus:outline-none"
                    />
                    <button
                        onClick={onSend}
                        disabled={isLoading || !request.url}
                        className="flex items-center justify-center px-6 py-2 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-md text-white font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                    >
                        {isLoading ? <SpinnerIcon className="animate-spin h-5 w-5" /> : 'Send'}
                    </button>
                </div>
            </div>
            
            <div className="border-t border-slate-300/10 px-4">
                <nav className="flex space-x-2">
                    <button className={tabButtonClass('headers')} onClick={() => setActiveTab('headers')}>Headers</button>
                    <button className={tabButtonClass('auth')} onClick={() => setActiveTab('auth')}>Authorization</button>
                    <button className={tabButtonClass('body')} onClick={() => setActiveTab('body')}>Body</button>
                </nav>
            </div>

            <div className="bg-black/20 p-4 rounded-b-2xl min-h-[200px]">
                {/* Auth Tab */}
                {activeTab === 'auth' && (
                    <div className="space-y-4 max-w-md">
                        <select
                            value={request.auth.type}
                            onChange={e => setRequest(prev => ({ ...prev, auth: { ...prev.auth, type: e.target.value as 'none' | 'bearer' } }))}
                            className="bg-slate-900/50 border border-slate-600/80 rounded-md px-3 py-2 w-full focus:ring-sky-500 focus:border-sky-500"
                        >
                            <option value="none">No Auth</option>
                            <option value="bearer">Bearer Token</option>
                        </select>
                        {request.auth.type === 'bearer' && (
                             <textarea
                                placeholder="Token"
                                value={request.auth.token}
                                onChange={e => setRequest(prev => ({ ...prev, auth: { ...prev.auth, token: e.target.value } }))}
                                className="w-full h-24 bg-slate-900/50 border border-slate-600/80 rounded-md p-2 font-mono text-sm focus:ring-sky-500 focus:border-sky-500"
                            />
                        )}
                    </div>
                )}
                
                {/* Headers Tab */}
                {activeTab === 'headers' && (
                    <div className="space-y-2">
                        {request.headers.map((header, index) => (
                            <div key={header.id} className="flex items-center space-x-2 group">
                                <input type="checkbox" checked={header.enabled} onChange={e => handleHeaderChange(index, 'enabled', e.target.checked)} className="form-checkbox h-5 w-5 bg-slate-800 border-slate-600 text-sky-500 focus:ring-sky-500 rounded" />
                                <input type="text" placeholder="Key" value={header.key} onChange={e => handleHeaderChange(index, 'key', e.target.value)} className="flex-1 bg-slate-900/50 border border-slate-600/80 rounded-md p-2 focus:border-sky-500 focus:ring-sky-500 outline-none" disabled={!header.enabled} />
                                <input type="text" placeholder="Value" value={header.value} onChange={e => handleHeaderChange(index, 'value', e.target.value)} className="flex-1 bg-slate-900/50 border border-slate-600/80 rounded-md p-2 focus:border-sky-500 focus:ring-sky-500 outline-none" disabled={!header.enabled} />
                                <button onClick={() => removeHeader(header.id)} className="text-slate-500 hover:text-red-500 p-1 opacity-50 group-hover:opacity-100 transition-opacity">✕</button>
                            </div>
                        ))}
                        <button onClick={addHeader} className="text-sky-400 hover:text-sky-300 text-sm font-semibold mt-2">+ Add Header</button>
                    </div>
                )}

                {/* Body Tab */}
                {activeTab === 'body' && (
                    <div>
                        <textarea
                            placeholder='{ "key": "value" }'
                            value={request.body}
                            onChange={e => setRequest(prev => ({ ...prev, body: e.target.value }))}
                            className="w-full h-48 bg-slate-900/50 border border-slate-600/80 rounded-md p-2 font-mono text-sm focus:ring-sky-500 focus:border-sky-500"
                            disabled={request.method === 'GET' || request.method === 'DELETE'}
                        />
                        {(request.method === 'GET' || request.method === 'DELETE') && <p className="text-xs text-slate-400 mt-2">Request body is not applicable for GET or DELETE methods.</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RequestEditor;
