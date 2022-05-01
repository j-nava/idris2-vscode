import * as vscode from 'vscode';
import * as languageClient from 'vscode-languageclient/node';
import { getLanguageServerPath } from './Configuration';
import { initGlobalState } from './GlobalState';
import { middleware } from './Middleware';
import * as commands from './Commands';

export function mkLanguageClient() {
  const path = getLanguageServerPath();
  const serverOptions: languageClient.ServerOptions = {
    command: path,
    options: { }
  };
  const ds = [
    { scheme: 'file', language: 'idris' },
    { scheme: 'file', language: 'idris2' },
    { scheme: 'file', language: 'lidr' }
  ];
  const clientOptions: languageClient.LanguageClientOptions = {
    documentSelector: ds,
    middleware: middleware
  };
  return new languageClient.LanguageClient(
    'idris2',
    'Idris 2 Language Server',
    serverOptions,
    clientOptions
  );

}

export function startLanguageServer(context: vscode.ExtensionContext, client: languageClient.LanguageClient) {

  initGlobalState(client);

  client.start();

  context.subscriptions.push({
    dispose: () => {
      client.stop();
    }
  });

  context.subscriptions.push(vscode.commands.registerCommand("idris2.restartLanguageServer", commands.restartServer));
  context.subscriptions.push(vscode.commands.registerCommand("idris2.lsp.repl", commands.repl));
  context.subscriptions.push(vscode.commands.registerCommand("idris2.lsp.debug", commands.lsp));

}

export function stopLanguageServer(client: languageClient.LanguageClient) {
  client.stop();
}
