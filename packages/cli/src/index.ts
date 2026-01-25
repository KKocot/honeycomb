import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import prompts from "prompts";
import fs from "fs-extra";
import path from "path";
import { components, allComponents, componentsByCategory } from "./registry.js";

const program = new Command();

program
  .name("honeycomb")
  .description("CLI for adding Honeycomb (Hive blockchain UI) components to your project")
  .version("0.1.0");

// Init command
program
  .command("init")
  .description("Initialize Honeycomb in your project")
  .option("-y, --yes", "Skip confirmation prompt")
  .action(async (options) => {
    console.log(chalk.bold("\n🍯 Welcome to Honeycomb!\n"));

    const cwd = process.cwd();

    // Check if it's a valid project
    const packageJsonPath = path.join(cwd, "package.json");
    if (!(await fs.pathExists(packageJsonPath))) {
      console.log(chalk.red("✗ No package.json found. Please run this command in a project directory."));
      process.exit(1);
    }

    if (!options.yes) {
      const response = await prompts({
        type: "confirm",
        name: "proceed",
        message: "This will set up Honeycomb in your project. Continue?",
        initial: true,
      });

      if (!response.proceed) {
        console.log(chalk.yellow("Cancelled."));
        process.exit(0);
      }
    }

    const spinner = ora("Setting up Honeycomb...").start();

    try {
      // Create directories
      await fs.ensureDir(path.join(cwd, "components/hive"));
      await fs.ensureDir(path.join(cwd, "contexts"));
      await fs.ensureDir(path.join(cwd, "lib"));

      // Add utils if not exists
      const utilsPath = path.join(cwd, "lib/utils.ts");
      if (!(await fs.pathExists(utilsPath))) {
        await fs.writeFile(utilsPath, components.utils.files[0].content);
        spinner.text = "Created lib/utils.ts";
      }

      // Add HiveProvider
      const contextPath = path.join(cwd, "contexts/hive-context.tsx");
      if (!(await fs.pathExists(contextPath))) {
        await fs.writeFile(contextPath, components["hive-provider"].files[0].content);
        spinner.text = "Created contexts/hive-context.tsx";
      }

      spinner.succeed(chalk.green("Honeycomb initialized!"));

      console.log("\n" + chalk.bold("Next steps:"));
      console.log(chalk.dim("  1. Install dependencies:"));
      console.log(chalk.cyan("     npm install @hiveio/wax clsx tailwind-merge lucide-react"));
      console.log(chalk.dim("  2. Wrap your app with HiveProvider:"));
      console.log(chalk.cyan('     import { HiveProvider } from "@/contexts/hive-context"'));
      console.log(chalk.dim("  3. Add components:"));
      console.log(chalk.cyan("     npx honeycomb add avatar"));
      console.log(chalk.cyan("     npx honeycomb add keychain-login"));
      console.log();
    } catch (error) {
      spinner.fail(chalk.red("Failed to initialize"));
      console.error(error);
      process.exit(1);
    }
  });

