#!/usr/bin/env node

'use strict';

const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');

const command = process.argv[2];

const commands = {
  install,
  help
};

if (commands[command]) {
  commands[command]();
} else {
  if (command) {
    console.log(`Error: invalid command '${command}'`);
    console.log();
  }
  help();
  process.exit(1);
}

function die(message) {
  console.error(message);
  process.exit(1);
}

function copy(src, dst) {
  const data = fs.readFileSync(src);
  fs.writeFileSync(dst, data, { flag: 'wx' })
}

function install() {
  const currentPath = process.cwd();
  const relativeTypesPath = './flow';

  const absoluteTypesPath = path.resolve(currentPath, relativeTypesPath);

  const stat = fs.statSync(absoluteTypesPath);

  if (!stat.isDirectory()) {
    die(`./flow is not a directory`)
  }

  const packageName = process.env.npm_package_name;

  if (!packageName) {
    die('Package name is not defined');
  }

  const parentPath = path.resolve(currentPath, '..');
  const dirName = path.basename(parentPath);

  if (dirName !== 'node_modules') {
    process.exit(0);
  }

  const flowPath = path.resolve(parentPath, '.flow');

  try {
    fs.mkdirSync(flowPath);
  } catch(e) {
    if (!e || e.code !== 'EEXIST') {
      die('Failed to create .flow directory')
    }
  }

  const packagePath = path.resolve(flowPath, packageName);

  rimraf.sync(packagePath);
  fs.mkdirSync(packagePath);

  fs.readdirSync(absoluteTypesPath)
    .map(relativePath => [
      path.resolve(absoluteTypesPath, relativePath),
      path.resolve(packagePath, relativePath),
    ])
    .forEach(p => copy(p[0], p[1]));
}

function help() {
  console.log(
`Available commands:
  'install' - install type declarations
`);
}
