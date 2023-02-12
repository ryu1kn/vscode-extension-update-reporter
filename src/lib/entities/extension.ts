import * as vscode from 'vscode';
import * as GitHost from 'hosted-git-info';
import {Changelog} from './changelog';
import {parseVersion, Version} from './version';
import {Option} from 'fp-ts/lib/Option';

abstract class Extension {
  private _gitHost: GitHost | undefined;

  constructor(protected readonly raw: vscode.Extension<any>) {
    this._gitHost = this.getGitHost();
  }

  // Copied logic from VSCE.
  // https://github.com/microsoft/vscode-vsce/blob/df59e0f6d35da9f0e2f6138d82534667a96527a3/src/package.ts#L198
  private getGitHost(): GitHost | undefined {
    const packageJson = this.raw.packageJSON;
    if (packageJson.repository) {
      let url: string | undefined = undefined;
      if (typeof packageJson.repository === 'string') {
        url = packageJson.repository;
      } else if (typeof packageJson.repository === 'object' && packageJson.repository.url && typeof packageJson.repository.url === 'string') {
        url = packageJson.repository.url;
      }
      if (url){
        return GitHost.fromUrl(url, { noGitPlus: true });
      }
    }
    return undefined;
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

  get homepage(): string | undefined {
    const packageJson = this.raw.packageJSON;
    if (packageJson.homepage) {
      return packageJson.homepage;
    }
    if (packageJson.links?.getstarted?.uri){
      return packageJson.links.getstarted.uri;
    }
    if (this._gitHost){
      return this._gitHost.docs();
    }
    return undefined;
  }

  get repository(): string | undefined {
    return this._gitHost?.https();
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
