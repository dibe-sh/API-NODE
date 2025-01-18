// This file is responsible for creating logs directory to collect logs
const { readdirSync, mkdirSync } = require('fs');
const { resolve } = require('path');

const logDir = 'logs';

const setup = () => {
  console.log(`\t- Log Directory setup initiating 🛠️`);
  try {
    const rootDirectory = readdirSync(resolve('./'));
    if (!rootDirectory.includes(logDir)) {
      console.log(`\t- Log Directory not found 😢`);
      console.log(`\t- Creating ${logDir} directory`);
      mkdirSync(resolve(`./`, logDir));
    } else {
      console.log(`\t- Log Directory already exists ✅`);
    }
  } catch (error) {
    console.log(`\t- Error reading project ❌:`, error);
  }
};

const LogsSetup = {
  name: 'Log Directory',
  exec: setup,
};

module.exports = LogsSetup;
