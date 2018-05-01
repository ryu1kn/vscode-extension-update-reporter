import { Extension } from './entities/extension';
import { Change } from './types';

const multiline = require('multiline-string')();

export default class MarkdownReportBuilder {
  build (extensions: Extension[]): string {
    return multiline(`
      # Extension Updates

      ${this.buildExtension(extensions)}
      `);
  }

  private buildExtension (extensions: Extension[]) {
    return extensions
      .map(extension =>
        multiline(`
        ## ${extension.displayName}
        ${this.buildChangelog(extension)}`)
      )
      .join('\n\n');
  }

  private buildChangelog (extension: Extension) {
    const changes = extension.getUpdates();
    return changes.length > 0 ? this.buildVersion(changes) : 'Changelog not found or cannot be parsed.';
  }

  private buildVersion (changes: Change[]) {
    return changes
      .map(release =>
        multiline(`
      ### [${release.version}]
      ${release.changeText}`)
      )
      .join('\n\n');
  }
}
