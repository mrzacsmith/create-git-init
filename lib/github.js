const CLI = require('clui')
const Configstore = require('configstore')
const Octokit = require('@octokit/rest')
const Spinner = CLI.Spinner
const { createBasicAuth } = require('@octokit/auth-basic')
const inquirer = require('./inquirer.js')
const pkg = require('../package-lock.json')
const conf = new Configstore(pkg.name)

let octokit

module.exports = {
  getInstance: () => {
    return octokit
  },
  githubAuth: (token) => {
    octokit: new Octokit({
      auth: token,
    })
  },
  getStoredGithubToken: () => {
    return conf.get('github.token')
  },
  getLoginAccessToken: async () => {
    const creds = await inquirer.requestGithubCreds()
    const status = new Spinner(
      'Checking your creds and requesting a token from the Octocat ... '
    )

    status.start()
    const auth = createBasicAuth({
      username: creds.username,
      password: creds.password,
      async on2Fa() {
        status.stop()
        const response = await inquirer.getTwoFactorAuthenticationCode()
        status.start()
        return response.twoFactorAuthenticateCode
      },
      token: {
        scopes: ['user', 'repo', 'repo:status', 'public_repo'],
        note: 'CGI ~ simple command line tool to inilize a Github repo',
      },
    })

    try {
      const response = await auth()
      if (response.token) {
        conf.set('github.token', response.token)
      } else {
        throw new Error('Github access token was not in the response.')
      }
    } finally {
      status.stop()
    }
  },
}
