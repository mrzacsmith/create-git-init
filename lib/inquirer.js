const inquirer = require('inquirer')

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
}
