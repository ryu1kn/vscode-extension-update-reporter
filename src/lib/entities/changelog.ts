class Changelog {
  private _raw: any;

  constructor (raw: any) {
    this._raw = raw;
  }

  getUpdatesSince (baseVersion: string) {
    const newerVersions = this._raw.versions.filter(
      (version: any) => version.version > baseVersion
    );
    return newerVersions;
  }
}

export default Changelog;
