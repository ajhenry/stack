import find from "find-up";
import yaml from "js-yaml";
import shell from "shelljs";
import { withDir } from "tmp-promise";
import join from "url-join";
import json from "json5";
import fs from "fs-extra";
import { Octokit } from "@octokit/rest";
import logger from "../logger";
import axios from "axios";
import { npmStart } from "../stacks";

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

export type commonStacks = "npm-start" | "yarn-start";

export default class Parser {
  private stack?: Stack;
  private stackFiles = [".stack", ".stack.yaml", ".stack.yml", ".stack.json"];

  constructor() {}

  private async find(path?: string): Promise<void> {
    if (path) {
      const contents = await this.read(path);
      this.stack = this.parse(contents);
      return;
    }

    const dir = await find(this.stackFiles, { cwd: process.cwd() });

    logger.debug(`Found a file at ${dir}`);

    if (!dir) {
      throw new Error("can't find stack file");
    }

    const contents = await this.read(dir);
    this.stack = this.parse(contents);
  }

  async useCommonStack(
    project: string,
    commonType: commonStacks
  ): Promise<Stack> {
    logger.debug(`Using common stack: ${commonType}`);

    if (commonType === "npm-start") {
      const stackFile = npmStart(project, false);
      return this.parse(stackFile);
    }

    if (commonType === "yarn-start") {
      const stackFile = npmStart(project, true);
      return this.parse(stackFile);
    }

    throw new Error(`Not a supported common stack: ${commonType}`);
  }

  private async read(file: string): Promise<string> {
    const contents = await fs.readFile(file);

    return contents.toString();
  }

  private parse(contents: string): Stack {
    let data: Stack | undefined = undefined;
    logger.debug(contents);
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

  async getDefaultBranch(project: string): Promise<any> {
    const [owner, repo] = project.split("/");
    const gh = new Octokit();
    const data = await gh.repos.get({
      owner,
      repo,
    });

    return data.data.default_branch;
  }

  async generateGitHubLink(
    project: string,
    branch?: string,
    path?: string
  ): Promise<string> {
    const links = project.split("/");
    const githubUrlBase = `https://raw.githubusercontent.com/${links[0]}/${links[1]}/`;

    const githubUrlBranch = join(
      githubUrlBase,
      branch ?? (await this.getDefaultBranch(project))
    );

    for (const file of this.stackFiles) {
      const githubUrlPath = join(githubUrlBranch, path ?? file);

      logger.debug(`Checking ${githubUrlPath}`);

      const data = await this.readGitHubFile(githubUrlPath);

      logger.debug(`data: ${data}`);

      if (data) return data;
    }

    throw new Error("Unable to find a stack file within that project");
  }

  async readGitHubFile(url: string): Promise<string | undefined> {
    const res = await axios
      .get(url)
      .then((data) => {
        return data.data;
      })
      .catch((err) => {
        logger.debug("Threw an error in readGitHubFile");
        logger.debug(`Error code: ${err.response.status}`);
        return undefined;
      });

    return res;
  }

  async readGitHub(
    project: string,
    options?: { branch?: string; path?: string }
  ): Promise<Stack> {
    const data = await this.generateGitHubLink(
      project,
      options?.branch,
      options?.path
    );

    const stackFile = this.parse(data);

    return stackFile;
  }
}
