import { join } from 'path';
import {ChangelogParser} from "./changelog-parsers/changelog-parser";
import FileSystem from "./file-system";
import Changelog from "./entities/changelog";

class ChangelogLoader {
  private _fileSystem: FileSystem;
  private _changelogParser: ChangelogParser;

  constructor (params: any) {
    this._fileSystem = params.fileSystem;
    this._changelogParser = params.changelogParser;
  }

  async load (extensionPath: string, knownVersion: string): Promise<Changelog|undefined> {
    const files = await this._fileSystem.readDirectory(extensionPath);
    const changelog = files.find(file => file === 'CHANGELOG.md');
    if (!changelog) { return; }

    const changelogContents = await this._fileSystem.readFile(
      join(extensionPath, changelog)
    );
    return this._changelogParser.parse(changelogContents, knownVersion);
  }
}

export default ChangelogLoader;
