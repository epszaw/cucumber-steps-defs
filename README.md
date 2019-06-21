# Cucumber steps defs

> Convert cucumber features to steps definition with pleasure

## Installation

Install it globally for CLI-like usage:

```shell
npm i -g cucumber-steps-defs
```

Or locally for access to API from your code:

```shell
npm i --save-dev cucumber-steps-defs
```

## Usage

### Binary usage

After installation you can immediatly start transforming feature files:

```shell
cucumber-steps-defs -f path/to/feature -o output/path
```

CLI options:

| Option          | Default value | Desription                              |
| --------------- | ------------- | --------------------------------------- |
| `-f, --feature` | `undefined`   | Path to cucumber feature file\*         |
| `-o, --output`  | `.`           | Path to generated steps definition file |
| `-h, --help`    |               | Prints usage information                |

\* – means required option

### Usage from code

If you want to use generator in your code, you can use API directly:

```js
const { convert } = require('cucumber-steps-defs')

convert('features/foo.feature', 'output/path')
  .then(() => { ... })
  .catch(err => { ... })
```
