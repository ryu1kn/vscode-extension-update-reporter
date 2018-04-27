const { EXTENSION_ID } = require('./const')

class ConfigStore {
  constructor ({ vscWorkspace }) {
    this._vscWorkspace = vscWorkspace
  }

  get extensionVersions () {
    return this._get('extensionVersions') || {}
  }

  _get (configName) {
    const extensionConfig = this._vscWorkspace.getConfiguration(EXTENSION_ID)
    return extensionConfig.get(configName)
  }
}

module.exports = ConfigStore
