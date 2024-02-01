const program = require('commander');
// const path = require('path');
const dotEnv = require('dotenv');

program
  .version('1.0.0')
  .option('-c, --chdir [dir]', 'Change the working directory', process.cwd())
  .option('--env [name]', 'Use dotenv to load an environment file')
  .arguments('<name>')
  .action(down)
  .parse(process.argv);

if (program.env) {
  const e = dotEnv.config({
    path: typeof program.env === 'string' ? program.env : '.env'
  });
  if (e && e.error instanceof Error) {
    throw e.error;
  }
}

function down(name) {
  const migrateFile = require(`../${name}`);
  migrateFile.down(name, () => {
    process.exit(0);
  });
}
