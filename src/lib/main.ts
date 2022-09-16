import {PreloadedExtension, RawExtension} from './entities/extension';
import * as vscode from 'vscode';
import ExtensionStore from './extension-store';
import {ExtensionContextLike} from './types';
import ContentProvider from './content-provider';

export default class Main {
  constructor(private readonly extensionStore: ExtensionStore,
              private readonly contentProvider: ContentProvider,
              private readonly vscode: any) {}

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
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    panel.onDidDispose(() => {}, null, context.subscriptions);
  }

  private getExtensions(): RawExtension[] {
    return this.vscode.extensions.all
      .map((extension: vscode.Extension<any>) => new RawExtension(extension))
      .filter((extension: PreloadedExtension) => !extension.isVscodeBundled);
  }
}
