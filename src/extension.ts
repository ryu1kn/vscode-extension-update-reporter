import * as fs from 'fs';
import * as vscode from 'vscode';
import FileSystem from './lib/file-system';
import ExtensionStarter from './lib/extension-starter';
import {ExtensionContextLike, VsCodeLike} from './lib/types';

const fileSystem = new FileSystem(fs);
const integrator = new ExtensionStarter(vscode as unknown as VsCodeLike, fileSystem);

export const activate = async (context: ExtensionContextLike) => integrator.start(context);

export const deactivate = () => {};
