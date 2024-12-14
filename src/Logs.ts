import * as vscode from 'vscode';
import { execShell } from './utils';

export class LogTreeDataProvider implements vscode.TreeDataProvider<LogItem> {
    private logs: LogItem[] = [];
    onDidChangeTreeData?: vscode.Event<LogItem | null | undefined> | undefined | any;

    addLog() {
        execShell('git log --oneline')
            .then(log => {
                if (log) {
                    const rawLogs = log.split('\n').map(line => {
                        const [commitId, ...message] = line.split(' ');
                        return new LogItem(message.join(' '), commitId);
                    })
                    this.logs = rawLogs;
                    this.onDidChangeTreeData?.fire();
                } else {
                    vscode.window.showInformationMessage('No commit history found.');
                }
            })
            .catch(err => {
                vscode.window.showErrorMessage(`Error fetching Git log: ${err.message}`);
            });
    }

    constructor() {
        this.addLog();
    }

    getTreeItem(element: LogItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    getChildren(element?: LogItem): vscode.ProviderResult<LogItem[]> {
        if (element === undefined) {
            return this.logs;
        }
        return [];
    }
}

class LogItem extends vscode.TreeItem {
    commitId: string;

    constructor(label: string, commitId: string) {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.commitId = commitId;
        this.iconPath = new vscode.ThemeIcon('git-commit');
        this.command = {
            command: 'idfk-v1.showCommitDetails',
            title: 'Show Commit Details',
            arguments: [this.commitId]
        };
    }
}
