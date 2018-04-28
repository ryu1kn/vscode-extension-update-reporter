import {Change} from "../changelog-parsers/changelog-parser";

class Changelog {
  private _raw: {versions: Change[]};

  constructor (raw: {versions: Change[]}) {
    this._raw = raw;
  }

  getUpdatesSince (baseVersion: string): Change[] {
    return this._raw.versions.filter(
      version => version.version > baseVersion
    );
  }
}

export default Changelog;
