import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  target: 'node16',
  format: ['cjs'],
  clean: true,
  // Bundle these local workspace packages so consumers don't need to find them in a registry
  noExternal: ['apiroute', 'config', 'types', 'template', 'execa', 'fs-extra', 'tree-kill', 'open', 'chalk', 'cors', 'express', 'fast-glob', 'pidusage', 'socket.io'],
});

