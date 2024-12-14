import { execShell } from "./utils";
import * as vscode from 'vscode';
import * as path from 'path';

export const commitDisposable = vscode.commands.registerCommand('idfk-v1.helloWorld', () => {
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


export const logDisposable = vscode.commands.registerCommand('idfk-v1.showGitLog', () => {
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

export const commitInfoDisposable = vscode.commands.registerCommand('idfk-v1.showCommitIdInfo', () => {
    execShell('git --no-pager show 75a97a4e2a8785109acc62b487cc2642e5e26df1 --pretty=format:"STUFF - %s %an %ad"')
        .then(log => {
            if (log) {
                const outputChannel = vscode.window.createOutputChannel('Commit ID Details');
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

export const showCommitDetailsCommand = vscode.commands.registerCommand('idfk-v1.showCommitDetails', (commitId: string) => {
    vscode.window.showInformationMessage(`Selected Commit ID: ${commitId}`);

    execShell(`git show ${commitId}`)
        .then((logDetails) => {
            vscode.window.showInformationMessage(`Commit Details: ${logDetails}`);
        })
        .catch((err) => {
            vscode.window.showErrorMessage(`Error fetching commit details: ${err.message}`);
        });
});



