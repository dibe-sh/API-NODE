// This file is responsible for copying .env.example to .env if it doesn't exist
const { readdirSync, copyFileSync } = require('fs');
const { resolve } = require('path');

const envFile = '.env';
const envExampleFile = envFile + '.example';

const setup = () => {
  console.log(`\t- Environment setup initiating 🛠️`);
  try {
    const rootDirectory = readdirSync(resolve('./'));
    if (!rootDirectory.includes(envFile)) {
      console.log(`\t- Environment file not found 😢`);
      console.log(`\t- Copying ${envExampleFile} to ${envFile}`);
      copyFileSync(envExampleFile, envFile);
    } else {
      console.log(`\t- Environment Configuration already exists ✅`);
    }
  } catch (error) {
    console.log(`\t- Error reading project ❌:`, error);
  }
};

const EnvSetup = {
  name: 'Environment',
  exec: setup,
};

module.exports = EnvSetup;
