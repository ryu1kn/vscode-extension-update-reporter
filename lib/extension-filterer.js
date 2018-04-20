class ExtensionFilterer {
  filter (extensions) {
    return extensions.filter(
      extension =>
        !(
          extension.isBuiltin ||
          extension.id.startsWith('vscode.') ||
          extension.id.startsWith('ms-vscode.')
        )
    )
  }
}

module.exports = ExtensionFilterer
