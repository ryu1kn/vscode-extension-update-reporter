import ChangelogLoader from './changelog-loader';
import {LoadedExtension, PreloadedExtension} from './entities/extension';
import {none, Option, some} from 'fp-ts/lib/Option';

export default class ChangelogAssigner {
  private readonly changelogLoader: ChangelogLoader;

  constructor(changelogLoader: ChangelogLoader) {
    this.changelogLoader = changelogLoader;
  }

  assign(updatedExtensions: PreloadedExtension[]): Promise<LoadedExtension[]> {
    return Promise.all(updatedExtensions.map(extension => this.loadChangelog(extension)));
  }

  private loadChangelog(extension: PreloadedExtension) {
    return this.toOptional(this.changelogLoader.load(extension.extensionPath,　extension.version))
      .then(changelog => extension.withHistory(changelog));
  }

  private toOptional<T>(promise: Promise<T>): Promise<Option<T>> {
    return promise.then(some, () => none);
  }

}
