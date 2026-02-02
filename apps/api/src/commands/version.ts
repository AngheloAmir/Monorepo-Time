import path from 'path';
import fs from 'fs';

/**
 * Get the current version from package.json
 */
function getVersion(): string {
  // When bundled, dist/index.js is at the same level as package.json
  const packageJsonPath = path.join(__dirname, '../package.json');
  let version = '1.0.0';
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    version = packageJson.version || version;
  } catch {
    // Fallback to default version if package.json can't be read
  }
  return version;
}

/**
 * Display the current version of monorepotime
 */
export function versionCommand(): void {
  const version = getVersion();
  console.log(`monorepotime v${version}`);
}

export { getVersion };
