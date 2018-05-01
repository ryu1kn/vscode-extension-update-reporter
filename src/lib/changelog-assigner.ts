import ChangelogLoader from './changelog-loader';
import {ExtensionVersionMap} from './extension-store';
import {Extension, ExtensionMeta} from './entities/extension';

export default class ChangelogAssigner {
  private changelogLoader: ChangelogLoader;

  constructor (changelogLoader: ChangelogLoader) {
    this.changelogLoader = changelogLoader;
  }

  assign (updatedExtensions: ExtensionMeta[], versionMap: ExtensionVersionMap): Promise<Extension[]> {
    return Promise.all(
      updatedExtensions.map(async extension => {
        const changelog = await this.changelogLoader.load(
          extension.extensionPath,
          extension.version
        );
        return extension.withHistory(changelog, versionMap[extension.id]);
      })
    );
  }
}
