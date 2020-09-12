const extractClassesFromTemplate = require('./template-parser/extract-class-names');
const extractTemplatesFromComponent = require('./template-locater/find-templates');

module.exports = {
	extractClassesFromTemplate,
	extractTemplatesFromComponent,
	extractClassesFromComponent: component => extractTemplatesFromComponent(component)
		.map(template => extractClassesFromTemplate(template))
		.flat()
};
