import * as vscode from 'vscode';

export function getServerRestartToggle() : boolean {
  const config = vscode.workspace.getConfiguration("idris2.serverRestartService");
  const toggle: boolean = config.get("toggle");
  return toggle;
};

export function getServerRestartInterval() : number {
  const config = vscode.workspace.getConfiguration("idris2.serverRestartService");
  const interval: number = config.get("interval");
  return interval;
};

export function getLanguageServerPath() : string {
  const config = vscode.workspace.getConfiguration("idris2.languageServer");
  const path: string = config.get("path");
  return path;
};

export function getLanguageServerSaveOnQuickFix() : boolean {
  const config = vscode.workspace.getConfiguration("idris2.languageServer");
  const save: boolean = config.get("saveOnQuickFix");
  return save;
};