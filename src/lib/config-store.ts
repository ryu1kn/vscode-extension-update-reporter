import { EXTENSION_ID } from './const';
import * as vscode from 'vscode';
import {parseVersion, Version} from './entities/version';
import {mapObject} from './utils';
const EXTENSION_VERSION_MAP = 'extensionVersions';

export type ExtensionVersionMap = {
  [extensionId: string]: Version
};

export default class ConfigStore {
  private vscWorkspace: any;

  constructor (vscWorkspace: any) {
    this.vscWorkspace = vscWorkspace;
  }

  get extensionVersions (): ExtensionVersionMap {
    const rawExtensionVersions = this.extensionConfig.get(EXTENSION_VERSION_MAP) || {};
    return mapObject(rawExtensionVersions, parseVersion);
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
    return this.extensionConfig.update(EXTENSION_VERSION_MAP, this.stringifyVersions(newRegisteredVersions), true);
  }

  updateAllExtensionVersions(latestVersions: ExtensionVersionMap) {
    return this.extensionConfig.update(EXTENSION_VERSION_MAP, this.stringifyVersions(latestVersions), true);
  }

  private stringifyVersions (versionMap: ExtensionVersionMap): {[extensionId: string]: string} {
    return mapObject(versionMap, value => value.toString());
  }
}
