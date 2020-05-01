
import * as vscode from 'vscode';
import * as path from 'path';
import { getRootRelativeFilePath } from "./git";
import { getRepoPath } from "./stashApi"

export async function openInStash(_uri: vscode.Uri) {
	const lines = getSelectedLines(vscode.window.activeTextEditor);
	if (vscode.window.activeTextEditor) {
		let filename = vscode.window.activeTextEditor.document.fileName;
		let repoPath = await getRepoPath(path.dirname(filename));
		let remoteFilePath = await getRootRelativeFilePath(filename)
		let fullPath = `${repoPath}/browse/${remoteFilePath}`;
		if (lines) {
			let lineThings = lines.map(line => line.start === line.end ? `${line.start}` : `${line.start}-${line.end}`);
			fullPath += "#" + lineThings.join(",");
		}
		console.log(fullPath);
		vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(fullPath))
	}
}

type Lines = { start: number, end: number };
function getSelectedLines(editor: vscode.TextEditor | undefined): Lines[] {
	let lines: Lines[] = [];
	if (editor) {
		lines = editor.selections.reduce((prev, current) =>
			[...prev, { start: current.start.line + 1, end: current.end.line + 1 }]
			, lines)
	}
	return lines;
}