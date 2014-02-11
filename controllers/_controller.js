'use strict';

/* Controllers */
var dataSearchApp = angular.module('dataSearchApp', [
	// depedent modules
	'ui.keypress'
]);

/**	replace titles of all categories	*/
dataSearchApp.filter('categoryFilter', function() {
	return function(categories) {
		var filtered = [];

		angular.forEach(categories, function(category) {
			category.title = category.title.replace('Category:','');
			filtered.push(category);
		});

		return filtered;
	};
});