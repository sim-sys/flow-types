# flow-types
## CLI to manage flow types

To create package with type declarations:

  - create normal npm package;
  - create `flow` folder in your package's root;
  - put files with type declarations inside of `flow` folder;
  - install `flow-types` as a dependency;
  - add `flow-types install` to install script in your `package.json`;
  - publish your package as usual.

To consume package with type declarations:

 - install it with npm as usual;
 - add `node_modules/.flow/` line to `[libs]` section of your
  `.flowconfig`.

## License

MIT
