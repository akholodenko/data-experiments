dataSearchApp.controller('searchController', ['$scope', '$http', function ($scope, $http) {
	/*
	$scope.phones = [
		{'name': 'Nexus S',
			'snippet': 'Fast just got faster with Nexus S.'},
		{'name': 'Motorola XOOM™ with Wi-Fi',
			'snippet': 'The Next, Next Generation tablet.'},
		{'name': 'MOTOROLA XOOM™',
			'snippet': 'The Next, Next Generation tablet.'}
	];
	*/

	$scope.searchResults = [];
	$scope.searchResultCount = 0;

	$scope.submitSearch = function($event) {
		console.log(this.keyword);

		if(this.keyword.length) {
			$http.jsonp('http://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=intitle:' + encodeURIComponent(this.keyword)+ '&format=json&callback=JSON_CALLBACK').
				success(function(data, status, headers, config) {
					//console.log(data);
					$scope.searchResultCount = data.query.searchinfo.totalhits;
					$scope.searchResults = data.query.search;

					// this callback will be called asynchronously
					// when the response is available
				}).
				error(function(data, status, headers, config) {
					console.log('problem calling Wikipedia API');
					// called asynchronously if an error occurs
					// or server returns response with an error status.
				}
			);
		}


		$event.preventDefault();
	};

	// listen to change in search results and get wikipedia pages for new items
	$scope.$watch('searchResults', function (newVal, oldVal) {
		$scope.searchResults.forEach(function(item) {
			//console.log(item.title);
			$http.jsonp('http://en.wikipedia.org/w/api.php?action=query&titles=' + encodeURIComponent(item.title) + '&prop=categories&format=json&callback=JSON_CALLBACK').
				success(function(data, status, headers, config) {
					var pageId = Object.keys(data.query.pages)[0];
					//console.log(Object.keys(data.query.pages)[0]);

					console.log(data.query.pages[pageId].categories);
					/*
					for(var key in data.query.pages) {
						console.log(data.query.pages[key]);
					}
					*/
/*
					data.query.pages.forEach(function(itemCategories) {
						item.categories=itemCategories.categories;
					});
					*/
					item.categories = data.query.pages[pageId].categories;

					// this callback will be called asynchronously
					// when the response is available
				}).
				error(function(data, status, headers, config) {
					console.log('problem calling Wikipedia API (page resolution)');
					// called asynchronously if an error occurs
					// or server returns response with an error status.
				}
			);
		});
	}, true);
}]);