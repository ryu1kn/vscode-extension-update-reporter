import { Extension } from './entities/extension';
import { Change } from './types';
import { ExtensionVersionMap } from './extension-store';
import {Version} from './entities/version';
import {Changelog} from './entities/changelog';

const multiline = require('multiline-string')();

export default class ExtensionChangeDataBuilder {
  build (extensions: Extension[], extensionVersions: ExtensionVersionMap): string {
    return multiline(`
      # Extension Updates

      ${this.buildExtension(extensions, extensionVersions)}
      `);
  }

  private buildExtension (extensions: Extension[], extensionVersions: ExtensionVersionMap) {
    return extensions
      .map(extension =>
        multiline(`
        ## ${extension.displayName}
        ${this.buildChangelog(extension.changelog, extensionVersions[extension.id])}`)
      )
      .join('\n\n');
  }

  private buildChangelog (changelog: Changelog, extensionVersion: Version) {
    return changelog.isValid
      ? this.buildVersion(changelog.getUpdatesSince(extensionVersion))
      : 'Changelog not found or cannot be parsed.';
  }

  private buildVersion (releases: Change[]) {
    return releases
      .map(release =>
        multiline(`
      ### [${release.version}]
      ${release.changeText}`)
      )
      .join('\n\n');
  }
}
