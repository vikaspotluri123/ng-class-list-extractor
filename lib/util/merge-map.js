/**
 * Merges data from {rightMap} into {leftMap}, using {mergerFunction to resolve disputes}
 *
 * @template T
 * @param {Map<T>} leftMap
 * @param {Map<T>} rightMap
 * @param {(left: T, right: T) => T} mergerFunction
 * @returns {void}
 */
module.exports = function mergeMap(leftMap, rightMap, mergerFunction) {
	for (const [key, rightValue] of rightMap.entries()) {
		if (leftMap.has(key)) {
			const leftValue = leftMap.get(key);
			const mergedValue = mergerFunction(leftValue, rightValue);
			if (mergedValue === leftValue || mergedValue === undefined) {
				continue;
			}

			leftMap.set(key, mergedValue);
		} else {
			leftMap.set(key, rightValue);
		}
	}
};
