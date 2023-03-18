import { ExtensionContext } from "vscode";
import { mkLanguageClient, startLanguageServer, stopLanguageServer } from "./LanguageClient";
import * as languageClient from "vscode-languageclient/node";
import { startServerRestartService } from "./ServerRestart";
import { getLanguageClient } from "./GlobalState";

export function activate(context: ExtensionContext) {
  const client: languageClient.LanguageClient = mkLanguageClient();
  startLanguageServer (context, client);
  startServerRestartService();
}

export function deactivate() {
  const client: languageClient.LanguageClient = getLanguageClient();
  stopLanguageServer (client);
}
