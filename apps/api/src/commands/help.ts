import { getVersion } from './version';

/**
 * Display help information with available commands
 */
export function helpCommand(): void {
  const version = getVersion();
  console.log(`
monorepotime v${version}

Usage: monorepotime [command]

Available commands:
  init        Initialize monorepotime in your project
  -v          Show the current version
  -help       Show this help message

Examples:
  npx monorepotime init    Initialize monorepotime in your project
  npx monorepotime -v      Display version number
  npx monorepotime         Start the monorepotime GUI server
`);
}
