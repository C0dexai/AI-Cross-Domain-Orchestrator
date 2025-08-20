import { DirectoryNode } from '../types';
import { fileSystemManager, getAbsolutePath } from './mockFileSystem';

const helpText = `
Simulated Secure Shell - Available Commands:
  ls [path]       List directory contents.
  cd <dir>        Change the current directory.
  cat <file>      Display file contents.
  mkdir <dir>     Create a new directory.
  pwd             Print name of current/working directory.
  whoami          Print effective user id.
  ssh <user@host> (Simulated) "Connect" to another host.
  help            Display this help message.
  clear           Clear the terminal screen.
`;

export const terminalService = {
  execute(
    command: string,
    cwd: string,
        user: string,
    fs: DirectoryNode
  ): { output: string; newCwd?: string; newFs?: DirectoryNode; clear?: boolean } {
    const [cmd, ...args] = command.trim().split(/\s+/).filter(Boolean);

    switch (cmd) {
      case 'ls': {
        const targetPath = args[0] ? getAbsolutePath(cwd, args[0]) : cwd;
        const output = fileSystemManager.ls(targetPath, fs);
        return { output };
      }
      case 'cd': {
        if (!args[0]) return { output: '' };
        const targetPath = getAbsolutePath(cwd, args[0]);
        const node = fileSystemManager.getNodeFromPath(targetPath, fs);
        if (!node) {
          return { output: `cd: no such file or directory: ${args[0]}` };
        }
        if (node.type === 'file') {
          return { output: `cd: not a directory: ${args[0]}` };
        }
        return { output: '', newCwd: targetPath };
      }
      case 'pwd': {
        return { output: cwd === '/' ? '/' : `~${cwd}` };
      }
      case 'cat': {
        if (!args[0]) return { output: 'cat: missing operand' };
        const targetPath = getAbsolutePath(cwd, args[0]);
        const output = fileSystemManager.cat(targetPath, fs);
        return { output };
      }
      case 'mkdir': {
         if (!args[0]) return { output: 'mkdir: missing operand' };
         const targetPath = getAbsolutePath(cwd, args[0]);
         const { fs: newFs, message } = fileSystemManager.mkdir(targetPath, fs);
         return { output: message, newFs };
      }
      case 'whoami': {
        return { output: user };
      }
      case 'ssh': {
        if (!args[0]) return { output: 'usage: ssh user@host' };
        return { output: `Simulating SSH connection to ${args[0]}...\nPermission denied (publickey).` };
      }
      case 'help': {
        return { output: helpText.trim() };
      }
      case 'clear': {
        return { output: '', clear: true };
      }
      case '': {
        return { output: '' };
      }
      default: {
        return { output: `command not found: ${cmd}` };
      }
    }
  },
};
