import { ChangelogParser, Change } from './changelog-parser';
import Changelog from '../entities/changelog';

export default class DefaultChangelogParser implements ChangelogParser {
  isOfType (changelog: string) {
    return true;
  }

  parse (changelog: string, knownVersion: string) {
    const heading = this.findVersionHeading(changelog, knownVersion);
    if (!heading) { return; }

    const rawVersions = this.splitIntoVersions(changelog, heading);
    return new Changelog({ versions: rawVersions });
  }

  private findVersionHeading (changelog: string, knownVersion: string) {
    const match = changelog.match(new RegExp(`^(#+ *)${knownVersion}`, 'm'));
    return match && match[1];
  }

  private splitIntoVersions (changelog: string, versionHeading: string): Change[] {
    const versionHeadingPattern = new RegExp(`^${versionHeading}(.*)`, 'm');
    const [, ...match] = changelog.split(versionHeadingPattern);
    const changes = [];
    for (let i = 0 ; i < match.length; i += 2) {
      changes.push({
        version: match[i],
        changeText: match[i+1].trim()
      });
    }
    return changes;
  }
}
