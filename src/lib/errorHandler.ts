import * as vscode from 'vscode';

export const handleError = (error: any) => {
    let message = ""
    if (error.message) {
        message = error.message;
    } 
    if (message === "") {
        message = "Unexpected Error";
    }
    vscode.window.showErrorMessage(message);
}