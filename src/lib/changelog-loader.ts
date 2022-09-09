import {join} from 'path';
import ChangelogParser from './changelog-parser';
import FileSystem from './file-system';
import {LoadedExtension, PreloadedExtension} from './entities/extension';
import * as O from 'fp-ts/lib/Option';
import {pipe} from 'fp-ts/lib/function';

export default class ChangelogLoader {
  constructor(private readonly fileSystem: FileSystem,
              private readonly changelogParser: ChangelogParser) {}

  async load(extension: PreloadedExtension): Promise<LoadedExtension> {
    const changelog = pipe(
      await this.toOptional(this.fileSystem.readFile(join(extension.extensionPath, 'CHANGELOG.md'))),
      O.map(changelog => this.changelogParser.parse(changelog, extension.version))
    );
    return extension.withHistory(changelog);
  }

  private toOptional<T>(promise: Promise<T>): Promise<O.Option<T>> {
    return promise.then(O.some, () => O.none);
  }
}
