import { Command, flags } from "@oclif/command";
import Parser from "../parser";
import logger from '../logger';
import  Runner  from '../runner';

export default class Create extends Command {
  static description = "describe the command here";

  static flags = {
    help: flags.help({ char: "h" }),
    overwrite: flags.boolean({ char: "o", default: false, description: "Overwrite the specified directory" }),
  };

  static args = [
    { name: "file", description: "File path to read from", optional: false },
    { name: "directory", description: "Directory to install to", optional: false },
  ];

  async run() {
    const { args, flags } = this.parse(Create);
    const { file, directory } = args;
    const {overwrite} = flags;

    const parser = new Parser();
    const stackFile = await parser.readFile(file);
    logger.debug(stackFile)

    console.log(file);
    console.log(directory);

    if(!directory){
      throw new Error("directory is needed")
    }

    const runner = new Runner(stackFile, directory, {overwrite})
  }
}
