# Angular Class List Extractor

> Determine what CSS classes an Angular Template or Component uses

## Purpose

The tl;dr is this package was written for compatibility with [TailwindCSS](https://tailwindcss.com), specifically [purging unused styles](https://tailwindcss.com/docs/controlling-file-size)

This package has 0 additional dependencies aside from Angular's dependencies - There are 2 peer dependencies, `Typescript` and `@angular/compiler` which are used to create an [<abbr title="Abstract Syntax Tree">AST</abbr>](https://en.wikipedia.org/wiki/Abstract_syntax_tree) of the component / template. Both peer dependencies are required to compile Angular.

## Usage

```js
// Example file: tailwind.config.js - compatible w/ Tailwind 1.x
const {extractClassesFromTemplate, extractClassesFromComponent} = require('ng-class-list-extractor');

module.exports = {
	purge: {
		// This is a liberal glob - it might include tests or modules.
		// You can probably get away with limiting ts files to `**/*.component.ts`
		content: ['./relative/path/to/app/**/*.html', './relative/path/to/app/**/*.ts'],
		options: {
			extractors: [{
				// Returns a list of classes used in a html template
				extractor: extractClassesFromTemplate,
				extensions: ['html']
			}, {
				// Returns a list of classes used in an inline component template
				extractor: extractClassesFromComponent,
				extensions: ['ts']
			}]
		}
	},
	theme: {
		extend: {},
	},
	variants: {},
	plugins: [],
};
```