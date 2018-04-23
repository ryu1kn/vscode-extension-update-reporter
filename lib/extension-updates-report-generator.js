const Extension = require('./extension')
const ExtensionFilterer = require('./extension-filterer')
const ExtensionChangeDataBuilder = require('./extension-change-data-builder')
const extensionFilterer = new ExtensionFilterer()

class ExtensionUpdatesReportGenerator {
  constructor (params) {
    this._vscExtensions = params.vscExtensions
    this._changelogLoader = params.changelogLoader
  }

  get _targetExtensions () {
    return extensionFilterer.filter(this._vscExtensions.all)
  }

  async generate () {
    const builder = new ExtensionChangeDataBuilder()
    const extensions = await Promise.all(
      this._targetExtensions.map(async extension => {
        const changelog = await this._changelogLoader.load(
          extension.extensionPath
        )
        return new Extension({ raw: extension, changelog })
      })
    )
    return builder.build(extensions)
  }
}

module.exports = ExtensionUpdatesReportGenerator
