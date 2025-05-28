
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {


  let disposable = vscode.workspace.onDidCreateFiles(async (event) => {
    for (const file of event.files) {
      const filepath = file.fsPath;
      const filename = path.basename(filepath);
      const dir_name = path.dirname(filepath);

    


      if (!filename) continue;

      const firstChar = filename[0];
      if (firstChar == firstChar.toUpperCase()) continue;

      const newFileName = firstChar.toUpperCase() + filename.slice(1);
      const newFilePath = path.join(dir_name, newFileName);

      try {
        if ( fs.existsSync(newFilePath) &&
          filepath.toLowerCase() !== newFilePath.toLowerCase()) {
          vscode.window.showWarningMessage(
            `file named ${newFileName} already exists`
          );
          continue;
        }

        await vscode.workspace.fs.rename(file, vscode.Uri.file(newFilePath));
        vscode.window.showInformationMessage(
          `Renamed "${filename}" → "${newFileName}"`
        );
      } catch (err) {
        await vscode.window.showErrorMessage(`rename failed ${err.message}`);
      }
    }
  });

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
