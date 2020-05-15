// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { openInStash } from "./openInStash";
import { copyStashLink } from "./copyStashLink";
import { getPullRequestComments, setupComments } from "./pullRequests";
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

export async function activate({ subscriptions }: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "stash" is now active!2');
	subscriptions.push(vscode.commands.registerCommand('extension.openInStash', openInStash));
	subscriptions.push(vscode.commands.registerCommand('extension.copyStashLink', copyStashLink));
	subscriptions.push(vscode.commands.registerCommand('extension.getPullRequestComments', getPullRequestComments));
	
	setupComments(subscriptions);
}
// this method is called when your extension is deactivated
export function deactivate() { }