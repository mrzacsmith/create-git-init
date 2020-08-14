const figlet = require('figlet')
const chalk = require('chalk')
const clear = require('clear')
const files = require('./lib/files.js')
const inquirer = require('./lib/inquirer.js')

clear()

console.log(
  chalk.red.bold(
    figlet.textSync('Create Git Init', { horizontalLayout: 'full' })
  )
)

if (files.checkDirectoryExists('.git')) {
  console.log(chalk.red.bold('This is already a Git repo!'))
  process.exit()
}

const run = async () => {
  const creds = await inquirer.requestGithubCreds()
  console.log(creds)
}

run()
