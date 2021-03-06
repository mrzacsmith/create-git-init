#!/usr/bin/env node

const figlet = require('figlet')
const chalk = require('chalk')
const clear = require('clear')
const files = require('./lib/files.js')
const inquirer = require('./lib/inquirer.js')
const github = require('./lib/github.js')
const repo = require('./lib/repo.js')

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

const getGithubToken = async () => {
  let token = github.getStoredGithubToken()
  if (token) {
    return token
  }

  token = await github.getLoginAccessToken()

  return token
}

const run = async () => {
  const creds = await inquirer.requestGithubCreds()
  console.log(creds)

  let token = github.getStoredGithubToken()
  if (!token) {
    token = await github.getLoginAccessToken()
  }
  console.log(token)

  try {
    const token = await getGithubToken()
    github.githubAuth(token)

    const url = await repo.createRemoteRepo()

    await repo.createGitIngore()

    await repo.setupRepo(url)
  } catch (err) {
    if (err) {
      switch (err.status) {
        case 401:
          console.log(
            chalk.red(
              'Could not log in, please provide correct login credentials.'
            )
          )
          break
        case 402:
          console.log(
            chalk.red('There is already a remote repo with this name.')
          )
          break
        default:
          console.log(chalk.red(err))
      }
    }
  }
}
