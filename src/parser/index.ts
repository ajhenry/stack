import find from "find-up";
import yaml from "js-yaml";
import shell from "shelljs"
import {withDir} from 'tmp-promise'
import { join } from "path";
import json from "json5";
import fs from "fs-extra";
import { Octokit } from "@octokit/rest";
import logger from '../logger';

export interface CommandStep {
  cmd: string;
}

export interface MessageStep {
  message: string;
}

export type Step = "string" | CommandStep | MessageStep;

export interface Stack {
  requires: string[];
  name: string;
  version: string;
  install: Step[];
  postinstall: Step[];
  start: Step[];
}

export default class Parser {
  private stack?: Stack;

  constructor() {}

  private async find(path?: string): Promise<void> {
    if (path) {
      const contents = await this.read(path);
      this.stack = this.parse(contents);
      return;
    }

    const fileNames = [".stack", ".stack.yaml", ".stack.yml", ".stack.json"];
    const dir = await find(fileNames, { cwd: process.cwd() });

    logger.debug(`Found a file at ${dir}`);

    if (!dir) {
      throw new Error("can't find stack file");
    }

    const contents = await this.read(dir);
    this.stack = this.parse(contents);
  }

  private async read(file: string): Promise<string> {
    const contents = await fs.readFile(file);

    return contents.toString();
  }

  private parse(contents: string): Stack {
    let data: Stack | undefined = undefined;
    logger.debug(contents)
    try {
      data = yaml.load(contents) as Stack;
    } catch (e) {
      logger.debug("failed to parse yaml");
    }

    try {
      data = json.parse(contents) as Stack;
    } catch (e) {
      logger.debug("failed to parse json");
    }

    if (!data) {
      throw new Error("Failed to parse stack file");
    }

    return data;
  }

  async readFile(path?: string): Promise<Stack> {
    await this.find(path);

    return this.stack!;
  }

  async readGitHubRepo(project: string): Promise<any> {
    const [owner, repo] = project.split("/");
    const gh = new Octokit();
    const data = await gh.repos.get({
      owner,
      repo,
    });

    logger.debug(data);
    logger.debug(data.data.default_branch);
  }

  

  async generateGitHubLinks(project: string): Promise<any> {
    const links = project.split("/");
    const githubUrl = `https://raw.githubusercontent.com/${links[0]}/${links[1]}/master/.stack`;
  }

  async readGitHub(project?: string): Promise<Stack> {
    await this.find(project);

    return this.stack!;
  }
}
