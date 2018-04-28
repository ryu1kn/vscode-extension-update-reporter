import DefaultChangelogParser from './changelog-parsers/default';
import KeepAChangelogParser from './changelog-parsers/keep-a-changelog';

class ChangelogParser {
  private _parsers: any;

  constructor () {
    this._parsers = [new KeepAChangelogParser(), new DefaultChangelogParser()];
  }

  parse (changelog: string, knownVersion: any) {
    const parser = this._chooseParser(changelog);
    return parser.parse(changelog, knownVersion);
  }

  _chooseParser (changelog: string) {
    return this._parsers.find((parser: any) => parser.isOfType(changelog));
  }
}

export default ChangelogParser;
