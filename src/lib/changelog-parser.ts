import DefaultChangelogParser from './changelog-parsers/default';
import KeepAChangelogParser from './changelog-parsers/keep-a-changelog';
import {Changelog} from './entities/changelog';
import {Version} from './entities/version';

export default class ChangelogParser {
  private keepAChangelogParser = new KeepAChangelogParser();
  private defaultChangelogParser = new DefaultChangelogParser();

  parse (changelog: string, knownVersion: Version): Changelog {
    return this.chooseParser(changelog).parse(changelog, knownVersion);
  }

  private chooseParser (changelog: string) {
    return this.keepAChangelogParser.isOfType(changelog)
      ? this.keepAChangelogParser : this.defaultChangelogParser;
  }
}
