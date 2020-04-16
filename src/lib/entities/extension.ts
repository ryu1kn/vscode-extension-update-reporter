import * as vscode from 'vscode';
import {Changelog} from './changelog';
import {parseVersion, Version} from './version';
import {Option} from 'fp-ts/lib/Option';

abstract class Extension {
  constructor(protected readonly raw: vscode.Extension<any>) {}

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
  withPrevInstalledVersion(prevInstalled: Version) {
    return new PreloadedExtension(this.raw, prevInstalled);
  }
}

export class PreloadedExtension extends Extension {
  constructor(raw: vscode.Extension<any>,
              private readonly prevInstalled: Version) {
    super(raw);
  }

  hasBeenUpdated() {
    return this.version.isHigherThan(this.prevInstalled);
  }

  withHistory(changelog: Option<Changelog>): LoadedExtension {
    return new LoadedExtension(this.raw, this.prevInstalled, changelog);
  }
}

export class LoadedExtension extends Extension {
  constructor(raw: vscode.Extension<any>,
              private readonly prevInstalled: Version,
              public readonly changelog: Option<Changelog>) {
    super(raw);
  }

  get previousVersion() {
    return this.prevInstalled;
  }
}
