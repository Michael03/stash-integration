
import * as vscode from 'vscode';
import { getSelectedLines, getStashLinkUrl } from "./lib/stash"
import { handleError } from "./lib/errorHandler";
export async function copyStashLink(_uri: vscode.Uri) {
	try {

		const lines = getSelectedLines(vscode.window.activeTextEditor);
		const fullPath = await getStashLinkUrl(lines);
		vscode.env.clipboard.writeText(fullPath);
	} catch (error) {
		handleError(error);
	}
}