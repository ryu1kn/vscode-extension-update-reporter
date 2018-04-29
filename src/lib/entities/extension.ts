import * as vscode from 'vscode';
import Changelog from './changelog';
import { ExtensionVersionMap } from '../config-store';

export class ExtensionMeta {
  private raw: vscode.Extension<any>;

  constructor (raw: vscode.Extension<any>) {
    this.raw = raw;
  }

  get id () {
    return this.raw.id;
  }

  get displayName () {
    const packageJson = this.raw.packageJSON;
    return packageJson.displayName || packageJson.name;
  }

  get version () {
    return this.raw.packageJSON.version;
  }

  get isVscodeBundled () {
    return (
      this.id.startsWith('vscode.') ||
      this.id.startsWith('ms-vscode.')
    );
  }

  shouldReportUpdate (extensionVersions: ExtensionVersionMap) {
    return this.version !== extensionVersions[this.id];
  }

  get extensionPath () {
    return this.raw.extensionPath;
  }

  withExtension (changelog?: Changelog): Extension {
    return new Extension(this.raw, changelog);
  }
}

export class Extension extends ExtensionMeta {
  private _changelog?: Changelog;

  constructor (raw: vscode.Extension<any>, changelog?: Changelog) {
    super(raw);
    this._changelog = changelog;
  }

  get changelog () {
    return this._changelog;
  }
}
