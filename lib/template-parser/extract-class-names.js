// @ts-check
const {HtmlParser} = require('@angular/compiler');
const ClassListExtractor = require('./ast-walker');

const parser = new HtmlParser();
const walker = new ClassListExtractor();

/**
 * @typedef {import('@angular/compiler').ParseError} ParseError
 * @typedef {import('@angular/compiler').ParseTreeResult} ParseTreeResult
 */

/**
 * @param {string} content
 * @returns {string[]}
 */
module.exports = function extractClassNamesFromTemplate(content) {
	const ast = parser.parse(content, 'purgecss://null');
	const context = new Set();
	for (const node of ast.rootNodes) {
		node.visit(walker, context);
	}

	return Array.from(context);
};
