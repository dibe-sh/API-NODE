const EnvSetup = require('./env.js');

// Array of setup functions that gets executed as required
/** [{
 * name:string,
 * exec: ()=>void
}] */
const configurations = [EnvSetup];
console.log(`\n\tSetup Initializing ⏳\n`);
if (configurations.length > 0) {
  console.log(
    `${configurations.length} configuration${configurations.length > 2 ? 's' : ''} found 📦\n`,
  );
  configurations.forEach((config) => {
    console.log(`Setting up ${config.name} 🧪`);
    config.exec();
    console.log(`${config.name} setup success 🍾`);
  });
} else console.log(`Configurations not found ❌`);
console.log(`\n\tSetup Success ⌛️\n`);
