import * as fs from 'fs';
import * as vscode from 'vscode';
import CommandFactory from './lib/command-factory';
import ContentProvider from './lib/content-provider';
import FileSystem from './lib/file-system';
import { EXTENSION_NAME } from './lib/const';

const fileSystem = new FileSystem({ fs });
const commandFactory = new CommandFactory({ fileSystem, vscode });
const extensionUpdatesReportGenerator = commandFactory.createReportGenerator();
const main = commandFactory.createMain();

exports.activate = async (context: vscode.ExtensionContext) => {
  const contentProvider = new ContentProvider({
    extensionUpdatesReportGenerator
  });
  const disposable = vscode.workspace.registerTextDocumentContentProvider(
    EXTENSION_NAME,
    contentProvider
  );
  context.subscriptions.push(disposable);

  await main.run();
};

exports.deactivate = () => {};
