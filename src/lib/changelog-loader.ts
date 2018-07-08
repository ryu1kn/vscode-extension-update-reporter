import { join } from 'path';
import ChangelogParser from './changelog-parser';
import FileSystem from './file-system';
import {Changelog} from './entities/changelog';
import {Version} from './entities/version';
import {none, Option, some} from 'fp-ts/lib/Option';

export default class ChangelogLoader {
  private readonly fileSystem: FileSystem;
  private readonly changelogParser: ChangelogParser;

  constructor(fs: FileSystem, parser: ChangelogParser) {
    this.fileSystem = fs;
    this.changelogParser = parser;
  }

  async load(extensionPath: string, knownVersion: Version): Promise<Option<Changelog>> {
    const files = await this.fileSystem.readDirectory(extensionPath);
    const changelog = files.find(file => file === 'CHANGELOG.md');
    if (!changelog) return none;

    const changelogContents = await this.fileSystem.readFile(
      join(extensionPath, changelog)
    );
    return some(this.changelogParser.parse(changelogContents, knownVersion));
  }
}
