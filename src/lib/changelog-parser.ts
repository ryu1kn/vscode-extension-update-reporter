import { ChangelogParser as Parser } from './changelog-parsers/changelog-parser';
import DefaultChangelogParser from './changelog-parsers/default';
import KeepAChangelogParser from './changelog-parsers/keep-a-changelog';
import Changelog from "./entities/changelog";

class ChangelogParser {
  private _parsers: Parser[];

  constructor () {
    this._parsers = [new KeepAChangelogParser(), new DefaultChangelogParser()];
  }

  parse (changelog: string, knownVersion: string): Changelog|undefined {
    const parser = this._chooseParser(changelog);
    return parser && parser.parse(changelog, knownVersion);
  }

  private _chooseParser (changelog: string) {
    return this._parsers.find(parser => parser.isOfType(changelog));
  }
}

export default ChangelogParser;
