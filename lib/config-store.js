const { EXTENSION_ID } = require('./const')
const EXTENSION_VERSION_MAP = 'extensionVersions'

class ConfigStore {
  constructor ({ vscWorkspace }) {
    this._vscWorkspace = vscWorkspace
  }

  get extensionVersions () {
    return this._extensionConfig.get(EXTENSION_VERSION_MAP)
  }

  get _extensionConfig () {
    return this._vscWorkspace.getConfiguration(EXTENSION_ID)
  }

  registerAllExtensions (extensionVersions) {
    const registeredVersions = this.extensionVersions
    const newExtensions = Object.entries(extensionVersions).filter(
      ([extensionId]) => !registeredVersions[extensionId]
    )
    if (newExtensions.length === 0) return

    const newExtensionsMap = newExtensions.reduce(
      (accumulated, extension) =>
        Object.assign({}, accumulated, { [extension[0]]: extension[1] }),
      {}
    )
    const newRegisteredVersions = Object.assign(
      {},
      registeredVersions,
      newExtensionsMap
    )
    return this._extensionConfig.update(
      EXTENSION_VERSION_MAP,
      newRegisteredVersions,
      true
    )
  }
}

module.exports = ConfigStore
