const chalk = require('chalk');

module.exports = {
  greet: (name) => console.log(chalk.green(`Hello, ${name}!`)),
  version: '2.1.4'
};
