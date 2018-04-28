import Changelog from '../entities/changelog';
import { ChangelogParser } from './changelog-parser';
import { Change } from '../types';

export default class KeepAChangelogParser implements ChangelogParser {
  isOfType (changelog: string) {
    return changelog.includes('://keepachangelog.com');
  }

  parse (changelog: string, _knownVersion: string) {
    return new Changelog({ versions: this.splitIntoVersions(changelog) });
  }

  private splitIntoVersions (changelog: string): Change[] {
    const versionHeadingPattern = /^## \[(\d+\.\d+\.\d+)\].*/m;
    const [, ...match] = changelog.split(versionHeadingPattern);
    const changes = [];
    for (let i = 0 ; i < match.length; i += 2) {
      changes.push({
        version: match[i],
        changeText: this.reviseHeadingLevel(match[i+1].trim())
      });
    }
    return changes;
  }

  private reviseHeadingLevel (contents: string) {
    return contents.replace(/^(#{3,} )/gm, '#$1');
  }
}
