import { Command, flags } from "@oclif/command";
import { join } from "path";
import { CWD } from "../constants";
import logger from "../logger";
import Parser from "../parser";
import Runner from "../runner";

export default class File extends Command {
  static description =
    "Bootstrap a project via a local .stack file and start the dev environment";

  static flags = {
    help: flags.help({ char: "h" }),
    overwrite: flags.boolean({
      char: "o",
      default: false,
      description: "Overwrite the specified directory",
    }),
    debug: flags.boolean({
      char: "d",
      default: false,
      description: "Enable debug mode",
    }),
  };

  static args = [
    { name: "file", description: "File path to read from", optional: false },
    {
      name: "directory",
      description: "Directory to install to",
      optional: false,
    },
  ];

  async run() {
    const { args, flags } = this.parse(File);
    const { file, directory } = args;
    const { overwrite, debug } = flags;

    if (!directory) {
      throw new Error("The directory argument is needed");
    }

    logger.setSettings({ minLevel: debug ? "debug" : "info" });

    try {
      const parser = new Parser();
      const stackFile = await parser.readFile(file);
      logger.debug(stackFile);
      logger.debug(file);
      logger.debug(directory);

      const workingDir = ["~", "/"].includes(directory[0])
        ? directory
        : join(CWD, directory);

      const runner = new Runner(stackFile, workingDir, { overwrite });
      runner.start();
    } catch {
      this.exit(1);
    }

    this.exit(0);
  }
}
