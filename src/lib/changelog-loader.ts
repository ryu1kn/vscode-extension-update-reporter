import {join} from 'path';
import ChangelogParser from './changelog-parser';
import FileSystem from './file-system';
import {LoadedExtension, PreloadedExtension} from './entities/extension';
import {none, Option, some} from 'fp-ts/lib/Option';

export default class ChangelogLoader {
  private readonly fileSystem: FileSystem;
  private readonly changelogParser: ChangelogParser;

  constructor(fs: FileSystem, parser: ChangelogParser) {
    this.fileSystem = fs;
    this.changelogParser = parser;
  }

  async load(extension: PreloadedExtension): Promise<LoadedExtension> {
    const changelogContents = await this.toOptional(this.fileSystem.readFile(join(extension.extensionPath, 'CHANGELOG.md')));
    const changelog = changelogContents.map(changelog => this.changelogParser.parse(changelog, extension.version));
    return extension.withHistory(changelog);
  }

  private toOptional<T>(promise: Promise<T>): Promise<Option<T>> {
    return promise.then(some, () => none);
  }

}
