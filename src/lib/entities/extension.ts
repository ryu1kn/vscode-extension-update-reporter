import * as vscode from 'vscode';
import Changelog from "./changelog";
import { ExtensionVersionMap } from '../config-store';

export default class Extension {
  private raw: vscode.Extension<any>;
  private _changelog?: Changelog;

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

  get changelog () {
    return this._changelog;
  }

  set changelog (changelog) {
    this._changelog = changelog;
  }
}
