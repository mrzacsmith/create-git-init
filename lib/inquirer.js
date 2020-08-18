const inquirer = require('inquirer')
const files = require('./files.js')

module.exports = {
  requestGithubCreds: () => {
    const questions = [
      {
        name: 'GH username',
        type: 'input',
        message: 'Please enter your Github username or email address:',
        validate: function (value) {
          if (value.length) {
            return true
          } else {
            return 'Please enter your Github username or email address:'
          }
        },
      },
      {
        name: 'password',
        type: 'password',
        message: 'Please enter your password:',
        validate: function (value) {
          if (value.length) {
            return true
          } else {
            return 'Please enter your password:'
          }
        },
      },
    ]
    return inquirer.prompt(questions)
  },

  getTwoFactorAuthenticationCode: () => {
    return inquirer.prompt({
      name: 'twoFactorAuthenticateCode',
      type: 'input',
      message: 'Please enter your 2FA code: ',
      validate: function (vale) {
        if (value.length) {
          return true
        } else {
          return 'Please ener your 2FA code: '
        }
      },
    })
  },

  getRepoDetails: () => {
    const argv = require('minimist')(process.argv.slice(2))

    const questions = [
      {
        type: 'input',
        name: 'name',
        message: 'Enter your repo name: ',
        default: argv._[0] || files.getCurrentBaseDirectory(),
        validate: function (value) {
          if (value.length) {
            return true
          } else {
            return 'Enter your repo name: '
          }
        },
      },
      {
        type: 'input',
        name: 'description',
        default: argv._[1] || null,
        message: 'Repo description ~ OPTIONAL: ',
      },
      {
        type: 'list',
        name: 'visibility',
        message: 'Public or private: ',
        choices: ['public', 'private'],
        default: 'public',
      },
    ]
    return inquirer.prompt(questions)
  },

  askIgnoreFiles: (filelist) => {
    const questions = [
      {
        type: 'checkbox',
        name: 'ignore',
        message: 'Select the files and/or folders you wish to ignore: ',
        choices: filelist,
        default: ['node_modules', 'bower_components', '*.env'],
      },
    ]
    return inquirer.prompt(questions)
  },
}
