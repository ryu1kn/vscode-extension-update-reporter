const ExtensionFilterer = require('./extension-filterer')
const extensionFilterer = new ExtensionFilterer()

class DisplayReportCommand {
  constructor (params) {
    this._vscExtensions = params.vscExtensions
    this._changelogLoader = params.changelogLoader
  }

  get _targetExtensions () {
    return extensionFilterer.filter(this._vscExtensions.all)
  }

  execute () {
    return Promise.all(
      this._targetExtensions
        .map(extension => extension.extensionPath)
        .map(extensionPath => this._changelogLoader.load(extensionPath))
    )
  }
}

module.exports = DisplayReportCommand
