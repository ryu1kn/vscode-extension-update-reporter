import {DefaultChangelog} from '../entities/changelog';
import { ChangelogParser } from './changelog-parser';
import { Change } from '../types';
import {parseVersion, Version} from '../entities/version';

export default class KeepAChangelogParser implements ChangelogParser {
  isOfType (changelog: string) {
    return changelog.includes('://keepachangelog.com');
  }

  parse (changelog: string, _knownVersion: Version) {
    return new DefaultChangelog({ versions: this.splitIntoVersions(changelog) });
  }

  private splitIntoVersions (changelog: string): Change[] {
    const versionHeadingPattern = /^## \[(\d+\.\d+\.\d+)\].*/m;
    const [, ...match] = changelog.split(versionHeadingPattern);
    const changes = [];
    for (let i = 0 ; i < match.length; i += 2) {
      changes.push({
        version: parseVersion(match[i]),
        changeText: this.reviseHeadingLevel(match[i+1].trim())
      });
    }
    return changes;
  }

  private reviseHeadingLevel (contents: string) {
    return contents.replace(/^(#{3,} )/gm, '#$1');
  }
}
