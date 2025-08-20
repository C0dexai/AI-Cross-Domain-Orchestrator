import { DirectoryNode, FileSystemNode } from '../types';

export const initialFileSystem: DirectoryNode = {
  type: 'directory',
  name: '~',
  children: [
    {
      type: 'directory',
      name: 'projects',
      children: [
        { type: 'file', name: 'phoenix_spec_v1.2.md', content: '# Project Phoenix Specification\n\nVersion 1.2' },
        { type: 'file', name: 'lyra_agent_config.json', content: '{ "name": "Lyra", "version": "2.1" }' },
      ],
    },
    {
      type: 'directory',
      name: 'deployments',
      children: [
        { type: 'file', name: 'kara_agent_config.json', content: '{ "name": "Kara", "version": "3.5" }' },
        { type: 'file', name: 'playbook_v3.5.yml', content: '- name: Deploy Kara\n  hosts: all' },
      ],
    },
    { type: 'file', name: '.profile', content: 'export ENV=production' },
    { type: 'file', name: 'README.md', content: '## Welcome to the Secure Terminal' },
  ],
};

const findNode = (path: string[], fs: DirectoryNode): FileSystemNode | null => {
  let currentNode: FileSystemNode = fs;
  for (const part of path) {
    if (currentNode.type === 'directory') {
      const found = currentNode.children.find(c => c.name === part);
      if (found) {
        currentNode = found;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
  return currentNode;
};

const findParentNode = (path: string[], fs: DirectoryNode): DirectoryNode | null => {
    if (path.length === 0) return fs;
    const parentPath = path.slice(0, -1);
    return findNode(parentPath, fs) as DirectoryNode | null;
};


export const getAbsolutePath = (currentPath: string, targetPath: string): string => {
    if (targetPath.startsWith('/')) return targetPath;
    const parts = currentPath.split('/').filter(p => p);
    const targetParts = targetPath.split('/').filter(p => p);

    for(const part of targetParts) {
        if(part === '..') {
            if(parts.length > 0) parts.pop();
        } else if (part !== '.') {
            parts.push(part);
        }
    }
    return '/' + parts.join('/');
};


export const fileSystemManager = {
  getNodeFromPath(path: string, fs: DirectoryNode): FileSystemNode | null {
    if (path === '/' || path === '~') return fs;
    const parts = path.split('/').filter(p => p && p !== '~');
    return findNode(parts, fs);
  },

  ls(path: string, fs: DirectoryNode): string {
    const node = this.getNodeFromPath(path, fs);
    if (!node) return `ls: cannot access '${path}': No such file or directory`;
    if (node.type === 'file') return node.name;
    if (node.type === 'directory') {
      return node.children.map(child => child.name).join('\n');
    }
    return '';
  },
  
  cat(path: string, fs: DirectoryNode): string {
    const node = this.getNodeFromPath(path, fs);
    if (!node) return `cat: ${path}: No such file or directory`;
    if (node.type === 'directory') return `cat: ${path}: Is a directory`;
    return node.content;
  },

  mkdir(path: string, fs: DirectoryNode): { fs: DirectoryNode; message: string } {
    const newFs = JSON.parse(JSON.stringify(fs));
    const absolutePath = getAbsolutePath(path, '');
    const parentPath = absolutePath.substring(0, absolutePath.lastIndexOf('/')) || '/';
    const newDirName = absolutePath.substring(absolutePath.lastIndexOf('/') + 1);

    if(!newDirName) return { fs, message: `mkdir: cannot create directory '': Invalid argument` };

    const parentNode = this.getNodeFromPath(parentPath, newFs);

    if(!parentNode || parentNode.type !== 'directory') {
        return { fs, message: `mkdir: cannot create directory '${path}': No such file or directory` };
    }
    
    if(parentNode.children.some(c => c.name === newDirName)) {
        return { fs, message: `mkdir: cannot create directory '${path}': File exists` };
    }
    
    parentNode.children.push({ type: 'directory', name: newDirName, children: [] });
    return { fs: newFs, message: '' };
  },
};
