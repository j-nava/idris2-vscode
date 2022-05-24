import * as vscode from 'vscode';
import * as languageClient from 'vscode-languageclient/node';
import { getLanguageServerSaveOnQuickFix } from './Configuration';
import { getLanguageClient } from './GlobalState';

export const middleware : languageClient.Middleware = {
  provideCodeActions: 
    async ( document: vscode.TextDocument
    , range: vscode.Range
    , context: vscode.CodeActionContext
    , token: vscode.CancellationToken
    , next: languageClient.ProvideCodeActionsSignature) => {
      if (getLanguageServerSaveOnQuickFix() && context.triggerKind === vscode.CodeActionTriggerKind.Invoke) {

        // TODO: check if this is the last line of the file. if so, add empty line to the end of the file
        // const workEdits = new vscode.WorkspaceEdit();
        // const textEdits: vscode.TextEdit[] = [];
        // textEdits.push(vscode.TextEdit.insert(vscode.Position));
        // workEdits.set(document.uri, textEdits);
        // vscode.workspace.applyEdit(workEdits); 
        // --------------------------------------------------------------

        await document.save();
        return next(document, range, context, token);
      }
      else {
        return next(document, range, context, token);
      }
    }
, provideHover:
    async ( document: vscode.TextDocument
    , position: vscode.Position
    , token: vscode.CancellationToken
    , next: languageClient.ProvideHoverSignature) => {
      const selection = vscode.window.activeTextEditor.selection;
      const posOff = document.offsetAt(position);
      const startOff = document.offsetAt(selection.start);
      const endOff = document.offsetAt(selection.end);
      const selectionText = document.getText(selection)
      if (posOff >= startOff && posOff <= endOff && selectionText.length > 0) {
        const client = getLanguageClient();
        const response = await client.sendRequest("workspace/executeCommand", { command: "repl", arguments: [selectionText]});
        return new vscode.Hover({ language: "Idris 2", value: response as string });
      }
      else {
        return next(document, position, token);
      }
    }

};
