// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
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
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "idfk-v1" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('idfk-v1.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInputBox().then(async e => {
			const currentDir = await execShell(`git add . && git commit -m "${e}"`);
			vscode.window.showInformationMessage(`Commited`);
		})

	});
	const log = vscode.commands.registerCommand('idfk-v1.log', async () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		// vscode.window.showInputBox().then(async e => {
		// const currentDir = 
		await execShell(`git log`);
		// vscode.window.showInformationMessage(`Done`);
		// })

	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(log);

}

// This method is called when your extension is deactivated
export function deactivate() { }
