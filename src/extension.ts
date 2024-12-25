import { readSync } from 'fs';
import { pipeline } from 'stream';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "basic-code-information" is now active!');

	const disposable2 = vscode.commands.registerCommand('basic-code-information.get-basic', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			  vscode.window.showInformationMessage('No active editor found.');
			  return;
		}
		const documentText = editor.document.getText()||0;
		let result = 'Basic code information\n\n';
		if (documentText) {
			let b = documentText.split('\n');
			for (let i = 0; i < b.length; ++i) {
				let currentString = b[i];
				if (/^struct/.test(currentString) || /^class/.test(currentString)) {
					currentString = currentString.slice(0, currentString.indexOf('{'));
					result += currentString + '\[[lint to line](vscode://file' + editor.document.uri.path +`:${i + 1}` + ')\]\n\n';
				} else if (/^[a-zA-Z].* .*\(.*\).*\{/.test(currentString)) {
					currentString = currentString.slice(0, currentString.indexOf(')') + 1);
					result += currentString + '\[[lint to line](vscode://file' + editor.document.uri.path +`:${i + 1}` + ')\]\n\n';
				}
			}
		}
		try {
			const newDocumentWithBasicCode = await vscode.workspace.openTextDocument({
				content: result,
				language: "markdown",
			});
			await vscode.window.showTextDocument(newDocumentWithBasicCode, {
				preview: true
			});
		} catch {
			vscode.window.showErrorMessage('Ошибка при создании временного файла:');
		}
	});
	context.subscriptions.push(disposable2);
}

export function deactivate() {}
