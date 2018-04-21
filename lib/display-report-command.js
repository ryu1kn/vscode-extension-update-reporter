const Extension = require('./extension')
const ExtensionFilterer = require('./extension-filterer')
const extensionFilterer = new ExtensionFilterer()
const multiline = require('multiline-string')()

class DisplayReportCommand {
  constructor (params) {
    this._vscExtensions = params.vscExtensions
    this._changelogLoader = params.changelogLoader
  }

  get _targetExtensions () {
    return extensionFilterer.filter(this._vscExtensions.all)
  }

  async execute () {
    const extensions = await Promise.all(
      this._targetExtensions.map(async extension => {
        const changelog = await this._changelogLoader.load(
          extension.extensionPath
        )
        return new Extension({ raw: extension, changelog })
      })
    )
    const header = '# Extension Updates\n'
    const extensionUpdates = extensions.map(extension =>
      multiline(`
        ## ${extension.displayName}
        ${extension.changelog}
        `)
    )
    return [header, ...extensionUpdates].join('\n')
  }
}

module.exports = DisplayReportCommand
