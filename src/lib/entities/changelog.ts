import {Change} from "../changelog-parsers/changelog-parser";

export default class Changelog {
  private raw: {versions: Change[]};

  constructor (raw: {versions: Change[]}) {
    this.raw = raw;
  }

  getUpdatesSince (baseVersion: string): Change[] {
    return this.raw.versions.filter(
      version => version.version > baseVersion
    );
  }
}
