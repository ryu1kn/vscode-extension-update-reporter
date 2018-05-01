import * as vscode from 'vscode';
import {Changelog} from './changelog';
import {parseVersion, Version} from './version';
import {Change} from '../types';

abstract class Extension {
  protected raw: vscode.Extension<any>;

  constructor(raw: vscode.Extension<any>) {
    this.raw = raw;
  }

  get id() {
    return this.raw.id;
  }

  get displayName() {
    const packageJson = this.raw.packageJSON;
    return packageJson.displayName || packageJson.name;
  }

  get version(): Version {
    return parseVersion(this.raw.packageJSON.version);
  }

  get isVscodeBundled() {
    return (
      this.id.startsWith('vscode.') ||
      this.id.startsWith('ms-vscode.')
    );
  }

  get extensionPath() {
    return this.raw.extensionPath;
  }
}

export class RawExtension extends Extension {
  withPrevInstalledVersion (prevInstalled: Version) {
    return new PreloadedExtension(this.raw, prevInstalled);
  }
}

export class PreloadedExtension extends Extension {
  private prevInstalled: Version;

  constructor (raw: vscode.Extension<any>, prevInstalled: Version) {
    super(raw);
    this.prevInstalled = prevInstalled;
  }

  hasBeenUpdated() {
    return this.version.isHigherThan(this.prevInstalled);
  }

  withHistory (changelog: Changelog): LoadedExtension {
    return new LoadedExtension(this.raw, this.prevInstalled, changelog);
  }
}

export class LoadedExtension extends Extension {
  private changelog: Changelog;
  private prevInstalled: Version;

  constructor(raw: vscode.Extension<any>, prevInstalled: Version, changelog: Changelog) {
    super(raw);
    this.changelog = changelog;
    this.prevInstalled = prevInstalled;
  }

  hasBeenUpdated() {
    return this.version.isHigherThan(this.prevInstalled);
  }

  getUpdates(): Change[] {
    return this.changelog.getUpdatesSince(this.prevInstalled);
  }
}
