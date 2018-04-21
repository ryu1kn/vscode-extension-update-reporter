const fs = require('fs')
const vscode = require('vscode')

const CommandFactory = require('./lib/command-factory')
const FileSystem = require('./lib/file-system')

const fileSystem = new FileSystem({ fs })
const commandFactory = new CommandFactory({ fileSystem, vscode })
const displayReportCommand = commandFactory.create()

exports.activate = async context => {
  const result = await displayReportCommand.execute()
  console.log(result)
}

exports.deactivate = () => {}
