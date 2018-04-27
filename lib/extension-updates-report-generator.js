const Extension = require('./extension')
const ExtensionChangeDataBuilder = require('./extension-change-data-builder')

class ExtensionUpdatesReportGenerator {
  constructor (params) {
    this._vscExtensions = params.vscExtensions
    this._configStore = params.configStore
    this._changelogLoader = params.changelogLoader
  }

  get _targetExtensions () {
    const extensions = this._vscExtensions.all.map(
      extension => new Extension(extension)
    )
    return extensions.filter(extension =>
      extension.shouldReportUpdate(this._configStore.extensionVersions)
    )
  }

  async generate () {
    const builder = new ExtensionChangeDataBuilder()
    const extensions = await Promise.all(
      this._targetExtensions.map(async extension => {
        extension.changelog = await this._changelogLoader.load(
          extension.extensionPath,
          extension.version
        )
        return extension
      })
    )
    return builder.build(extensions, this._configStore.extensionVersions)
  }
}

module.exports = ExtensionUpdatesReportGenerator
