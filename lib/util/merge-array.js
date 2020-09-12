// @ts-check
/**
 * @template T
 * @param {T} destination
 * @param {T} source
 * @returns {T}
 */
module.exports = function mergeArray(destination, source) {
	destination.push(...source);
	return destination;
};
