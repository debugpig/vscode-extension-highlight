
import * as vscode from 'vscode';
import {Highlight} from './highlight';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "highlight" is now active!');

	let highlight: Highlight = new Highlight();

	let disposable = vscode.commands.registerCommand('highlight.selectedWords', () => {
		highlight.SelectedWords();
	});
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('highlight.clearWords', () => {
		highlight.ClearWords();
	});
	context.subscriptions.push(disposable);

	vscode.workspace.onDidChangeTextDocument(() => {
		highlight.RefeshSelectedWords();
	});

	vscode.window.onDidChangeActiveTextEditor(() => {
		highlight.DecorateSelectedWords();
	});
}

// this method is called when your extension is deactivated
export function deactivate() {}
