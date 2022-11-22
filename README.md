# TypeScript Embedded CSS Plugin

A TypeScript Language Service plugin for embedded CSS template strings.

## Features

- [x] CSS Autocomplete

## TODO

- [ ] Configurable template string tags, eg "styles"

## Developing

```sh
# Install this package's dependencies, and begin compiler in watch mode
npm i
npm run watch

# In a separate terminal, change into the example project, and install example dependencies
cd example
npm i

# Open VSCode in the example project
code .
```

In the opened editor instance ensure that the workspace version of TypeScript is being
used (not the VSCode bundled version). Click the `{}` icon in the editor status bar to
selected the TypeScript version to use.

1. Compile with `npm run watch`

## Attribution

This package is only possible thanks to the following packages:

- [TypeScript Styled Plugin](https://github.com/microsoft/typescript-styled-plugin)
- [TypeScript TSServer Plugin Template](https://github.com/orta/TypeScript-TSServer-Plugin-Template)

## Reference

- [Writing a Language Service Plugin](https://github.com/microsoft/TypeScript/wiki/Writing-a-Language-Service-Plugin#overview-writing-a-simple-plugin)
