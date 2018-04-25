const multiline = require('multiline-string')()

class ExtensionChangeDataBuilder {
  build (extensions) {
    return multiline(`
      # Extension Updates

      ${this._buildExtension(extensions)}
      `)
  }

  _buildExtension (extensions) {
    return extensions
      .map(extension =>
        multiline(`
        ## ${extension.displayName}
        ${this._buildChangelog(extension.changelog)}`)
      )
      .join('\n\n')
  }

  _buildChangelog (changelog) {
    return changelog
      ? this._buildVersion(changelog.getUpdatesSince('0.0.0'))
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
