class FileSystem {
  constructor ({ fs }) {
    this._fs = fs
  }

  readDirectory (path) {
    return new Promise((resolve, reject) =>
      this._fs.readdir(path, (err, data) => (err ? reject(err) : resolve(data)))
    )
  }

  readFile (path) {
    return new Promise((resolve, reject) =>
      this._fs.readFile(
        path,
        'utf8',
        (err, data) => (err ? reject(err) : resolve(data))
      )
    )
  }
}

module.exports = FileSystem
