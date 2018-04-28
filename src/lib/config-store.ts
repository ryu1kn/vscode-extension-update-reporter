import { EXTENSION_ID } from './const';
import * as vscode from "vscode";
const EXTENSION_VERSION_MAP = 'extensionVersions';

export type ExtensionVersionMap = {
  [extensionId: string]: string
};

export default class ConfigStore {
  private vscWorkspace: any;

  constructor (params: any) {
    this.vscWorkspace = params.vscWorkspace;
  }

  get extensionVersions (): ExtensionVersionMap {
    return this.extensionConfig.get(EXTENSION_VERSION_MAP) || {};
  }

  private get extensionConfig (): vscode.WorkspaceConfiguration {
    return this.vscWorkspace.getConfiguration(EXTENSION_ID);
  }

  async registerAllExtensions (extensionVersions: ExtensionVersionMap): Promise<void> {
    const registeredVersions = this.extensionVersions;
    const newExtensionIds = Object.keys(extensionVersions).filter(
      extensionId => !registeredVersions[extensionId]
    );
    if (newExtensionIds.length === 0) { return; }

    const newExtensionsMap = newExtensionIds.reduce(
      (accumulated, extensionId) => Object.assign({}, accumulated, { [extensionId]: extensionVersions[extensionId] }),
      {}
    );
    const newRegisteredVersions = Object.assign({}, registeredVersions, newExtensionsMap);
    return this.extensionConfig.update(EXTENSION_VERSION_MAP, newRegisteredVersions, true);
  }
}
