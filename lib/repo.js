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

  createGitIngore: async () => {
    const filelist = _.without(fs.readdirSync('.'), '.git', '.gitignore')
    if (filelist.length) {
      const answers = await inquirer.askIgnoreFiles(filelist)

      if (answers.ignore.length) {
        fs.writeFileSync('.gitignore', answers.ignore.join('\n'))
      } else {
        touch('.gitignore')
      }
    } else {
      touch('.gitignore')
    }
  },

  setupRepo: async () => {
    const status = new Spinner(
      'Initializing local repo and pushing to remote ... '
    )
    status.start()

    try {
      git
        .init()
        .then(git.add('.gitignore'))
        .then(git.add('./*'))
        .then(git.commit('initial commit'))
        .then(git.addRemote('origin', url))
        .then(git.push('origin', 'master'))
    } finally {
      status.stop()
    }
  },
}
