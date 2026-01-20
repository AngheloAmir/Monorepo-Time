import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

/**
 * Initialize monorepotime in the user's project
 * This command adds the "monorepotime" script to the user's package.json
 */
export async function initCommand() {
  try {
    // Find the package.json in the current working directory
    const cwd = process.cwd();
    const packageJsonPath = path.join(cwd, 'package.json');

    // Check if package.json exists
    if (!await fs.pathExists(packageJsonPath)) {
      console.error(chalk.red('❌ Error: package.json not found in the current directory.'));
      console.log(chalk.yellow('Please run this command in the root of your project where package.json exists.'));
      process.exit(1);
    }

    // Read the package.json
    const packageJson = await fs.readJson(packageJsonPath);

    // Ensure scripts object exists
    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }

    // Check if monorepotime script already exists
    if (packageJson.scripts.monorepotime) {
      console.log(chalk.yellow('⚠️  The "monorepotime" script already exists in your package.json:'));
      console.log(chalk.cyan(`   "${packageJson.scripts.monorepotime}"`));
      console.log(chalk.yellow('Skipping initialization.'));
      return;
    }

    // Add the monorepotime script
    packageJson.scripts.monorepotime = 'monorepotime';

    // Write the updated package.json back
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

    console.log(chalk.green('✅ Successfully initialized monorepotime!'));
    console.log(chalk.cyan('\nAdded to your package.json:'));
    console.log(chalk.white('  "scripts": {'));
    console.log(chalk.white('    ...'));
    console.log(chalk.green('    "monorepotime": "monorepotime"'));
    console.log(chalk.white('  }'));
    console.log(chalk.cyan('\nYou can now run:'));
    console.log(chalk.white('  npm run monorepotime'));
    console.log();

  } catch (error: any) {
    console.error(chalk.red('❌ Error during initialization:'), error.message);
    process.exit(1);
  }
}
