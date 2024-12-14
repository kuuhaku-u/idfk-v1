import * as vscode from 'vscode';
import { execShell } from './utils';

export class GitConfigTreeDataProvider implements vscode.TreeDataProvider<GitConfigItem> {
    private configItems: GitConfigItem[] = [];
    private _onDidChangeTreeData: vscode.EventEmitter<GitConfigItem | null | undefined | any> = new vscode.EventEmitter<GitConfigItem | null | undefined>();
    readonly onDidChangeTreeData: vscode.Event<GitConfigItem | null | undefined | any> = this._onDidChangeTreeData.event;

    constructor() {
        this.loadGitConfig();
    }

    public async loadGitConfig() {
        try {
            const globalConfigData = await execShell('git config --list --global');
            const globalConfig = this.parseGitConfig(globalConfigData);

            const localConfig = await this.getLocalGitConfig();

            this.configItems = [
                new GitConfigItem('Global Git Name', globalConfig.name, 'user.name', 'global'),
                new GitConfigItem('Global Git Email', globalConfig.email, 'user.email', 'global'),
                new GitConfigItem('Global Git Origin URL', globalConfig.origin, 'remote.origin.url', 'global'),

                new GitConfigItem('Local Git Name', localConfig.name, 'user.name', 'local'),
                new GitConfigItem('Local Git Email', localConfig.email, 'user.email', 'local'),
                new GitConfigItem('Local Git Origin URL', localConfig.origin, 'remote.origin.url', 'local'),
            ];

            (this._onDidChangeTreeData as any)?.fire();
        } catch (err: any) {
            vscode.window.showErrorMessage(`Error fetching Git config: ${err.message}`);
        }
    }

    private parseGitConfig(config: string) {
        const configObject = {
            name: '',
            email: '',
            origin: ''
        };

        const configLines = config.split('\n');
        configLines.forEach(line => {
            const [key, value] = line.split('=');
            if (key === 'user.name') configObject.name = value;
            if (key === 'user.email') configObject.email = value;
            if (key === 'remote.origin.url') configObject.origin = value;
        });

        return configObject;
    }

    private async getLocalGitConfig() {
        try {
            const localConfigData = await execShell('git config --list --local');
            return this.parseGitConfig(localConfigData);
        } catch (err) {
            return { name: '', email: '', origin: '' };
        }
    }

    getTreeItem(element: GitConfigItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    getChildren(element?: GitConfigItem): vscode.ProviderResult<GitConfigItem[]> {
        return this.configItems;
    }
}

class GitConfigItem extends vscode.TreeItem {
    displayValue: string;
    constructor(
        public label: string,
        public value: string,
        public configKey: string,
        public configScope: 'global' | 'local'
    ) {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.displayValue = value
        this.command = {
            command: 'idfk-v1.editConfig',
            title: 'Edit Git Config',
            arguments: [this]
        };
    }
}
