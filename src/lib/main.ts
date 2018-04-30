import { ExtensionMeta } from './entities/extension';
import * as vscode from 'vscode';
import { EXTENSION_NAME } from './const';
import ConfigStore, { ExtensionVersionMap } from './config-store';
import ExtensionStore from './extension-store';

export default class Main {
  private vscode: any;
  private configStore: ConfigStore;
  private extensionStore: ExtensionStore;

  constructor (configStore: ConfigStore, extensionStore: ExtensionStore, vscode: any) {
    this.vscode = vscode;
    this.configStore = configStore;
    this.extensionStore = extensionStore;
  }

  async run (): Promise<void> {
    const uri = this.vscode.Uri.parse(`${EXTENSION_NAME}:show-updates-summary`);
    const extensions = this.getExtensions();
    const latestVersions = this.getExtensionVersionMap(extensions);
    await this.configStore.registerAllExtensions(latestVersions);

    const newExtensionVerions = this.configStore.extensionVersions;
    const updatedExtensions = extensions.filter(extension =>
      extension.isNewerThan(newExtensionVerions[extension.id])
    );
    if (updatedExtensions.length === 0) return;

    this.extensionStore.set(updatedExtensions);
    await this.vscode.commands.executeCommand(
      'vscode.previewHtml',
      uri,
      undefined,
      'Exntension Update Report'
    );
    await this.configStore.updateAllExtensionVersions(latestVersions);
  }

  private getExtensionVersionMap (extensions: ExtensionMeta[]): ExtensionVersionMap {
    return extensions.reduce(
      (map, extension) =>
        Object.assign({}, map, { [extension.id]: extension.version }),
      {}
    );
  }

  private getExtensions (): ExtensionMeta[] {
    return this.vscode.extensions.all
      .map((extension: vscode.Extension<any>) => new ExtensionMeta(extension))
      .filter((extension: ExtensionMeta) => !extension.isVscodeBundled);
  }
}
