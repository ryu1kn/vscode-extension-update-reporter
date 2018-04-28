import Extension from './entities/extension';
import * as vscode from "vscode";
import { EXTENSION_NAME } from './const';
import ConfigStore, { ExtensionVersionMap } from './config-store';
import ExtensionStore from './extension-store';

export default class Main {
  private vscode: any;
  private configStore: ConfigStore;
  private extensionStore: ExtensionStore;

  constructor (params: any) {
    this.vscode = params.vscode;
    this.configStore = params.configStore;
    this.extensionStore = params.extensionStore;
  }

  async run (): Promise<void> {
    const uri = this.vscode.Uri.parse(`${EXTENSION_NAME}:show-updates-summary`);
    const extensions = this.getExtensions();
    await this.configStore.registerAllExtensions(
      this.getExtensionVersionMap(extensions)
    );

    const newExtensionVerions = this.configStore.extensionVersions;
    const updatedExtensions = extensions.filter(extension =>
      extension.shouldReportUpdate(newExtensionVerions)
    );
    if (updatedExtensions.length > 0) {
      this.extensionStore.set(updatedExtensions);
      await this.vscode.commands.executeCommand(
        'vscode.previewHtml',
        uri,
        undefined,
        'Exntension Update Report'
      );
    }
  }

  private getExtensionVersionMap (extensions: Extension[]): ExtensionVersionMap {
    return extensions.reduce(
      (map, extension) =>
        Object.assign({}, map, { [extension.id]: extension.version }),
      {}
    );
  }

  private getExtensions (): Extension[] {
    return this.vscode.extensions.all
      .map((extension: vscode.Extension<any>) => new Extension(extension))
      .filter((extension: Extension) => !extension.isVscodeBundled);
  }
}
