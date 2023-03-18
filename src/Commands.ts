import * as vscode from "vscode";
import { getLanguageClient, getReplChannel } from "./GlobalState";
import * as serverRestart from "./ServerRestart";

export const restartServer = () => {
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
  const writeEmitter = new vscode.EventEmitter<string>();
  let line = "";
  const pty = {
    onDidWrite: writeEmitter.event,
    open: () => writeEmitter.fire("Idris2 REPL\r\n"),
    close: () => { /* noop*/ },
    handleInput: (data: string) => {
      if (data === "\r") { // Enter
        const client = getLanguageClient();
        client.sendRequest("workspace/executeCommand", { command: "repl", arguments: [line]})
              .then((response) => {
                writeEmitter.fire("\r\n");
                writeEmitter.fire(response as string);
                writeEmitter.fire("\r\n\r\n");
                line = "";
              });

        line = "";
        return;
      }
      if (data === "\x7f") { // Backspace
        if (line.length === 0) {
          return;
        }
        line = line.substr(0, line.length - 1);
        // Move cursor backward
        writeEmitter.fire("\x1b[D");
        // Delete character
        writeEmitter.fire("\x1b[P");
        return;
      }
      line += data;
      writeEmitter.fire(data);
    }
		};
		const terminal = vscode.window.createTerminal({ name: `Idris2 REPL`, pty });
		terminal.show();
    writeEmitter.fire(">");

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
