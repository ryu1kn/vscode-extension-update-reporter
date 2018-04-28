import * as vscode from 'vscode';
import Changelog from "./changelog";

class Extension {
  private _raw: vscode.Extension<any>;
  private _changelog?: Changelog;

  constructor (raw: vscode.Extension<any>) {
    this._raw = raw;
  }

  get id () {
    return this._raw.id;
  }

  get displayName () {
    const packageJson = this._raw.packageJSON;
    return packageJson.displayName || packageJson.name;
  }

  get version () {
    return this._raw.packageJSON.version;
  }

  get isVscodeBundled () {
    return (
      this.id.startsWith('vscode.') ||
      this.id.startsWith('ms-vscode.')
    );
  }

  shouldReportUpdate (extensionVersions: any) {
    return this.version !== extensionVersions[this.id];
  }

  get extensionPath () {
    return this._raw.extensionPath;
  }

  get changelog () {
    return this._changelog;
  }

  set changelog (changelog) {
    this._changelog = changelog;
  }
}

export default Extension;
