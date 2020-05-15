import * as path from 'path';
import { getRootRelativeFilePath } from "./../git";
import { getRepoPath } from "./../stashApi"
import * as vscode from 'vscode';

type Lines = { start: number, end: number };
export async function getStashLinkUrl(lines: Lines[]): Promise<string> {
	if (vscode.window.activeTextEditor) {
		let filename = vscode.window.activeTextEditor.document.fileName;
		let repoPath = await getRepoPath(path.dirname(filename));
		let remoteFilePath = await getRootRelativeFilePath(filename);
		let fullPath = `${repoPath}/browse/${remoteFilePath}`;
		if (lines) {
			let lineThings = lines.map(line => line.start === line.end ? `${line.start}` : `${line.start}-${line.end}`);
			fullPath += "#" + lineThings.join(",");
		}
		console.log(fullPath);
		return fullPath
	}
	throw Error("Unable to get activeEditor");
}

export function getSelectedLines(editor: vscode.TextEditor | undefined): Lines[] {
	let lines: Lines[] = [];
	if (editor) {
		lines = editor.selections.reduce((prev, current) =>
			[...prev, { start: current.start.line + 1, end: current.end.line + 1 }]
			, lines)
	}
	return lines;
}