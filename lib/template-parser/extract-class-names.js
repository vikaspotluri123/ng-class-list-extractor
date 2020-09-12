// @ts-check
const {getHtmlFile} = require('../ast-cache');
const ClassListExtractor = require('./ast-walker');

const walker = new ClassListExtractor();

/**
 * @typedef {import('@angular/compiler').ParseError} ParseError
 * @typedef {import('@angular/compiler').ParseTreeResult} ParseTreeResult
 */

/**
 * @param {ParseTreeResult} ast
 * @param {Set<String>} context - class names to add to
 * @returns {ParseError[]}
 */
function extractClassNamesFromTemplate(ast, context) {
	for (const node of ast.rootNodes) {
		node.visit(walker, context);
	}

	return ast.errors;
}

/**
 * @param {string} file
 * @param {Set<String>} context
 * @returns {Promise<ParseError[]>}
 */
module.exports = async function extractClassNamesFromFile(file, context) {
	try {
		const template = await getHtmlFile(file);
		return extractClassNamesFromTemplate(template, context);
	} catch (error) {
		console.log(error);
	}
};
