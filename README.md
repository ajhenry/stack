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
  <a href="#key-features">Packages</a> •
  <a href="#usage">How To Use</a> •
  <a href="#credits">Why</a> •
  <a href="#related">Related</a> •
  <a href="#license">License</a>
</p>

## Usage

### Install

### Command 

```bash
stack [repo name] [directory] [-d|--debug] [-s|--start]
```

### Example Usage

```bash
npx stack start AJHenry/stack ~/stack
```

## Why

I believe there are times where I'd like control over my repo and dev tools rather than having everything handled by Docker.

This handles the work of cloning a repo and installing dev tools as well as starting the dev environment.

After contributing to the JS open source community for a bit, I realized how often I had to look up exactly what package manager they were using (npm vs yarn), what other git submodules I needed, what the start command was (start vs dev vs build).

My solution to this is basically an elegant bash script that can start dev environments dumb fast
## What it is

Clone, download dependencies, setup environments, and more all in one command.

Define bootstrap steps for your project to make setup as simple as possible.

## How it works

A `.stack` is a configuration and build file for a project. stack comes with a CLI that takes this configuration file and uses it to get a dev environment for the project up and running on your machine.

_It can be thought of as a glorified bash init script._

## Example `.stack` file

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

## Stack Lifecycle

These are the methods and when they are executed

> Note that if a step exits with a non 0 command and not listed as an exception, the command will fail and clean up the directory

- `dependency check` - First the scripts checks to make sure the system has the required tools
- `install` - **Required** - Steps for installing the program, the entry point
- `postinstall` - _optional_ - Steps that are run after `install`
- `start` - _optional_ - Steps for starting the development server
  - Can be ignored when `--start` flag is passed `false`

## License

MIT
