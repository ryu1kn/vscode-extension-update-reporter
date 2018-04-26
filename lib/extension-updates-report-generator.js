const Extension = require('./extension')
const ExtensionFilterer = require('./extension-filterer')
const ExtensionChangeDataBuilder = require('./extension-change-data-builder')
const extensionFilterer = new ExtensionFilterer()

class ExtensionUpdatesReportGenerator {
  constructor (params) {
    this._vscExtensions = params.vscExtensions
    this._configStore = params.configStore
    this._changelogLoader = params.changelogLoader
  }

  get _targetExtensions () {
    return extensionFilterer.filter(this._vscExtensions.all)
  }

  async generate () {
    const builder = new ExtensionChangeDataBuilder()
    const extensions = await Promise.all(
      this._targetExtensions.map(async extensionData => {
        const extension = new Extension(extensionData)
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
