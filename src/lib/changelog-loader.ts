import { join } from 'path';

class ChangelogLoader {
  private _fileSystem: any;
  private _changelogParser: any;

  constructor (params: any) {
    this._fileSystem = params.fileSystem;
    this._changelogParser = params.changelogParser;
  }

  async load (extensionPath: string, knownVersion: string) {
    const files = await this._fileSystem.readDirectory(extensionPath);
    const changelog = files.find((file: string) => file === 'CHANGELOG.md');
    if (!changelog) { return; }

    const changelogContents = await this._fileSystem.readFile(
      join(extensionPath, changelog)
    );
    return this._changelogParser.parse(changelogContents, knownVersion);
  }
}

export default ChangelogLoader;
