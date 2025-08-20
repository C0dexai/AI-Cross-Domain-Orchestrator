
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ApiRequest, ApiResponseState } from '../types';
import RequestEditor from './RequestEditor';
import ResponseViewer from './ResponseViewer';
import { dbService, STORE_NAMES } from '../services/dbService';

const initialRequest: ApiRequest = {
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/todos/1',
    headers: [{ id: 'h1', key: 'Content-Type', value: 'application/json', enabled: true }],
    body: '',
    auth: { type: 'none', token: '' }
};

const APIManager: React.FC = () => {
    const initialResponseState: ApiResponseState = {
        status: null, statusText: null, data: null, headers: null, loading: false, error: null, time: null, size: null,
    };

    const [request, setRequest] = useState<ApiRequest>(initialRequest);
    const [response, setResponse] = useState<ApiResponseState>(initialResponseState);
    const isInitialLoad = useRef(true);

    useEffect(() => {
        const loadRequest = async () => {
            try {
                const storedRequest = await dbService.get<ApiRequest>(STORE_NAMES.API_INSPECTOR, 'currentRequest');
                if (storedRequest) {
                    setRequest(storedRequest);
                }
            } catch (error) {
                console.error("Failed to load API request from IndexedDB", error);
            } finally {
                isInitialLoad.current = false;
            }
        };
        loadRequest();
    }, []);

    useEffect(() => {
        if (isInitialLoad.current) return;
        
        const saveRequest = async () => {
            try {
                await dbService.set(STORE_NAMES.API_INSPECTOR, 'currentRequest', request);
            } catch (error) {
                console.error("Failed to save API request to IndexedDB", error);
            }
        };

        const handler = setTimeout(() => {
            saveRequest();
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [request]);

    const handleSendRequest = useCallback(async () => {
        setResponse({ ...initialResponseState, loading: true });
        const startTime = Date.now();

        const headers = new Headers();
        request.headers.forEach(header => {
            if (header.enabled && header.key) {
                headers.append(header.key, header.value);
            }
        });

        if (request.auth.type === 'bearer' && request.auth.token) {
            headers.append('Authorization', `Bearer ${request.auth.token}`);
        }

        try {
            const res = await fetch(request.url, {
                method: request.method,
                headers: headers,
                body: (request.method !== 'GET' && request.method !== 'DELETE' && request.body) ? request.body : undefined,
            });

            const endTime = Date.now();
            const responseTime = endTime - startTime;
            
            const responseHeaders: Record<string, string> = {};
            res.headers.forEach((value, key) => {
                responseHeaders[key] = value;
            });
            
            const rawBody = await res.text();
            const responseSize = new Blob([rawBody]).size;
            let responseData: any;

            try {
                responseData = JSON.parse(rawBody);
            } catch (e) {
                responseData = rawBody;
            }

            setResponse({
                status: res.status,
                statusText: res.statusText,
                data: responseData,
                headers: responseHeaders,
                loading: false,
                error: null,
                time: responseTime,
                size: responseSize
            });

        } catch (err: any) {
            const endTime = Date.now();
            setResponse({
                ...initialResponseState,
                loading: false,
                error: err.message || 'An unknown error occurred. Check the URL or network connection.',
                time: endTime - startTime,
            });
        }
    }, [request]);
    
    return (
        <div className="space-y-8">
            <RequestEditor request={request} setRequest={setRequest} onSend={handleSendRequest} isLoading={response.loading} />
            <ResponseViewer response={response} />
        </div>
    );
};

export default APIManager;
