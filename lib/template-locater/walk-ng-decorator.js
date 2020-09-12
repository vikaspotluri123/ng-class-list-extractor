// @ts-check
const {isClassDeclaration, isIdentifier} = require('typescript');

/**
 * @typedef {import('typescript').Node} Node
 * @typedef {import('typescript').Decorator} Decorator
 */

/**
 * @param {string} decoratorName
 * @param {Node} parent
 * @param {(node: Node, classNode: import('typescript').ClassDeclaration, decoratorCount: number) => any} callback
 */
module.exports = (decoratorName, parent, callback) => parent.forEachChild(child => {
	if (isClassDeclaration(child)) {
		if (!child.decorators) {
			return;
		}

		for (const decorator of child.decorators) {
			let doesDecoratorMatch = false;
			let currentDecorator = 0;
			decorator.expression.forEachChild(node => {
				if (doesDecoratorMatch) {
					callback(node, child, currentDecorator);
				} else {
					// eslint-disable-next-line no-lonely-if
					if (isIdentifier(node) && node.text === decoratorName) {
						doesDecoratorMatch = true;
						currentDecorator++;
					}
				}
			});
		}
	}
});
