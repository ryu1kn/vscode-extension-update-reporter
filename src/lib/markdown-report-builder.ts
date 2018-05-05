import { LoadedExtension } from './entities/extension';
import { Change } from './types';

const multiline = require('multiline-string')();

export default class MarkdownReportBuilder {
  build (extensions: LoadedExtension[]): string {
    return multiline(`
      # Extension Updates

      ${this.buildExtension(extensions)}
      `);
  }

  private buildExtension (extensions: LoadedExtension[]) {
    return extensions
      .map(extension =>
        multiline(`
        ## ${extension.displayName}
        ${this.buildChangelog(extension)}`)
      )
      .join('\n\n');
  }

  private buildChangelog (extension: LoadedExtension) {
    const changes = extension.getUpdates();
    return changes.length > 0 ? this.buildVersion(changes) : 'Changelog not found or cannot be parsed.';
  }

  private buildVersion (changes: Change[]) {
    return changes
      .map(release =>
        multiline(`
      ### [${release.version}]
      ${this.reviseHeadingLevel(release.changeText)}`)
      )
      .join('\n\n');
  }

  private reviseHeadingLevel (contents: string) {
    return contents.replace(/^(#{3,} )/gm, '#$1');
  }
}
