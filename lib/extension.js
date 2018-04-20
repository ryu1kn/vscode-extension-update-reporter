class Extension {
  constructor ({ raw }) {
    this._raw = raw
  }

  isUpdated (version) {
    return this._raw.packageJSON.version > version
  }
}

module.exports = Extension
