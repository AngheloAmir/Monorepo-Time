import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

/**
 * Initialize monorepotime in the user's project
 * This command adds the "monorepotime" script to the user's package.json
 */
export async function initCommand() {
  const { execa } = await import('execa');
  const cwd = process.cwd();

  // Detect package manager
  let pm = 'npm';
  let installCmd = 'install';
  let devFlag = '-D';

  const lockfiles = {
    'yarn.lock': 'yarn',
    'pnpm-lock.yaml': 'pnpm',
    'bun.lockb': 'bun',
    'package-lock.json': 'npm'
  };

  // Check for lockfiles to determine package manager
  for (const [file, manager] of Object.entries(lockfiles)) {
    if (await fs.pathExists(path.join(cwd, file))) {
      pm = manager;
      break;
    }
  }

  // Fallback to user agent if no lockfile found
  if (pm === 'npm' && process.env.npm_config_user_agent) {
    if (process.env.npm_config_user_agent.startsWith('yarn')) pm = 'yarn';
    else if (process.env.npm_config_user_agent.startsWith('pnpm')) pm = 'pnpm';
    else if (process.env.npm_config_user_agent.startsWith('bun')) pm = 'bun';
  }

  // Set install command based on package manager
  if (pm === 'yarn') {
    installCmd = 'add';
  } else if (pm === 'bun') {
    installCmd = 'add';
  }

  console.log(chalk.green(`Detected package manager: ${pm}`));
  console.log(chalk.green(`Installing monorepotime as dev dependency using ${pm}...`));

  try {
    await execa(pm, [installCmd, devFlag, 'monorepotime'], { stdio: 'inherit', cwd, shell: true });
  } catch (error: any) {
    console.error(chalk.red(`❌ Failed to install monorepotime using ${pm}:`), error.message);
    console.log(chalk.yellow(`Please run "${pm} ${installCmd} ${devFlag} monorepotime" manually.`));
  }

  const packageJsonPath = path.join(cwd, 'package.json');
  try {
    const packageJson = await fs.readJson(packageJsonPath);

    // Ensure scripts object exists
    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }

    // Add monorepotime script
    if (!packageJson.scripts.monorepotime) {
      packageJson.scripts.monorepotime = 'monorepotime';
      console.log(chalk.green(`Added "monorepotime" to package.json scripts`));
    }

    // Add packageManager field if missing
    if (!packageJson.packageManager) {
      // Get version of the package manager
      try {
        const { stdout } = await execa(pm, ['--version'], { shell: true });
        const version = stdout.trim();
        packageJson.packageManager = `${pm}@${version}`;
        console.log(chalk.green(`Added "packageManager": "${pm}@${version}" to package.json`));
      } catch (e) {
         // If version check fails, default to generic latest or skip
         packageJson.packageManager = `${pm}@latest`;
         console.log(chalk.yellow(`Could not detect ${pm} version, defaulting to "latest"`));
      }
    }

    // Write the updated package.json back
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

    console.log(chalk.green('✅ Successfully initialized monorepotime!'));
    console.log(chalk.cyan('\nYou can now run:'));
    console.log(chalk.white(`  ${pm} run monorepotime`));
    console.log();

  } catch (error: any) {
    console.error(chalk.red('❌ Error updating package.json:'), error.message);
    process.exit(1);
  }
}
