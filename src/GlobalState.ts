import * as vscode from "vscode";
import * as languageClient from "vscode-languageclient/node";

type GlobalState = {
  lastServerRestart: number,
  languageClient: languageClient.LanguageClient,
  replChannel: vscode.OutputChannel
};

export let globalState:GlobalState;

export function initGlobalState(languageClient:languageClient.LanguageClient) {
  globalState = {
    lastServerRestart: Date.now(),
    languageClient: languageClient,
    replChannel: vscode.window.createOutputChannel("Idris 2 REPL", "idris2")
  };
};

export const getLanguageClient = () => {
  return globalState.languageClient;
};

export const setLanguageClient = (lc:languageClient.LanguageClient) => {
  globalState.languageClient = lc;
};

export const setLastServerRestart = () => {
  globalState.lastServerRestart = Date.now();
};

export const getReplChannel = () => {
  return globalState.replChannel;
};
