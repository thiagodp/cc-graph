[![npm version](https://badge.fury.io/js/cc-graph.svg)](https://badge.fury.io/js/cc-graph)

# cc-graph
> Graph visualization for Concordia feature files

CLI application that generates an HTML page with an interactive graph that shows  your `.feature` files' relationships.

## Installation

```bash
npm i -D cc-graph
```

## Syntax

```
cc-graph <features-dir> [output-dir]
```
where:
 - `<features-dir>` is the directory of your `.feature` files.
 - `[output-dir]` is the output directory. Optional, by default it assumes `cc-graph-output`.

Example:

```bash
npx cc-graph features
```

## See also

- [Concordia](https://concordialang.org)

## License

[LGPL3](LICENSE) © [Thiago Delgado Pinto](https://github.com/thiagodp)
