const { EXTENSION_ID } = require('./const')
const EXTENSION_VERSION_MAP = 'extensionVersions'

class ConfigStore {
  private _vscWorkspace: any

  constructor (params: any) {
    this._vscWorkspace = params.vscWorkspace
  }

  get extensionVersions () {
    return this._extensionConfig.get(EXTENSION_VERSION_MAP)
  }

  get _extensionConfig () {
    return this._vscWorkspace.getConfiguration(EXTENSION_ID)
  }

  registerAllExtensions (extensionVersions: any) {
    const registeredVersions = this.extensionVersions
    const newExtensionIds = Object.keys(extensionVersions).filter(
      extensionId => !registeredVersions[extensionId]
    )
    if (newExtensionIds.length === 0) return

    const newExtensionsMap = newExtensionIds.reduce(
      (accumulated: any, extensionId: any) =>
        Object.assign({}, accumulated, { [extensionId]: extensionVersions[extensionId] }),
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

export default ConfigStore
