import { ExtensionMeta } from './entities/extension';
import * as vscode from 'vscode';
import { EXTENSION_NAME } from './const';
import ExtensionStore from './extension-store';

export default class Main {
  private vscode: any;
  private extensionStore: ExtensionStore;

  constructor (extensionStore: ExtensionStore, vscode: any) {
    this.vscode = vscode;
    this.extensionStore = extensionStore;
  }

  async run (): Promise<void> {
    this.extensionStore.memoLoadedExtensions(this.getExtensions());

    if (!this.extensionStore.hasUpdatedExtensions()) return;

    await this.vscode.commands.executeCommand(
      'vscode.previewHtml',
      this.vscode.Uri.parse(`${EXTENSION_NAME}:show-updates-summary`),
      undefined,
      'Exntension Update Report'
    );
    await this.extensionStore.persistLoadedExtensions();
  }

  private getExtensions (): ExtensionMeta[] {
    return this.vscode.extensions.all
      .map((extension: vscode.Extension<any>) => new ExtensionMeta(extension))
      .filter((extension: ExtensionMeta) => !extension.isVscodeBundled);
  }
}
