import * as fs from 'fs';
import * as vscode from 'vscode';
import FileSystem from './lib/file-system';
import ExtensionStarter from './lib/extension-starter';
import { COMMAND } from './lib/const';

const fileSystem = new FileSystem(fs);
const integrator = new ExtensionStarter(vscode, fileSystem);

export async function activate(context: vscode.ExtensionContext) {
  const commandHandler = () => {
    integrator.start();
  };

  context.subscriptions.push(
    vscode.commands.registerCommand(COMMAND, commandHandler)
  );

  return integrator.start();
}

export const deactivate = () => {};
