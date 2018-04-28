const { EXTENSION_NAME } = require('./const')

class Main {
  constructor (params) {
    this._vscode = params.vscode
  }

  async run () {
    const uri = this._vscode.Uri.parse(`${EXTENSION_NAME}:show-updates-summary`)
    await this._vscode.commands.executeCommand(
      'vscode.previewHtml',
      uri,
      undefined,
      'Exntension Update Report'
    )
  }
}

module.exports = Main
