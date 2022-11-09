import * as fs from 'fs';
import * as vscode from 'vscode';
import FileSystem from './lib/file-system';
import ExtensionStarter from './lib/extension-starter';

const fileSystem = new FileSystem(fs);
const integrator = new ExtensionStarter(vscode, fileSystem);

export async function activate(context: vscode.ExtensionContext) {
  return integrator.start(context);
}

export const deactivate = () => {};
