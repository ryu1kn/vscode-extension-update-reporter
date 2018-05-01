import * as vscode from 'vscode';
import {Changelog} from './changelog';
import {parseVersion, Version} from './version';
import {Change} from '../types';

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

  get version (): Version {
    return parseVersion(this.raw.packageJSON.version);
  }

  get isVscodeBundled () {
    return (
      this.id.startsWith('vscode.') ||
      this.id.startsWith('ms-vscode.')
    );
  }

  isNewerThan (version: Version) {
    return this.version.isHigherThan(version);
  }

  get extensionPath () {
    return this.raw.extensionPath;
  }

  withHistory (changelog: Changelog, lastRecordedVersion: Version): Extension {
    return new Extension(this.raw, changelog, lastRecordedVersion);
  }
}

export class Extension extends ExtensionMeta {
  private changelog: Changelog;
  private lastRecordedVersion: Version;

  constructor (raw: vscode.Extension<any>, changelog: Changelog, lastRecordedVersion: Version) {
    super(raw);
    this.changelog = changelog;
    this.lastRecordedVersion = lastRecordedVersion;
  }

  getUpdates(): Change[] {
    return this.changelog.getUpdatesSince(this.lastRecordedVersion);
  }
}
