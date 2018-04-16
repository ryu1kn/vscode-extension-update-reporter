const vscode = require('vscode')

commandList = []

exports.activate = context => {
  commandList.forEach(command => {
    const cmd = commandFactory[command.factoryMethodName]()
    const disposable = vscode.commands.registerCommand(
      `changelogChecker.${command.name}`,
      cmd.execute,
      cmd
    )
    context.subscriptions.push(disposable)
  })
}

exports.deactivate = () => {}
