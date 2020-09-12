// @ts-check
const {resolve, dirname} = require('path');
const {
	isIdentifier,
	isObjectLiteralExpression,
	isPropertyAssignment,
	isArrayLiteralExpression,
	isImportDeclaration,
	isStringLiteral,
	isNamedImports
} = require('typescript');
const {getTypeScriptFile} = require('../ast-cache');
const mergeMap = require('../util/merge-map');
const mergeArray = require('../util/merge-array');
const walkDecorator = require('./walk-ng-decorator');

/**
 * @typedef {import('typescript').Node} Node
 * @typedef {import('typescript').SourceFile} SourceFile
 * @typedef {import('typescript').Decorator} Decorator
 * @typedef {object} DeclarationContext
 * @property {string} DeclarationContext.moduleName
 * @property {string} DeclarationContext.modulePath
 */

/**
 * @param {Node} parent
 * @param {{[variable: string]: string}} [variableMap]
 * @returns {{[variable: string]: string}}
 */
const buildImportTree = (parent, variableMap = {}) => {
	parent.forEachChild(child => {
		if (isImportDeclaration(child) && isStringLiteral(child.moduleSpecifier)) {
			const source = child.moduleSpecifier.text;
			child.importClause.forEachChild(node => {
				if (isNamedImports(node)) {
					for (const element of node.elements) {
						variableMap[element.name.text] = source;
					}
				}
			});
		}
	});

	return variableMap;
};

/**
 * @param {Node} node
 * @param {{[variable: string]: string}} importMap
 * @param {Map<string, DeclarationContext[]>} existingComponents
 * @param {DeclarationContext} context
 */
function addDeclaredComponents(node, importMap, existingComponents, context) {
	if (isPropertyAssignment(node) && isArrayLiteralExpression(node.initializer)) {
		for (const element of node.initializer.elements) {
			if (isIdentifier(element)) {
				existingComponents.set(resolve(dirname(context.modulePath), importMap[element.text]), [context]);
			}
		}
	}
}

/**
 * @param {string} modulePath
 * @returns {Promise<Map<string, DeclarationContext>>}
 */
async function extractComponentsFromModule(modulePath) {
	const source = await getTypeScriptFile(modulePath);
	const importMap = buildImportTree(source);
	// Declared Components should be unique in a module
	const componentsInModule = [];

	walkDecorator('NgModule', source, (node, classNode) => {
		const components = new Map();
		const moduleName = classNode.name.text;
		// ObjectLiteralExpression === Object Key
		if (isObjectLiteralExpression(node)) {
			for (const property of node.properties) {
				if (isIdentifier(property.name) && property.name.text === 'declarations') {
					const context = {
						modulePath,
						moduleName
					};
					addDeclaredComponents(property, importMap, components, context);
				}
			}
		}

		if (components.size > 0) {
			componentsInModule.push(components);
		}
	});

	const moduleList = componentsInModule.shift();
	for (const componentList of componentsInModule) {
		mergeMap(moduleList, componentList, mergeArray);
	}

	return moduleList;
}

/**
 * @param {string[]} modules
 * @returns {Promise<Map<String, DeclarationContext>>}
 */
module.exports = async function getFileList(modules) {
	const components = await Promise.all(modules.map(module => extractComponentsFromModule(module)));
	const result = components.shift();
	for (const component of components) {
		mergeMap(result, component, mergeArray);
	}

	return result;
};
