export enum AgentStatus {
  Idle = 'Idle',
  Syncing = 'Syncing',
  Updating = 'Updating',
  AwaitingApproval = 'Awaiting Approval',
  Error = 'Error',
}

export enum LedgerStatus {
  Completed = 'Completed',
  InProgress = 'In Progress',
  Failed = 'Failed',
}

export interface LedgerEntry {
  id: string;
  task: string;
  rationale: string;
  timestamp: string;
  status: LedgerStatus;
}

export interface KnowledgeAsset {
  id:string;
  name: string;
  version: string;
  lastUpdated: string;
}

export interface Agent {
  name: string;
  status: AgentStatus;
  contextLedger: LedgerEntry[];
}

export interface Domain {
  id: 'A' | 'B';
  name: string;
  agent: Agent;
  knowledgeBase: KnowledgeAsset[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'API_CALL' | 'AGENT_ACTION' | 'SYSTEM_STATUS' | 'META_AGENT';
}

// Types for API Inspector
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface KeyValuePair {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface ApiRequest {
  method: HttpMethod;
  url: string;
  headers: KeyValuePair[];
  body: string;
  auth: {
    type: 'none' | 'bearer';
    token: string;
  };
}

export interface ApiResponseState {
  status: number | null;
  statusText: string | null;
  data: any | null;
  headers: Record<string, string> | null;
  loading: boolean;
  error: string | null;
  time: number | null;
  size: number | null;
}

// Types for Secure Terminal
export type Protocol = 'SSH' | 'SFTP' | 'FTP';

export interface ConnectionDetails {
    host: string;
    user: string;
    protocol: Protocol;
}

export interface FileNode {
    type: 'file';
    name: string;
    content: string;
}

export interface DirectoryNode {
    type: 'directory';
    name: string;
    children: FileSystemNode[];
}

export type FileSystemNode = FileNode | DirectoryNode;

export interface TerminalLine {
    id: number;
    type: 'input' | 'output' | 'error';
    text: string;
    prompt?: string;
}

export interface EnvironmentVariable {
  id: string;
  key: string;
  value: string;
}

// Types for Page Deployer
export interface DeployRequest {
  slug: string;
  title: string;
  html: string;
  env?: { [key: string]: string };
}

export interface DeploySuccessResponse {
  status: 'success';
  message: string;
  endpoint: string;
  path: string;
  public_url: string;
  content_hash: string;
}

export interface DeployErrorResponse {
  error: string;
  statusCode: number;
}

export type DeployResult = (DeploySuccessResponse | DeployErrorResponse) & { isError: boolean };