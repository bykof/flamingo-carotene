# Module `flamingo-carotene-core`
This is the core module of the flamingo-carotene library. It provides the "flamingo-carotene" command and the logic to
load all the other modules and dispatch commands.

## How to use
Run:
```
npm i -D flamingo-carotene-core
```

And you will be able to use the cli tool of flamingo-carotene.
```
npx flamingo-carotene {command} [option(s)]

    Commands:
        config
        build

    Options:
        -v        verbose output
```

## How to configure
This module exposes the following config
```
{
  paths: {
    carotene: carotenePath,
    project: projectPath,
    src: path.join(projectPath, 'src'),
    dist: path.join(projectPath, 'dist')
  }
}
```
Where `carotenePath` points to this very module in your project and `projectPath` points to the root of your project.

These paths can be changed to your needs via the `config` command and used for other paths that you need inside your
project.

## How it works
The core provides the flamingo-carotene 'binary'. The binary allows you to execute the flamingo-carotene command via
npx.

In general the binary does a couple of things.
1. It gathers all flamingo-carotene modules used in your project.
2. It executes commands to which all the previously registered flamingo-carotene modules can apply handlers to.

### Gathering flamingo-carotene modules
To gather the modules, the binary runs trough your dependencies to find the flamingo-carotene ones and registers all
modules that have a `caroteneModule.js`. Additional to that, you can place a `carotene-module.js` file in your project
root to apply project logic, just like in any other module you are using.

### Execute Commands
When executing commands, the binary gathers all handlers from the registered modules, get those for the specified
command, bring them into order and dispatch them.

The name of a command could be any string. As long as there is a handler that is configured to be executed by it, the
command can be dispatched.

For example there is a `build` command with the purpose of building client ready artifacts from your sources and
dependencies.
Therefore every module and your project itself can apply one or more handlers to this command. In these handlers you can
do whatever you like - in that case probably to write files to a dist folder.

And there is the `config` command. The config command is a command like any other. You can apply handlers to it and you
can execute it via the binary. The purpose of this command is to create a configuration object that can be used in any
other command. Every command other than the config command will trigger the config command before itself, so that the
command that is executed will always get the actual config available.

When a handler is executed it gets a core object provided as argument. The core object provides the following:
- `config` The config object that can be edited through the config command
- `cliTools` Some basic tooling for the ease of use of the terminal, such as logging
- `dispatcher` The dispatcher gives the possibility to dispatch a command. It executes every handler in the configured
order
- `modules` A collection of the actual used flamingo-carotene modules

## Config
Every module can expose the config that it uses to e.g. build its artifacts, so that it can be edited by other modules,
or your project.
For example there is a path config provided by default with some defaults for e.g. the source and dist folder. If your
project structure does not match these paths you can register a handler to the config command to override these configs
to your needs.

```
{
    command: 'config',
    handler: function (core) {
        const config = core.getConfig()
        config.paths.dist = path.join(config.paths.project, 'build')
    }
}
```