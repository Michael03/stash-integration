// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { openInStash } from "./openInStash";
import axios, { AxiosRequestConfig } from "axios";
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

export async function activate({ subscriptions }: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "stash" is now active!2');
	subscriptions.push(vscode.commands.registerCommand('extension.openInStash', openInStash));
	subscriptions.push(vscode.commands.registerCommand('extension.getPullRequestComments', getPullRequestComments));


		// A `CommentController` is able to provide comments for documents.
		const commentController = vscode.comments.createCommentController('comment-sample', 'Comment API Sample');
		context.subscriptions.push(commentController);

}

async function getPullRequestComments() {
	// let get = 'curl -H "Authorization: Bearer NTY5NDkzMzUxNzg0OlO/bof8D5cpldUGKDZx0EdAyTAo"  https://stash.skybet.net/rest/api/1.0/projects/BPL/repos/placement-api/pull-requests'
	const stashOptions: AxiosRequestConfig = {
		responseType: "json",
		headers: { Authorization: "Bearer NTY5NDkzMzUxNzg0OlO/bof8D5cpldUGKDZx0EdAyTAo" }
	};
	let gitPath = "projects/BPL/repos/placement-api";
	let branch = "BT-923";
	let pullRequests = await axios.get(`https://stash.skybet.net/rest/api/1.0/${gitPath}/pull-requests`, stashOptions)

	let [pullRequest] = pullRequests.data.values.filter((c: any) => c.fromRef.id == `refs/heads/${branch}`);
	if (!pullRequest) {
		vscode.window.showErrorMessage(`Unable to find pull request for branch ${branch}`);
	}
	console.log("Pull Request:");
	console.log(pullRequest);
	let activities = await axios.get(`https://stash.skybet.net/rest/api/1.0/${gitPath}/pull-requests/${pullRequest.id}/activities`, stashOptions)

	console.log("activities");
	console.log(activities);

	let commentsActivities = activities.data.values.filter((activity:any) => activity.action == "COMMENTED");
	console.log("commentsActivities");
	console.log(commentsActivities);
	// commentsActivities.comment.text
	// commentsActivities.commentAnchor.line
	// commentsActivities.commentAnchor.path
	// commentsActivities.commentAnchor.orphaned

}

// this method is called when your extension is deactivated
export function deactivate() { }