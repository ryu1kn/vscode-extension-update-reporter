import {PreloadedExtension, RawExtension} from './entities/extension';
import * as vscode from 'vscode';
import ExtensionStore from './extension-store';
import {ExtensionContextLike} from './types';
import ContentProvider from './content-provider';

export default class Main {
  private readonly vscode: any;
  private readonly extensionStore: ExtensionStore;

  constructor(extensionStore: ExtensionStore, vscode: any) {
    this.vscode = vscode;
    this.extensionStore = extensionStore;
  }

  async run(context: ExtensionContextLike, contentProvider: ContentProvider): Promise<void> {
    this.extensionStore.memoLoadedExtensions(this.getExtensions());

    if (!this.extensionStore.hasUpdatedExtensions()) {
      return this.extensionStore.persistLoadedExtensions();
    }

    const panel = this.vscode.window.createWebviewPanel('extension-updates', 'Extension Updates', this.vscode.ViewColumn.One, {});
    const updatedExtensions = this.extensionStore.getUpdatedExtensions();
    panel.webview.html = await contentProvider.provideTextDocumentContent(updatedExtensions);
    await this.extensionStore.persistLoadedExtensions();
    panel.onDidDispose(() => {}, null, context.subscriptions);
  }

  private getExtensions(): RawExtension[] {
    return this.vscode.extensions.all
      .map((extension: vscode.Extension<any>) => new RawExtension(extension))
      .filter((extension: PreloadedExtension) => !extension.isVscodeBundled);
  }
}
