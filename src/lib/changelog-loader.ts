import {join} from 'path';
import ChangelogParser from './changelog-parser';
import FileSystem from './file-system';
import {Changelog} from './entities/changelog';
import {Version} from './entities/version';

export default class ChangelogLoader {
  private readonly fileSystem: FileSystem;
  private readonly changelogParser: ChangelogParser;

  constructor(fs: FileSystem, parser: ChangelogParser) {
    this.fileSystem = fs;
    this.changelogParser = parser;
  }

  async load(extensionPath: string, knownVersion: Version): Promise<Changelog> {
    const changelogContents = await this.fileSystem.readFile(join(extensionPath, 'CHANGELOG.md'));
    return this.changelogParser.parse(changelogContents, knownVersion);
  }
}
