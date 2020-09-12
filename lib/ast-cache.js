// @ts-check
const fs = require('fs').promises;
const {resolve} = require('path');
const {HtmlParser} = require('@angular/compiler');
const {createSourceFile, ScriptTarget} = require('typescript');
const inlineTemplate = require('./template-locater/inline-template');

const angularParser = new HtmlParser();

const cache = {
	ts: {},
	html: {}
};

module.exports = {
	/**
	 * @param {string} filename
	 * @param {boolean} [addToCache]
	 * @returns {Promise<import('typescript').SourceFile>}
	 */
	async getTypeScriptFile(filename, addToCache = true) {
		const fullFileName = resolve(filename);
		const myCache = cache.ts;
		if (!(fullFileName in myCache)) {
			const contents = await fs.readFile(fullFileName, 'utf-8');
			const source = createSourceFile(filename, contents, ScriptTarget.Latest);

			if (addToCache) {
				myCache[fullFileName] = source;
			} else {
				return source;
			}
		}

		return myCache[fullFileName];
	},

	/**
	 * @param {string} fileName
	 */
	removeTypeScriptFile(fileName) {
		delete cache.ts[resolve(fileName)];
	},

	/**
	 * @param {string} fileName
	 * * @param {boolean} [addToCache]
	 * @returns {Promise<import('@angular/compiler').ParseTreeResult>}
	 */
	async getHtmlFile(fileName, addToCache = true) {
		// Inline templates are usually pretty short, so don't cache them because
		// storing them could get complex
		if (inlineTemplate.isInline(fileName)) {
			const {source, template} = inlineTemplate.read(fileName);
			return angularParser.parse(template, source);
		}

		const fullFileName = resolve(fileName);
		const myCache = cache.html;
		if (!(fullFileName in myCache)) {
			const contents = await fs.readFile(fullFileName, 'utf-8');
			const source = angularParser.parse(contents, fileName);

			if (addToCache) {
				myCache[fullFileName] = source;
			} else {
				return source;
			}
		}

		return myCache[fullFileName];
	},

	/**
	 * @param {string} fileName
	 */
	removeHtmlFile(fileName) {
		delete cache.html[resolve(fileName)];
	}
};
