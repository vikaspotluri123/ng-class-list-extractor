// @ts-check
const {resolve, dirname} = require('path');
const {isObjectLiteralExpression, isIdentifier, isPropertyAssignment, isStringLiteral} = require('typescript');
const {getTypeScriptFile} = require('../ast-cache');
const walkDecorator = require('./walk-ng-decorator');
const {makeInline} = require('./inline-template');

/**
 * @param {string} file
 * @returns {string}
 */
const forceExtension = file => file.endsWith('.ts') ? file : `${file}.ts`;

/**
 * @typedef {import('typescript').Node} Node
 * @typedef {import('typescript').SourceFile} SourceFile
 * @typedef {import('typescript').Decorator} Decorator
 */

/**
 * @param {string} componentPath
 * @returns {Promise<Set<string>>}
 */
async function extractTemplatesFromComponent(componentPath) {
	const source = await getTypeScriptFile(componentPath);
	const components = new Set();

	walkDecorator('Component', source, node => {
		// ObjectLiteralExpression === Object Key
		if (isObjectLiteralExpression(node)) {
			for (const property of node.properties) {
				// Use type coersion to guarantee we're on the proper node
				if (isPropertyAssignment(property) && isIdentifier(property.name) && isStringLiteral(property.initializer)) {
					const {name: {text: type}, initializer: {text: context}} = property;
					if (type === 'template') {
						components.add(makeInline(context, componentPath));
					} else if (type === 'templateUrl') {
						components.add(resolve(dirname(componentPath), context));
					}
				}
			}
		}
	});

	return components;
}

/**
 * @param {Iterable<string>} components
 * @returns {Promise<Set<string>[]>}
 */
module.exports = async function getFileList(components) {
	const componentList = [];
	for (const module of components) {
		componentList.push(extractTemplatesFromComponent(forceExtension(module)));
	}

	return Promise.all(componentList);
};
