const fs = require('fs')
const path = require('path')

module.exports = {
  getCurrentBaseDirectory: () => {
    return path.basename(process.cwd())
  }

  checkDirectoryExists: (filePath) => {
    return fs.existsSync(filePath)
  }
}