<h1 align="center">
  <br>
  <a href="http://www.amitmerchant.com/electron-markdownify"><img src="./docs/images/stack-logo.svg" alt="stack" height="230"></a>
</h1>

<h3 align="center">A CLI to bootstrap dev environments lightning fast ⚡</h3><br/>

<!-- <p align="center">
  <a href="https://badge.fury.io/js/electron-markdownify">
    <img src="https://badge.fury.io/js/electron-markdownify.svg"
         alt="Gitter">
  </a>
  <a href="https://gitter.im/amitmerchant1990/electron-markdownify"><img src="https://badges.gitter.im/amitmerchant1990/electron-markdownify.svg"></a>
  <a href="https://saythanks.io/to/amitmerchant1990">
      <img src="https://img.shields.io/badge/SayThanks.io-%E2%98%BC-1EAEDB.svg">
  </a>
  <a href="https://www.paypal.me/AmitMerchant">
    <img src="https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&amp;style=flat">
  </a>
</p> -->

<p align="center">
  <a href="#features">Features</a> •
  <a href="#usage">How To Use</a> •
  <a href="#why">Why</a> •
  <a href="#documentation">Documentation</a> •
  <a href="#examples">Examples</a> •
  <a href="#license">License</a>
</p>

## Features

Create simple scripts that allow developers to setup projects with minimal effort and without having to refer to the documentation multiple times.

- **Simplicity & Usability** - These are the two most important aspects that stack follows to provide developers a better project bootstrap experience
- **Cross Platform Support** - The issue with bash scripts is that they _might_ work on all the common architectures. `stack` provides the promise that it works everywhere
- **Minimal Time to Contribute** - The less time that a developer has to spend setting up a dev environment, the more they can spend on _actually contributing_

<center>
⚠️ This project is still very much a work in progress, expect things to break and change often until 1.0 ⚠️
</center>

## What it is

Clone, download dependencies, setup environments, and more all in basically one command.

Define bootstrap steps for your project to make setup as simple as possible.

## Usage

### Install

via npm

```bash
npm i -g @ajhenry/stack
```

### Commands

```bash
stack repo <repo name> <directory> [-d|--debug] [-s|--start]
```

```bash
stack file <.stack file path> <directory> [-d|--debug] [-s|--start]
```

### Example Usage

This command will bootstrap this project to a folder in your home directory under `stack/`

```bash
npx stack repo AJHenry/stack ~/stack
```

## Why

After contributing to the JS open source community for awhile, I realized how often I had to look up exactly what package manager they were using (npm vs yarn), what other git submodules I needed, what the start command was (start vs dev vs build) for a _simple change in the code_. Not to mention how hard it can be to setup large monorepo projects like [react](https://github.com/facebook/react) and [vue](https://github.com/vuejs/vue) since they rely on many scripts to get things up and running.

My solution to this is basically an elegant bash script that can start dev environments _dumb_ fast.

### What about Docker?

Docker can do all this no problem, however I believe there are times where I'd like deeper control over my repo and dev tools rather than having everything abstracted by Docker.

### What about bash scripts?

Bash scripts can also do all this work with some cavets, like leaving the developer to clone the repo, maybe even the submodules too. Then you will need to write the bash script for Windows too.

In fact, I still recommend having bash scripts that bootstrap a lot of the work in the repo. That way they can just be called by stack.

## How it works

A `.stack` is a configuration and build file for a project. stack comes with a CLI that takes this configuration file and uses it to get a dev environment for the project up and running on your machine.

_It can be thought of as a glorified init script._

## Documentation

### Stack Lifecycle

These are the methods and when they are executed

> Note that if a step exits with a non 0 command and not listed as an exception, the command will fail and clean up the directory

- `dependency check` - First the scripts checks to make sure the system has the required tools
- `install` - **Required** - Steps for installing the program, the entry point
- `postinstall` - _optional_ - Steps that are run after `install`
- `start` - _optional_ - Steps for starting the development server
  - Can be ignored when `--start` flag is passed `false`

## Examples

Here are some examples of .stack files to help you get started

### Example `.stack` file

Here is an example of a stack file that creates a tailwind next starter + server.

```yaml
name: Tailwind Next Starter
version: 0.1

requires:
  - npm
  - git

start:
  - npm run dev

install:
  - git clone https://github.com/jpedroschmitz/typescript-nextjs-starter.git .
  - npm i
  - npm i tailwindcss@latest postcss@latest autoprefixer@latest
  - npx tailwindcss init -p
```

## License

MIT
