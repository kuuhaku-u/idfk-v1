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

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "idfk-v1" is now active!');

	const commitDisposable = vscode.commands.registerCommand('idfk-v1.helloWorld', () => {
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

	const logDisposable = vscode.commands.registerCommand('idfk-v1.showGitLog', () => {
		execShell('git log --oneline')
			.then(log => {
				if (log) {
					const outputChannel = vscode.window.createOutputChannel('Git Log');
					outputChannel.appendLine('Git Log:');
					outputChannel.appendLine(log);
					outputChannel.show();
				} else {
					vscode.window.showInformationMessage('No commit history found.');
				}
			})
			.catch(err => {
				vscode.window.showErrorMessage(`Error fetching Git log: ${err.message}`);
			});
	});



	context.subscriptions.push(commitDisposable, logDisposable);
}

export function deactivate() {
	// Clean up any disposables if needed
}
