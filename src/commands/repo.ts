import { Command, flags } from "@oclif/command";
import { join } from "path";
import { CWD } from "../constants";
import logger from "../logger";
import Parser, { commonStacks, Stack } from "../parser";
import Runner from "../runner";

export default class Repo extends Command {
  static description =
    "Bootstrap a project via a local .stack file and start the dev environment";

  static flags = {
    help: flags.help({ char: "h" }),
    branch: flags.string({
      char: "b",
      description:
        "Branch to use when looking for stack file, default is repo's default",
    }),
    overwrite: flags.boolean({
      char: "o",
      default: false,
      description: "Overwrite the specified directory",
    }),
    path: flags.string({
      char: "p",
      description: "Path to look for stack file in repo",
    }),
    debug: flags.boolean({
      char: "d",
      default: false,
      description: "Enable debug mode",
    }),
    common: flags.string({
      char: "c",
      description: "Select a common utility to use to start the project",
    }),
  };

  static args = [
    {
      name: "project",
      description: "GitHub project (org/repo) to read the stack file from",
      required: true,
    },
    {
      name: "directory",
      description:
        "Directory to install to, default is the project's repo name",
      optional: true,
    },
  ];

  async run() {
    const { args, flags } = this.parse(Repo);
    const { project, directory } = args;
    const { overwrite, branch, path, debug, common } = flags;

    const projectRegex = /([a-z]|[A-Z]|[0-9]|-|_)+\/([a-z]|[A-Z]|[0-9]|-|_)+/g;
    if (project.match(projectRegex)[0] !== project) {
      logger.debug(`${project} did not match regex`);
      throw new Error("Project does not match format `org/repo`");
    }

    logger.setSettings({ minLevel: debug ? "debug" : "info" });

    try {
      logger.debug(project);
      logger.debug(directory);
      const parser = new Parser();

      let stackFile: Stack;
      if (common) {
        stackFile = await parser.useCommonStack(
          project,
          common as commonStacks
        );
      } else {
        stackFile = await parser.readGitHub(project, { branch, path });
      }
      logger.debug(stackFile);

      const workingDir = directory ?? join(CWD, project.split("/")[1]);

      logger.debug(workingDir);

      const runner = new Runner(stackFile, workingDir, { overwrite });
      await runner.start();
    } catch (e) {
      logger.error("Caught an error");
      logger.error(e);
      this.exit(1);
    }

    this.exit(0);
  }
}
