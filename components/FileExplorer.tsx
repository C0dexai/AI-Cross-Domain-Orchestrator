import React, { useState } from 'react';
import { DirectoryNode, FileSystemNode } from '../types';
import { FolderIcon } from './icons/FolderIcon';
import { FileIcon } from './icons/FileIcon';

interface FileExplorerProps {
    fileSystem: DirectoryNode;
}

const TreeNode: React.FC<{ node: FileSystemNode, level: number }> = ({ node, level }) => {
    const [isOpen, setIsOpen] = useState(node.name === 'projects' || node.name === 'deployments');

    if (node.type === 'file') {
        return (
            <div className="flex items-center space-x-2 py-1" style={{ paddingLeft: `${level * 1.5}rem` }}>
                <FileIcon className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <span className="text-slate-300 truncate">{node.name}</span>
            </div>
        );
    }

    return (
        <div>
            <div
                className="flex items-center space-x-2 py-1 cursor-pointer hover:bg-slate-300/10 rounded"
                style={{ paddingLeft: `${level * 1.5}rem` }}
                onClick={() => setIsOpen(!isOpen)}
            >
                <FolderIcon className={`w-4 h-4 text-sky-400 flex-shrink-0 transition-transform ${isOpen ? 'transform' : ''}`} />
                <span className="text-slate-200 font-medium truncate">{node.name}</span>
            </div>
            {isOpen && (
                <div>
                    {node.children.map((child, index) => (
                        <TreeNode key={index} node={child} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};

const FileExplorer: React.FC<FileExplorerProps> = ({ fileSystem }) => {
    return (
        <div className="p-3 h-full">
            <h3 className="text-base font-semibold text-slate-300 mb-2 px-2">File Explorer</h3>
            <div className="text-sm space-y-1 overflow-y-auto h-[400px]">
                <TreeNode node={fileSystem} level={0} />
            </div>
        </div>
    );
};

export default FileExplorer;
