const DefaultChangelogParser = require('./changelog-parsers/default')
const KeepAChangelogParser = require('./changelog-parsers/keep-a-changelog')

class ChangelogParser {
  constructor () {
    this._parsers = [new KeepAChangelogParser(), new DefaultChangelogParser()]
  }

  parse (changelog, knownVersion) {
    const parser = this._chooseParser(changelog, knownVersion)
    return parser.parse(changelog, knownVersion)
  }

  _chooseParser (changelog) {
    return this._parsers.find(parser => parser.isOfType(changelog))
  }
}

module.exports = ChangelogParser