// Add command
program
  .command("add")
  .description("Add a component to your project")
  .argument("[components...]", "Components to add")
  .option("-y, --yes", "Skip confirmation prompt")
  .option("-o, --overwrite", "Overwrite existing files")
  .option("-a, --all", "Add all components")
  .action(async (componentNames: string[], options) => {
    const cwd = process.cwd();

    // Check if project is initialized
    const utilsPath = path.join(cwd, "lib/utils.ts");
    if (!(await fs.pathExists(utilsPath))) {
      console.log(chalk.yellow("⚠ Project not initialized. Run 'npx honeycomb init' first."));
      const response = await prompts({
        type: "confirm",
        name: "init",
        message: "Initialize now?",
        initial: true,
      });
      if (response.init) {
        // Run init
        await fs.ensureDir(path.join(cwd, "components/hive"));
        await fs.ensureDir(path.join(cwd, "contexts"));
        await fs.ensureDir(path.join(cwd, "lib"));
        await fs.writeFile(utilsPath, components.utils.files[0].content);
        const contextPath = path.join(cwd, "contexts/hive-context.tsx");
        await fs.writeFile(contextPath, components["hive-provider"].files[0].content);
        console.log(chalk.green("✓ Initialized Honeycomb"));
      } else {
        process.exit(0);
      }
    }

    // If --all flag, add all components
    if (options.all) {
      componentNames = allComponents.filter((c) => c !== "utils" && c !== "hive-provider");
    }

    // If no components specified, show interactive picker
    if (!componentNames || componentNames.length === 0) {
      const response = await prompts({
        type: "multiselect",
        name: "components",
        message: "Select components to add",
        choices: Object.entries(componentsByCategory)
          .filter(([cat]) => cat !== "core")
          .flatMap(([category, comps]) => [
            { title: chalk.bold.dim(`── ${category.toUpperCase()} ──`), value: null, disabled: true },
            ...comps.map((c) => ({
              title: c,
              value: c,
              description: components[c].description,
            })),
          ])
          .filter((c) => c.value !== null),
        hint: "Space to select, Enter to confirm",
      });

      if (!response.components || response.components.length === 0) {
        console.log(chalk.yellow("No components selected."));
        process.exit(0);
      }

      componentNames = response.components;
    }

    // Validate component names
    const invalid = componentNames.filter((c) => !components[c]);
    if (invalid.length > 0) {
      console.log(chalk.red(`✗ Unknown components: ${invalid.join(", ")}`));
      console.log(chalk.dim(`Available: ${allComponents.join(", ")}`));
      process.exit(1);
    }

    // Collect all dependencies (including registry dependencies)
    const toAdd = new Set<string>();
    const allDeps = new Set<string>();

    function collectDeps(name: string) {
      if (toAdd.has(name)) return;
      toAdd.add(name);
      const comp = components[name];
      comp.dependencies.forEach((d) => allDeps.add(d));
      comp.registryDependencies.forEach((d) => {
        if (d !== "utils" && d !== "hive-provider") {
          collectDeps(d);
        }
      });
    }

    componentNames.forEach(collectDeps);

    // Show what will be added
    console.log(chalk.bold("\nComponents to add:"));
    toAdd.forEach((c) => {
      if (c !== "utils" && c !== "hive-provider") {
        console.log(chalk.cyan(`  • ${c}`));
      }
    });

    if (allDeps.size > 0) {
      console.log(chalk.bold("\nDependencies required:"));
      allDeps.forEach((d) => console.log(chalk.dim(`  • ${d}`)));
    }

    if (!options.yes) {
      const response = await prompts({
        type: "confirm",
        name: "proceed",
        message: "Proceed?",
        initial: true,
      });

      if (!response.proceed) {
        console.log(chalk.yellow("Cancelled."));
        process.exit(0);
      }
    }

    const spinner = ora("Adding components...").start();

    try {
      for (const name of toAdd) {
        if (name === "utils" || name === "hive-provider") continue;

        const comp = components[name];
        for (const file of comp.files) {
          const filePath = path.join(cwd, file.path);

          // Check if file exists
          if ((await fs.pathExists(filePath)) && !options.overwrite) {
            spinner.warn(chalk.yellow(`Skipped ${file.path} (already exists)`));
            continue;
          }

          await fs.ensureDir(path.dirname(filePath));
          await fs.writeFile(filePath, file.content);
          spinner.text = `Added ${file.path}`;
        }
      }

      spinner.succeed(chalk.green(`Added ${toAdd.size} component(s)!`));

      if (allDeps.size > 0) {
        console.log(chalk.bold("\n📦 Install dependencies:"));
        console.log(chalk.cyan(`   npm install ${Array.from(allDeps).join(" ")}`));
      }

      console.log();
    } catch (error) {
      spinner.fail(chalk.red("Failed to add components"));
      console.error(error);
      process.exit(1);
    }
  });

// List command
program
  .command("list")
  .description("List all available components")
  .action(() => {
    console.log(chalk.bold("\n🍯 Honeycomb Components\n"));

    Object.entries(componentsByCategory).forEach(([category, comps]) => {
      if (category === "core") return;
      console.log(chalk.bold.underline(category.toUpperCase()));
      comps.forEach((c) => {
        const comp = components[c];
        console.log(`  ${chalk.cyan(c.padEnd(20))} ${chalk.dim(comp.description)}`);
      });
      console.log();
    });
  });

program.parse();
