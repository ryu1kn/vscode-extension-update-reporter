import {PreloadedExtension, RawExtension} from './entities/extension';
import * as vscode from 'vscode';
import ExtensionStore from './extension-store';
import {ExtensionContextLike} from './types';
import ContentProvider from './content-provider';

export default class Main {
  private readonly vscode: any;
  private readonly extensionStore: ExtensionStore;
  private readonly contentProvider: ContentProvider;

  constructor(extensionStore: ExtensionStore, contentProvider: ContentProvider, vscode: any) {
    this.vscode = vscode;
    this.extensionStore = extensionStore;
    this.contentProvider = contentProvider;
  }

  async run(context: ExtensionContextLike): Promise<void> {
    this.extensionStore.memoLoadedExtensions(this.getExtensions());

    if (this.extensionStore.hasUpdatedExtensions()) {
      await this.displayUpdatesReport(context);
    }
    await this.extensionStore.persistLoadedExtensions();
  }

  private async displayUpdatesReport(context: ExtensionContextLike) {
    const panel = this.vscode.window.createWebviewPanel('extension-updates', 'Extension Updates', this.vscode.ViewColumn.One, {});
    const updatedExtensions = this.extensionStore.getUpdatedExtensions();
    panel.webview.html = await this.contentProvider.provideTextDocumentContent(updatedExtensions);
    panel.onDidDispose(() => {}, null, context.subscriptions);
  }

  private getExtensions(): RawExtension[] {
    return this.vscode.extensions.all
      .map((extension: vscode.Extension<any>) => new RawExtension(extension))
      .filter((extension: PreloadedExtension) => !extension.isVscodeBundled);
  }
}
