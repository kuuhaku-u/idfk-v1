import * as vscode from 'vscode';
import { LogTreeDataProvider } from './Logs';
import { commitDisposable, logDisposable, commitInfoDisposable, showCommitDetailsCommand, editConfigCommand, showUnPushed } from './Commands';
import { GitConfigTreeDataProvider } from './Conifg'

export function activate(context: vscode.ExtensionContext) {
	vscode.window.registerTreeDataProvider('JSON', new TreeDataProvider());
	vscode.window.registerTreeDataProvider('logView', new LogTreeDataProvider());
	vscode.window.registerTreeDataProvider('gitConfigView', new GitConfigTreeDataProvider());

	context.subscriptions.push(commitDisposable, logDisposable, commitInfoDisposable, showCommitDetailsCommand, editConfigCommand, showUnPushed);

}

class TreeDataProvider implements vscode.TreeDataProvider<TreeItem> {
	onDidChangeTreeData?: vscode.Event<TreeItem | null | undefined> | undefined;

	data: TreeItem[];
	constructor() {
		this.data = [
			new TreeItem('cars', [
				new TreeItem('Ford', [
					new TreeItem('Fiesta'),
					new TreeItem('Focus'),
					new TreeItem('Mustang')
				]),
				new TreeItem('BMW', [
					new TreeItem('320'),
					new TreeItem('X3'),
					new TreeItem('X5')
				])
			])
		];
	}

	getTreeItem(element: TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
		return element;
	}

	getChildren(element?: TreeItem): vscode.ProviderResult<TreeItem[]> {
		if (element === undefined) {
			return this.data;
		}
		return element.children;
	}
}

class TreeItem extends vscode.TreeItem {
	children: TreeItem[] | undefined;

	constructor(label: string, children?: TreeItem[]) {
		super(
			label,
			children === undefined ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Expanded
		);

		this.children = children;
	}
}






