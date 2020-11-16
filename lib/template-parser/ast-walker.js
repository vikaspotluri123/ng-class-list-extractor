/* eslint-disable no-unused-vars */

/**
 * @typedef {import('@angular/compiler').Visitor} Visitor
 * @typedef {import('@angular/compiler').Node} Node
 * @typedef {import('@angular/compiler').Attribute} Attribute
 * @typedef {import('@angular/compiler').Comment} Comment
 * @typedef {import('@angular/compiler').Element} Element
 * @typedef {import('@angular/compiler').Expansion} Expansion
 * @typedef {import('@angular/compiler').ExpansionCase} Extension
 * @typedef {import('@angular/compiler').Text} Text
 */

/**
 * @implements Visitor
 */
module.exports = class ClassListExtractor {
	/**
	 * @param {Node} node
	 * @param {Set<string>} context
	 */
	visit(node, context) {
		return null;
	}

	/**
	 * @param {Attribute} attribute
	 * @param {Set<string>} context
	 */
	visitAttribute(attribute, context) {
		return null;
	}

	/**
	 * @param {Comment} comment
	 * @param {Set<string>} context
	 */
	visitComment(comment, context) {
		return null;
	}

	/**
	 * @param {Element} element
	 * @param {Set<string>} context
	 */
	visitElement(element, context) {
		for (const {name, value} of element.attrs) {
			if (name === 'class') {
				value.split(' ').map(className => context.add(className));
			} else if (name === '[class]') {
				try {
					const {parseJsonText} = require('typescript');
					const jsonResult = parseJsonText('purgecss://[class].json', value);
					for (const className of jsonResult.identifiers.keys()) {
						context.add(className);
					}
				} catch {
					console.log('[error] failed parsing [class] value; you might need to explicitly allow these classes:', value);
				}
			} else if (name.includes('[class.')) {
				context.add(/\[class\.(?<name>.*)]/.exec(name).groups.name);
			}
		}

		if (element.children) {
			for (const child of element.children) {
				child.visit(this, context);
			}
		}
	}

	/**
	 * @param {Expansion} expansion
	 * @param {Set<string>} context
	 */
	visitExpansion(expansion, context) {
		return null;
	}

	/**
	 * @param {Extension} extension
	 * @param {Set<string>} context
	 */
	visitExpansionCase(extension, context) {
		return null;
	}

	/**
	 * @param {Text} text
	 * @param {Set<string>} context
	 */
	visitText(text, context) {
		return null;
	}
};
