const Changelog = require('./changelog')
const parseChangelog = require('keep-a-changelog').parser

class ChangelogParser {
  parse (changelog) {
    try {
      const parsedChangelog = parseChangelog(changelog)
      if (parsedChangelog && parsedChangelog.releases.length > 0) {
        return new Changelog(parsedChangelog)
      }
    } catch (e) {
      // Do nothing if it failed to parse the given changelog
    }
  }
}

module.exports = ChangelogParser
