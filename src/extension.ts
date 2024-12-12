import * as vscode from 'vscode';
import * as cp from "child_process";

const execShell = (cmd: string) =>
	new Promise<string>((resolve, reject) => {
		cp.exec(cmd, (err, out) => {
			if (err) {
				return reject(err);
			}
			return resolve(out);
		});
	});

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "idfk-v1" is now active!');

	const disposable = vscode.commands.registerCommand('idfk-v1.helloWorld', () => {
		execShell('git status --porcelain')
			.then(status => {
				if (!status) {
					vscode.window.showInformationMessage('No changes to commit.');
				} else {
					vscode.window.showInputBox().then(async message => {
						if (message) {
							try {
								await execShell(`git add . && git commit -m "${message}"`);
								vscode.window.showInformationMessage('Committed', ...['Push', 'Cancel'])
									.then(selection => {
										if (selection === "Push") {
											console.log("Push selected");
										} else {
											console.log("Canceled");
										}
									});
							} catch (err: any) {
								vscode.window.showErrorMessage(`Error committing: ${err.message}`);
							}
						} else {
							vscode.window.showInformationMessage('Commit aborted');
						}
					});
				}
			})
			.catch(err => {
				vscode.window.showErrorMessage(`Error checking git status: ${err.message}`);
			});
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
