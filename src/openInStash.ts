
import * as vscode from 'vscode';
import * as util from 'util';
const exec = util.promisify(require('child_process').exec);
import * as path from 'path';

export async function openInStash(_uri:vscode.Uri) {
	const lines = getSelectedLines(vscode.window.activeTextEditor);
	let remote = "unknown";
	if (vscode.window.activeTextEditor) {
		let filename = vscode.window.activeTextEditor.document.fileName;
		let browsePath = await getBrowsePath(filename);
		let remoteFilePath = await getRemoteFilepath(filename)
		let fullPath = `${browsePath}${remoteFilePath}`;
		if (lines) {
			let lineThings = lines.map(line => line.start === line.end ? `${line.start}` : `${line.start}-${line.end}`);
			fullPath += "#" + lineThings.join(",");
		}
		console.log(fullPath);
		remote = fullPath;
		vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(fullPath))
	}
}

async function getBrowsePath(filename: string) {
	let result = await exec(`cd ${path.dirname(filename)} && git config --get remote.origin.url`);
	let regex = /ssh:\/\/git@([a-zA-Z.]+):\d+\/([a-zA-Z]+)\/([a-zA-Z]+).git/;
	const [_, url, project, repo] = result.stdout.match(regex);
	let browsePath = `https://${url}/projects/${project}/repos/${repo}/browse/`;
	return browsePath;
}

async function getRemoteFilepath(filename: string) {
	let result = await exec(`cd ${path.dirname(filename)} && git ls-files --full-name ${filename}`);
	return result.stdout.replace('\n', '');
}

type Lines = { start: number, end: number };
function getSelectedLines(editor: vscode.TextEditor | undefined): Lines[] {
	let lines: Lines[] = [];
	if (editor) {
		lines = editor.selections.reduce((prev, current) =>
			[...prev, { start: current.start.line+1, end: current.end.line+1 }] // +1 as index starts at 0
			, lines)
	}
	return lines;
}