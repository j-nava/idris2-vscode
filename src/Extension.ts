import * as vscode from 'vscode';
import { getLanguageClient } from './GlobalState';
import { mkLanguageClient, startLanguageServer, stopLanguageServer } from './LanguageClient';
import { startServerRestartService } from './ServerRestart';

export function activate(context: vscode.ExtensionContext): void {

  const languageClient = mkLanguageClient();
  startLanguageServer(context, languageClient);
  startServerRestartService();

}

export function deactivate(): void {

  const languageClient = getLanguageClient();
  stopLanguageServer(languageClient);

}
