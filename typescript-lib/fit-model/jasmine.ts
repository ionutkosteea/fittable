#!/usr/bin/env node
import path from 'node:path';
import Jasmine from 'jasmine';

async function main() {
  const projectBaseDir = path.resolve();
  const jasmine = new Jasmine({ projectBaseDir });

  jasmine.loadConfigFile('./jasmine.json');
  await jasmine.execute();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
