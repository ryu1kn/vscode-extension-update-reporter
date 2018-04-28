import Extension from "./entities/extension";
import {Change} from "./changelog-parsers/changelog-parser";

const multiline = require('multiline-string')();

class ExtensionChangeDataBuilder {
  build (extensions: Extension[], extensionVersions: any): string {
    return multiline(`
      # Extension Updates

      ${this.buildExtension(extensions, extensionVersions)}
      `);
  }

  private buildExtension (extensions: Extension[], extensionVersions: any) {
    return extensions
      .map(extension =>
        multiline(`
        ## ${extension.displayName}
        ${this.buildChangelog( extension, extensionVersions[extension.id] )}`)
      )
      .join('\n\n');
  }

  private buildChangelog (extension: Extension, extensionVersion: any) {
    return extension.changelog
      ? this.buildVersion(extension.changelog.getUpdatesSince(extensionVersion))
      : 'Changelog not found or cannot be parsed as [Keep a Changelog](http://keepachangelog.com/en/1.0.0/).';
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

export default ExtensionChangeDataBuilder;
