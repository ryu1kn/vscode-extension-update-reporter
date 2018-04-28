import Extension from './entities/extension';
import * as vscode from "vscode";
import { EXTENSION_NAME } from './const';

class Main {
  private _vscode: any;
  private _configStore: any;
  private _extensionStore: any;

  constructor (params: any) {
    this._vscode = params.vscode;
    this._configStore = params.configStore;
    this._extensionStore = params.extensionStore;
  }

  async run (): Promise<void> {
    const uri = this._vscode.Uri.parse(`${EXTENSION_NAME}:show-updates-summary`);
    const extensions = this._getExtensions();
    await this._configStore.registerAllExtensions(
      this._getExtensionVersionMap(extensions)
    );

    const newExtensionVerions = this._configStore.extensionVersions;
    const updatedExtensions = extensions.filter(extension =>
      extension.shouldReportUpdate(newExtensionVerions)
    );
    if (updatedExtensions.length > 0) {
      this._extensionStore.set(updatedExtensions);
      await this._vscode.commands.executeCommand(
        'vscode.previewHtml',
        uri,
        undefined,
        'Exntension Update Report'
      );
    }
  }

  private _getExtensionVersionMap (extensions: Extension[]) {
    return extensions.reduce(
      (map: any, extension) =>
        Object.assign({}, map, { [extension.id]: extension.version }),
      {}
    );
  }

  private _getExtensions (): Extension[] {
    return this._vscode.extensions.all
      .map((extension: vscode.Extension<any>) => new Extension(extension))
      .filter((extension: Extension) => !extension.isVscodeBundled);
  }
}

export default Main;
