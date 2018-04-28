import Changelog from '../entities/changelog';
import { ChangelogParser, Change } from './changelog-parser';

class KeepAChangelogParser implements ChangelogParser {
  isOfType (changelog: string) {
    return changelog.includes('://keepachangelog.com');
  }

  parse (changelog: string, _knownVersion: string) {
    return new Changelog({ versions: this._splitIntoVersions(changelog) });
  }

  private _splitIntoVersions (changelog: string): Change[] {
    const versionHeadingPattern = /^## \[(\d+\.\d+\.\d+)\].*/m;
    const [, ...match] = changelog.split(versionHeadingPattern);
    const changes = []
    for (let i = 0 ; i < match.length; i += 2) {
      changes.push({
        version: match[i],
        changeText: this._reviseHeadingLevel(match[i+1].trim())
      });
    }
    return changes;
  }

  private _reviseHeadingLevel (contents: string) {
    return contents.replace(/^(#{3,} )/gm, '#$1');
  }
}

export default KeepAChangelogParser;
