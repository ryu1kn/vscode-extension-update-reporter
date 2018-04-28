import { join } from 'path';
import {ChangelogParser} from "./changelog-parsers/changelog-parser";
import FileSystem from "./file-system";
import Changelog from "./entities/changelog";

export default class ChangelogLoader {
  private fileSystem: FileSystem;
  private changelogParser: ChangelogParser;

  constructor (params: any) {
    this.fileSystem = params.fileSystem;
    this.changelogParser = params.changelogParser;
  }

  async load (extensionPath: string, knownVersion: string): Promise<Changelog|undefined> {
    const files = await this.fileSystem.readDirectory(extensionPath);
    const changelog = files.find(file => file === 'CHANGELOG.md');
    if (!changelog) { return; }

    const changelogContents = await this.fileSystem.readFile(
      join(extensionPath, changelog)
    );
    return this.changelogParser.parse(changelogContents, knownVersion);
  }
}
