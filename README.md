[![npm version](https://badge.fury.io/js/cc-graph.svg)](https://badge.fury.io/js/cc-graph)

# cc-graph
> Graph visualization for [Concordia](https://concordialang.org) feature files

CLI application that generates an HTML page with an interactive graph that shows  your `.feature` files' relationships.

## Installation

```bash
npm i -D cc-graph
```

## Syntax

```
cc-graph <features-dir> [output-dir] [--keep]
```
where:
 - `<features-dir>` is the directory of your `.feature` files.
 - `[output-dir]` is the output directory. Optional, by default it assumes `cc-graph-output`.
 - `--keep` is an optional flag that avoids overwriting some files: `index.html`, `style.css`, and `index.js`. Useful when you wish to customize their content.

Examples:

```bash
npx cc-graph features
```

```bash
npx cc-graph features output/graph --keep
```

## See also

- [Concordia](https://concordialang.org)

## License

[L-GPL3](LICENSE) © [Thiago Delgado Pinto](https://github.com/thiagodp)
