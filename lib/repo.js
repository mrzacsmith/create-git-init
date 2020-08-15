const CLI = require('clui')
const fs = require('fs')
const git = require('simple-git/promise')()
const Spinner = CLI.Sparkline
const touch = require('touch')
const _ = require('lodash')
const inquirer = require('./inquirer.js')
const gh = require('./github.js')

module.exports = {
  createRemoteRepo: async () => {
    const github = gh.getInstance()
    const answers = await inquirer.askRepoDetails()

    const data = {
      name: answers.name,
      description: answers.description,
      private: answers.visibility === 'private',
    }

    const status = new Spinner('Creating your new repo ...')
    status.start()

    try {
      const response = await github.repos.createForAuthenicationUser(data)
      return response.data.ssh_url
    } finally {
      status.stop()
    }
  },
}
