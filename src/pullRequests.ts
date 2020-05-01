import * as vscode from 'vscode';
import * as path from 'path';
import { getStashApiRoot, getComments, getPullRequest } from "./stashApi";
import { getBranch} from "./git";
import { AxiosRequestConfig } from "axios";
import * as util from 'util';
const exec = util.promisify(require('child_process').exec);

let commentId = 1;

class NoteComment implements vscode.Comment {
    id: number;
    label: string | undefined;
    constructor(
        public body: string | vscode.MarkdownString,
        public mode: vscode.CommentMode,
        public author: vscode.CommentAuthorInformation,
        public parent?: vscode.CommentThread,
        public contextValue?: string
    ) {
        this.id = ++commentId;
    }
}

let commentController: vscode.CommentController;

export function setupComments(subscriptions: { dispose(): any }[]) {
    // A `CommentController` is able to provide comments for documents.
    commentController = vscode.comments.createCommentController('comment-sample', 'Comment API Sample');
    subscriptions.push(commentController);
    // A `CommentingRangeProvider` controls where gutter decorations that allow adding comments are shown
    commentController.commentingRangeProvider = {
        provideCommentingRanges: (document: vscode.TextDocument, token: vscode.CancellationToken) => {
            let lineCount = document.lineCount;
            return [new vscode.Range(0, 0, lineCount - 1, 0)];
        }
    };
}

export async function getPullRequestComments() {
    console.log(commentController);
    console.log(vscode.workspace.workspaceFolders);
    let fsroot = null;
    if (vscode.workspace.workspaceFolders) {
        fsroot = vscode.workspace.workspaceFolders[0].uri.fsPath
    }
    if (!fsroot) {
        vscode.window.showErrorMessage(`Unable to find fsroot`);
        return;
    }
    
    let branch = await getBranch(fsroot);
    const apiRoot = await getStashApiRoot(fsroot)
    const config = vscode.workspace.getConfiguration('stash')
    let apiKey = config['apiKey'];
    if (!apiKey) {
        vscode.window.showErrorMessage(`need to set config stash.apiKey`);
        return;
    }
    const stashOptions: AxiosRequestConfig = {
        responseType: "json",
        headers: { Authorization: `Bearer ${apiKey}` }
    };
    let pullRequests = await getPullRequest(apiRoot, stashOptions)
    let [pullRequest] = pullRequests.data.values.filter((c: any) => c.fromRef.id == `refs/heads/${branch}`);
    if (!pullRequest) {
        vscode.window.showErrorMessage(`Unable to find pull request for branch ${branch}`);
        return;
    }
    let commentsActivities = await getComments(pullRequest, apiRoot, stashOptions);
    console.log("commentsActivities");
    console.log(commentsActivities);

    for (const commentActivity of commentsActivities) {

        let range = new vscode.Range(commentActivity.commentAnchor.line + 1, 0, commentActivity.commentAnchor.line, 0)
        let uri = vscode.Uri.file(path.join(fsroot, commentActivity.commentAnchor.path));
        let comment = new NoteComment(commentActivity.comment.text, vscode.CommentMode.Preview, { name: commentActivity.user.name }, undefined, 'canDelete');
        commentController.createCommentThread(uri, range, [comment]);
        // commentActivity.commentAnchor.orphaned
    }
}