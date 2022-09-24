import {LoadedExtension} from './entities/extension';
import {Change} from './types';
import {Changelog} from './entities/changelog';
import {pipe} from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';

const multiline = require('multiline-string')();

export default class MarkdownReportBuilder {
  build(extensions: LoadedExtension[]): string {
    return multiline(`
      # Extension Updates

      ${this.buildExtension(extensions)}
      `);
  }

  private buildExtension(extensions: LoadedExtension[]) {
    return extensions
      .map(extension =>
        multiline(`
        <details open>
          <summary>

          ## ${extension.displayName} \`${extension.id}\`
          </summary>

          ${this.buildExtensionLinks(extension)}

          ${this.buildChangelog(extension)}
        </details>`)
      )
      .join('\n\n');
  }

  private buildExtensionLinks(extension: LoadedExtension): string {
    const links: string[] = [];
    links.push(`[Marketplace](https://marketplace.visualstudio.com/items/${extension.id})`);
    links.push(`[Changelog](https://marketplace.visualstudio.com/items/${extension.id}/changelog)`);
    if(extension.homepage) links.push(`[Homepage](${extension.homepage})`);
    return links.join(' ● ');
  }

  private buildChangelog(extension: LoadedExtension) {
    return pipe(
      extension.changelog,
      O.map(this.buildUpdates(extension)),
      O.getOrElse(() => 'CHANGELOG.md not found')
    );
  }

  private buildUpdates(extension: LoadedExtension) {
    return (changelog: Changelog) => changelog.isValid
      ? this.buildVersion(changelog.getUpdatesSince(extension.previousVersion))
      : this.buildParseFailedMessage(extension.id);
  }

  private buildVersion(changes: Change[]) {
    return changes
      .map(release =>
        multiline(`
      ### [${release.version}]
      ${this.reviseHeadingLevel(release.changeText)}`)
      )
      .join('\n\n');
  }

  private buildParseFailedMessage(extensionId: string) {
    return `Couldn't parse the changelog. [View it on Marketplace](https://marketplace.visualstudio.com/items/${extensionId}/changelog).`;
  }

  private reviseHeadingLevel(contents: string) {
    return contents.replace(/^(#{3,} )/gm, '#$1');
  }
}
