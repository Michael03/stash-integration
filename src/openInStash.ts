import * as vscode from 'vscode';
import {getSelectedLines, getStashLinkUrl } from "./lib/stash"
import { handleError } from "./lib/errorHandler";

export async function openInStash(_uri: vscode.Uri) {
	try {

		const lines = getSelectedLines(vscode.window.activeTextEditor);
		const fullPath = await getStashLinkUrl(lines);
		vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(fullPath))
	} catch (error) {
		handleError(error);
	}
}