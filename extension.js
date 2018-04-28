const fs = require('fs')
const vscode = require('vscode')
const { EXTENSION_NAME } = require('./lib/const')
const CommandFactory = require('./lib/command-factory')
const ContentProvider = require('./lib/content-provider')
const FileSystem = require('./lib/file-system')

const fileSystem = new FileSystem({ fs })
const commandFactory = new CommandFactory({ fileSystem, vscode })
const extensionUpdatesReportGenerator = commandFactory.createReportGenerator()
const main = commandFactory.createMain()

exports.activate = async context => {
  const contentProvider = new ContentProvider({
    extensionUpdatesReportGenerator
  })
  const disposable = vscode.workspace.registerTextDocumentContentProvider(
    EXTENSION_NAME,
    contentProvider
  )
  context.subscriptions.push(disposable)

  await main.run()
}

exports.deactivate = () => {}
