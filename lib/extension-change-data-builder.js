const multiline = require('multiline-string')()

class ExtensionChangeDataBuilder {
  build (extensions, extensionVersions) {
    return multiline(`
      # Extension Updates

      ${this._buildExtension(extensions, extensionVersions)}
      `)
  }

  _buildExtension (extensions, extensionVersions) {
    return extensions
      .map(extension =>
        multiline(`
        ## ${extension.displayName}
        ${this._buildChangelog(
    extension.changelog,
    extensionVersions[extension.id]
  )}`)
      )
      .join('\n\n')
  }

  _buildChangelog (changelog, extensionVersion) {
    return changelog
      ? this._buildVersion(changelog.getUpdatesSince(extensionVersion))
      : 'Changelog not found or cannot be parsed as [Keep a Changelog](http://keepachangelog.com/en/1.0.0/).'
  }

  _buildVersion (releases) {
    return releases
      .map(release =>
        multiline(`
      ### [${release.version}]
      ${release.changeText}`)
      )
      .join('\n\n')
  }
}

module.exports = ExtensionChangeDataBuilder
