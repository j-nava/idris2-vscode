import { window } from "vscode";
import { getServerRestartInterval, getServerRestartToggle } from "./Configuration";
import { globalState, setLastServerRestart } from "./GlobalState";

export const restartServer = async () => {
  window.setStatusBarMessage("Restarting language server...", 2000);
  await globalState.languageClient.stop()
  globalState.languageClient.start();
};

export const startServerRestartService = () => {
  setInterval(() => {
    const toggle: boolean = getServerRestartToggle();
    // convert interval (minutes) to milliseconds
    const interval: number = getServerRestartInterval() * 60000;
    // diff in milliseconds
    const diff: number = Date.now() - globalState.lastServerRestart;

    if (toggle && diff > interval) {
      setLastServerRestart();
      restartServer();
    }

    
  }, 10000); // polls every 10 seconds
};
