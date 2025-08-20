import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { dbService, STORE_NAMES } from '../services/dbService';
import { generatePageHtml } from '../services/geminiService';
import { DeployRequest, DeployResult } from '../types';
import { GeminiIcon } from './icons/GeminiIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { LinkIcon } from './icons/LinkIcon';

interface PageDeployerState {
    slug: string;
    title: string;
    html: string;
    aiPrompt: string;
}

const PageDeployer: React.FC = () => {
    const [state, setState] = useState<PageDeployerState>({
        slug: 'new-agent-page',
        title: 'My New Agent Page',
        html: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>My New Agent Page</title>\n  <style></style>\n</head>\n<body>\n  <h1>Hello, World!</h1>\n</body>\n</html>',
        aiPrompt: 'A modern, professional landing page for a new AI agent named "Orion".',
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [isDeploying, setIsDeploying] = useState(false);
    const [deployResult, setDeployResult] = useState<DeployResult | null>(null);

    useEffect(() => {
        const loadState = async () => {
            const storedState = await dbService.get<PageDeployerState>(STORE_NAMES.PAGE_DEPLOYER, 'state');
            if (storedState) {
                setState(storedState);
            }
        };
        loadState();
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            dbService.set(STORE_NAMES.PAGE_DEPLOYER, 'state', state);
        }, 500);
        return () => clearTimeout(handler);
    }, [state]);

    const handleStateChange = (field: keyof PageDeployerState, value: string) => {
        setState(prev => ({ ...prev, [field]: value }));
    };

    const sanitizedSlug = useMemo(() => 
        state.slug.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    , [state.slug]);

    const handleGenerate = useCallback(async () => {
        if (!state.aiPrompt) return;
        setIsGenerating(true);
        setDeployResult(null);
        try {
            const generatedHtml = await generatePageHtml(state.aiPrompt);
            setState(prev => ({ ...prev, html: generatedHtml }));
        } catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            setState(prev => ({ ...prev, html: `<!-- Generation failed: ${errorMessage} -->`}));
        } finally {
            setIsGenerating(false);
        }
    }, [state.aiPrompt]);

    const handleDeploy = useCallback(async () => {
        setIsDeploying(true);
        setDeployResult(null);
        const requestBody: DeployRequest = {
            slug: sanitizedSlug,
            title: state.title,
            html: state.html,
        };
        try {
            // Using /orch/ as a proxy prefix as per spec for SPAs
            const response = await fetch('/orch/v1/gemini/pages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });
            const resultData = await response.json();
            if (!response.ok) {
                 setDeployResult({ ...resultData, isError: true });
            } else {
                 setDeployResult({ ...resultData, isError: false });
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown network error occurred.";
            setDeployResult({ error: errorMessage, statusCode: 500, isError: true });
        } finally {
            setIsDeploying(false);
        }
    }, [sanitizedSlug, state.title, state.html]);


    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Panel: Editor */}
            <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-300/10 rounded-2xl shadow-lg p-6 space-y-6">
                <div>
                    <h2 className="text-lg font-semibold text-sky-400 mb-4">Page Configuration</h2>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">Page Title</label>
                            <input id="title" type="text" value={state.title} onChange={e => handleStateChange('title', e.target.value)} className="w-full bg-slate-900/50 border border-slate-600/80 rounded-md p-2 text-slate-200 focus:border-sky-500 focus:ring-sky-500"/>
                        </div>
                        <div>
                            <label htmlFor="slug" className="block text-sm font-medium text-slate-300 mb-1">URL Slug</label>
                            <input id="slug" type="text" value={state.slug} onChange={e => handleStateChange('slug', e.target.value)} className="w-full bg-slate-900/50 border border-slate-600/80 rounded-md p-2 text-slate-200 focus:border-sky-500 focus:ring-sky-500"/>
                            <p className="text-xs text-slate-400 mt-1">URL: <code className="text-sky-300">/gemini/{sanitizedSlug}.html</code></p>
                        </div>
                    </div>
                </div>
                
                <div className="border-t border-slate-700 pt-6">
                    <h2 className="text-lg font-semibold text-purple-400 mb-4 flex items-center"><GeminiIcon className="w-5 h-5 mr-2" /> AI Content Generation</h2>
                    <textarea id="aiPrompt" value={state.aiPrompt} onChange={e => handleStateChange('aiPrompt', e.target.value)} placeholder="e.g., A minimalist coming soon page for a stealth startup" className="w-full h-24 bg-slate-900/50 border border-slate-600/80 rounded-md p-2 text-slate-200 focus:border-purple-500 focus:ring-purple-500" />
                    <button onClick={handleGenerate} disabled={isGenerating || !state.aiPrompt} className="mt-2 w-full flex items-center justify-center px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-md text-white font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900">
                        {isGenerating ? <><SpinnerIcon className="animate-spin h-5 w-5 mr-2" /> Generating...</> : 'Generate with AI'}
                    </button>
                </div>

                <div className="border-t border-slate-700 pt-6">
                    <h2 className="text-lg font-semibold text-slate-300 mb-4">HTML Editor</h2>
                    <textarea id="html" value={state.html} onChange={e => handleStateChange('html', e.target.value)} className="w-full h-64 bg-slate-900/50 border border-slate-600/80 rounded-md p-2 font-mono text-sm focus:border-sky-500 focus:ring-sky-500" />
                </div>
                 <button onClick={handleDeploy} disabled={isDeploying || !sanitizedSlug} className="w-full flex items-center justify-center px-6 py-3 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-md text-white font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900 text-base">
                    {isDeploying ? <><SpinnerIcon className="animate-spin h-5 w-5 mr-2" /> Deploying...</> : 'Deploy Page'}
                </button>
            </div>

            {/* Right Panel: Preview & Status */}
            <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-300/10 rounded-2xl shadow-lg p-6 space-y-4 flex flex-col">
                <h2 className="text-lg font-semibold text-slate-300">Preview & Status</h2>
                <div className="bg-black/20 p-4 rounded-md min-h-[80px]">
                    <h3 className="font-semibold text-slate-400 mb-2">Deployment Status</h3>
                    {!deployResult && <p className="text-slate-500 italic">Awaiting deployment...</p>}
                    {deployResult && deployResult.isError && (
                         <div className="text-red-400">
                            <p className="font-bold">Error (Code: {('statusCode' in deployResult && deployResult.statusCode) || 'N/A'})</p>
                            <p className="font-mono text-sm">{('error' in deployResult && deployResult.error) || 'An unknown error occurred'}</p>
                        </div>
                    )}
                    {deployResult && !deployResult.isError && (
                        <div className="text-green-400">
                            <p className="font-bold">{'message' in deployResult && deployResult.message}</p>
                            <a href={('public_url' in deployResult && deployResult.public_url) || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 hover:underline">
                                <LinkIcon className="w-4 h-4" />
                                <span className="font-mono text-sm break-all">{('public_url' in deployResult && deployResult.public_url) || ''}</span>
                            </a>
                        </div>
                    )}
                </div>
                <div className="flex-grow rounded-md overflow-hidden border border-slate-700">
                    <iframe
                        srcDoc={state.html}
                        title="Live Preview"
                        className="w-full h-full bg-white"
                        sandbox="allow-scripts"
                    />
                </div>
            </div>
        </div>
    );
};

export default PageDeployer;
