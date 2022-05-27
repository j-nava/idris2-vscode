import * as vscode from 'vscode';
import { getLanguageClient, getReplChannel } from './GlobalState';
import * as serverRestart from './ServerRestart';
const lib = require("./extension-lib.js");

export const restartServer = async () => {
  serverRestart.restartServer();
};

// TODO: add default commands for the compiler
// import * as childProcess from "child_process";
// const runShellCommand = (cmd: string) =>
//   new Promise<string>((resolve, reject) => {
//     childProcess.exec(cmd, (err, out) => {
//       if (err) {
//         return reject(err);
//       }
//       return resolve(out);
//     });
// });

// export const build = async () => {
//   runShellCommand("echo 'test'")
//           .then((response) => {
//             const replChannel = getReplChannel();
//             replChannel.appendLine(response as string);
//             replChannel.show(true);
//           });
// }

export const repl = async () => {

  const expression = await vscode.window.showInputBox({
    placeHolder: "",
    prompt: "Evaluate expression",
    value: "" 
  });

  if(expression === "") {
    vscode.window.showErrorMessage("No expression informed");
  }
  else {
    const client = getLanguageClient();
    client.sendRequest("workspace/executeCommand", { command: "repl", arguments: [expression]})
          .then((response) => {
            const replChannel = getReplChannel();
            replChannel.appendLine(response as string);
            replChannel.show(true);
          });
  }

}

export const lsp = async () => {

  const command = await vscode.window.showInputBox({
    placeHolder: "",
    prompt: "Enter LSP command (command list here: https://github.com/idris-community/idris2-lsp/blob/main/doc/commands.md)",
    value: "" 
  });
  const args = await vscode.window.showInputBox({
    placeHolder: "",
    prompt: "Enter arguments (will be parsed with JSON.parse)",
    value: "" 
  });

  if(command === "") {
    vscode.window.showErrorMessage("No command informed");
  }
  else {
    const client = getLanguageClient();
    client.sendRequest("workspace/executeCommand", { command: command, arguments: JSON.parse(args)})
          .then((response) => {
            const replChannel = getReplChannel();
            replChannel.appendLine(response as string);
            replChannel.show(true);
          },
          (error) => {
            const replChannel = getReplChannel();
            replChannel.appendLine(error as string);
            replChannel.show(true);
          });
  }

}

export const docsSearch = async () => {
  const searchArgs = await vscode.window.showInputBox({
    placeHolder: "",
    prompt: "Search for libraries, functions, or types",
    value: ""
  });

	vscode.window.showInformationMessage(lib.searchDocs(searchArgs));
  const result = JSON.parse(lib.searchDocs(searchArgs));

  const resultt = await vscode.window.showQuickPick(result, {
		onDidSelectItem: item => vscode.window.showInformationMessage(`Focus ${item}`)
	});

	vscode.window.showInformationMessage(`Got: ${result}`);
}
