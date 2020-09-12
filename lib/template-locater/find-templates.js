// @ts-check
const {
	createSourceFile,
	isObjectLiteralExpression,
	isIdentifier,
	isPropertyAssignment,
	isStringLiteral,
	ScriptTarget
} = require('typescript');
const walkDecorator = require('./walk-ng-decorator');

/**
 * @typedef {import('typescript').Node} Node
 * @typedef {import('typescript').SourceFile} SourceFile
 * @typedef {import('typescript').Decorator} Decorator
 */

/**
 * @param {string} component
 * @returns {string[]}
 */
module.exports = function extractTemplatesFromComponent(component) {
	const source = createSourceFile('purgecss://file.ts', component, ScriptTarget.Latest);
	const components = [];

	walkDecorator('Component', source, node => {
		// ObjectLiteralExpression === Object Key
		if (isObjectLiteralExpression(node)) {
			for (const property of node.properties) {
				// Use type coersion to guarantee we're on the proper node
				if (
					isPropertyAssignment(property) &&
					isIdentifier(property.name) &&
					isStringLiteral(property.initializer) &&
					property.name.text === 'template'
				) {
					components.push(property.initializer.text);
				}
			}
		}
	});

	return components;
};
