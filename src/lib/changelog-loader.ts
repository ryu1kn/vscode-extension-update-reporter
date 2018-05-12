import { join } from 'path';
import ChangelogParser from './changelog-parser';
import FileSystem from './file-system';
import {Changelog} from './entities/changelog';
import {Version} from './entities/version';
import {Either, left, right} from 'fp-ts/lib/Either';

export default class ChangelogLoader {
  private fileSystem: FileSystem;
  private changelogParser: ChangelogParser;

  constructor (fs: FileSystem, parser: ChangelogParser) {
    this.fileSystem = fs;
    this.changelogParser = parser;
  }

  async load (extensionPath: string, knownVersion: Version): Promise<Either<string, Changelog>> {
    const files = await this.fileSystem.readDirectory(extensionPath);
    const changelog = files.find(file => file === 'CHANGELOG.md');
    if (!changelog) return left('CHANGELOG.md not found');

    const changelogContents = await this.fileSystem.readFile(
      join(extensionPath, changelog)
    );
    return right(this.changelogParser.parse(changelogContents, knownVersion));
  }
}
