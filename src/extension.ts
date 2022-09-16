import * as fs from 'fs';
import * as vscode from 'vscode';
import FileSystem from './lib/file-system';
import ExtensionStarter from './lib/extension-starter';

const fileSystem = new FileSystem(fs);
const integrator = new ExtensionStarter(vscode, fileSystem);

export const activate = async (context: vscode.ExtensionContext) => integrator.start(context);

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const deactivate = () => {};
