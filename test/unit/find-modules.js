const {resolve, relative} = require('path');
const {expect} = require('chai');
const findComponents = require('../../lib/template-locater/find-components');

describe('Unit > Find Modules', function () {
	it('correctly finds and deduplicates components across multiple modules', async function () {
		const componentList = Array.from((
			// Get a list of components
			await findComponents([
				resolve(__dirname, '../fixtures/example-app/single.module.ts'),
				resolve(__dirname, '../fixtures/example-app/double.module.ts')
			])).keys()
		// ... and resolve the path relative to here
		).map(key => relative(__dirname, key));

		const expectedComponents = [
			'../fixtures/example-app/components/first-single.component',
			'../fixtures/example-app/components/second-single.component',
			'../fixtures/example-app/components/first-double-module-first.component',
			'../fixtures/example-app/components/first-double-module-second.component',
			'../fixtures/example-app/components/second-double-module-first.component',
			'../fixtures/example-app/components/second-double-module-second.component',
			'../fixtures/example-app/components/shared.component'
		];

		expect(componentList)
			.to.have.length(expectedComponents.length, 'Flat object contains expected number of components')
			.and.to.have.members(expectedComponents);
	});
});
