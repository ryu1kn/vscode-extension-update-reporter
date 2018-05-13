import { LoadedExtension } from './entities/extension';
import { Change } from './types';
import {identity} from 'fp-ts/lib/function';

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
        ## ${extension.displayName} \`${extension.id}\`
        ${this.buildChangelog(extension)}`)
      )
      .join('\n\n');
  }

  private buildChangelog (extension: LoadedExtension) {
    return extension.getUpdates().fold(identity, changes => this.buildVersion(changes));
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
