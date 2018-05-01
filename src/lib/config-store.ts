import {EXTENSION_ID} from './const';
import * as vscode from 'vscode';
import {mapObject, ObjectMap} from './utils';
import {parseVersion, Version} from './entities/version';
import {PreloadedExtension} from './entities/extension';

const EXTENSION_VERSION_MAP = 'lastCheckedVersions';

export type ExtensionVersionMap = {
  [extensionId: string]: Version
};

export default class ConfigStore {
  private vscWorkspace: any;

  constructor(vscWorkspace: any) {
    this.vscWorkspace = vscWorkspace;
  }

  get lastCheckedVersions(): ExtensionVersionMap {
    const versionMap = this.extensionConfig.get(EXTENSION_VERSION_MAP) || {};
    return mapObject(versionMap, parseVersion);
  }

  private get extensionConfig(): vscode.WorkspaceConfiguration {
    return this.vscWorkspace.getConfiguration(EXTENSION_ID);
  }

  async updateLastCheckedVersions(lastCheckedVersions: PreloadedExtension[]) {
    const versionMap = this.getExtensionVersionMap(lastCheckedVersions);
    return this.extensionConfig.update(EXTENSION_VERSION_MAP, versionMap, true);
  }

  private getExtensionVersionMap (extensions: PreloadedExtension[]): ObjectMap {
    return extensions.reduce(
      (map, extension) =>
        Object.assign({}, map, { [extension.id]: extension.version.toString() }),
      {}
    );
  }
}
