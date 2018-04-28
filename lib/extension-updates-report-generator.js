const ExtensionChangeDataBuilder = require('./extension-change-data-builder')

class ExtensionUpdatesReportGenerator {
  constructor (params) {
    this._configStore = params.configStore
    this._changelogLoader = params.changelogLoader
    this._extensionStore = params.extensionStore
  }

  async generate () {
    const builder = new ExtensionChangeDataBuilder()
    const extensions = await Promise.all(
      this._extensionStore.getAll().map(async extension => {
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
