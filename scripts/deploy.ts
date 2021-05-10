import { join } from 'path';
import * as dotenv from 'dotenv';
import * as ora from 'ora';
import { execSync } from 'child_process';
import { program } from 'commander';

dotenv.config({
  path: join(__dirname, '..', '.env'),
});

import { COMPONENT_NAME, VERSION_YAML_PATH } from './config';
import { copySync, rmdirSync, parseYaml, getComponentConfig, publishComponent } from './utils';

async function buildProject() {
  const buildPath = join(__dirname, '..', 'build');
  rmdirSync(buildPath);
  execSync(`tsc -p .`, {
    cwd: process.cwd(),
  });
  copySync(join(__dirname, '..', 'src/node_modules'), join(__dirname, '..', 'build/node_modules'));
}

async function deploy(options: { [propName: string]: any }) {
  const spinner = ora().start('Start deploying...\n');

  spinner.info(`[BUILD] Building project...`);
  await buildProject();
  spinner.succeed(`[BUILD] Build project success`);

  spinner.info(`Generate config file for compooent ${COMPONENT_NAME}...`);
  const { version } = parseYaml(VERSION_YAML_PATH);
  const compConfig = getComponentConfig(version);

  if (options.version) {
    compConfig.version = options.version;
  }
  if (options.dev) {
    compConfig.version = 'dev';
  }

  try {
    spinner.info(`Publishing component ${COMPONENT_NAME}@${compConfig.version}...`);
    await publishComponent(compConfig);
    spinner.succeed(`Publish compooent ${COMPONENT_NAME}@${compConfig.version} success`);
  } catch (e) {
    spinner.warn(`Publish compooent ${COMPONENT_NAME}@${compConfig.version} error: ${e.message}`);
  }

  spinner.stop();

  return compConfig;
}

async function run() {
  program
    .description('Deploy components')
    .option('-d, --dev [dev]', 'deploy dev version component')
    .option('-v, --version [version]', 'component version')
    .option('-ob, --onlyBuild [onlyBuild]', 'only build project', false)
    .action((options) => {
      deploy(options);
    });

  program.parse(process.argv);
}

run();
