import ChangelogLoader from './changelog-loader';
import {LoadedExtension, PreloadedExtension} from './entities/extension';

export default class ChangelogAssigner {
  private readonly changelogLoader: ChangelogLoader;

  constructor(changelogLoader: ChangelogLoader) {
    this.changelogLoader = changelogLoader;
  }

  assign(updatedExtensions: PreloadedExtension[]): Promise<LoadedExtension[]> {
    return Promise.all(
      updatedExtensions.map(async extension => {
        const changelog = await this.changelogLoader.load(
          extension.extensionPath,
          extension.version
        );
        return extension.withHistory(changelog);
      })
    );
  }
}
