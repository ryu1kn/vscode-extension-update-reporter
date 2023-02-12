import {PreloadedExtension, RawExtension} from './entities/extension';
import * as vscode from 'vscode';
import ExtensionStore from './extension-store';
import ContentProvider from './content-provider';
import {VsCodeLike} from './types';

export default class Main {
  constructor(private readonly extensionStore: ExtensionStore,
              private readonly contentProvider: ContentProvider,
              private readonly vscode: VsCodeLike) {}

  async run(): Promise<void> {
    this.extensionStore.memoLoadedExtensions(this.getExtensions());

    if (this.extensionStore.hasUpdatedExtensions()) {
      await this.displayUpdatesReport();
    }
    await this.extensionStore.persistLoadedExtensions();
  }

  async show(): Promise<void> {
    await this.displayUpdatesReport();
  }

  private async displayUpdatesReport() {
    const panel = this.vscode.window.createWebviewPanel('extension-updates', 'Extension Updates', this.vscode.ViewColumn.One, {});
    const updatedExtensions = this.extensionStore.getUpdatedExtensions();
    panel.webview.html = await this.contentProvider.provideTextDocumentContent(updatedExtensions);
  }

  private getExtensions(): RawExtension[] {
    return this.vscode.extensions.all
      .map((extension: vscode.Extension<any>) => new RawExtension(extension))
      .filter((extension: PreloadedExtension) => !extension.isVscodeBundled);
  }
}
