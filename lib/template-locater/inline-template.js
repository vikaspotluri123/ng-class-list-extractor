// @ts-check
module.exports = {
	/**
	 * Determines if a given string is an inline file
	 * @param {string} candidate
	 * @returns {boolean}
	 */
	isInline(candidate) {
		return candidate.startsWith('__inline__');
	},

	/**
	 * @param {string} template
	 * @param {string} source
	 * @returns {string}
	 */
	makeInline(template, source) {
		return `__inline__<${source}>:${template}`;
	},

	/**
	 * @param {string} file
	 * @returns {{source: string, template: string}}
	 */
	read(file) {
		const {source} = file.match(/__inline__<(?<source>.*)>:/).groups;
		const template = file.replace(`__inline__<${source}>:`, '');
		return {template, source};
	}
};
