const program = require('commander');
const dotEnv = require('dotenv');

program
  .version('1.0.0')
  .option('-c, --chdir [dir]', 'Change the working directory', process.cwd())
  .option('--env [name]', 'Use dotenv to load an environment file')
  .arguments('<name>')
  .action(up)
  .parse(process.argv);

if (program.env) {
  const e = dotEnv.config({
    path: typeof program.env === 'string' ? program.env : '.env'
  });
  if (e && e.error instanceof Error) {
    throw e.error;
  }
}

function up(name) {
  const migrateFile = require(`../${name}`);
  migrateFile.up(name, () => {
    process.exit(0);
  });
}
