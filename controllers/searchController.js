dataSearchApp.controller('searchController', ['$scope', '$http', function ($scope, $http) {
	$scope.searchResults = [];
	$scope.searchResultCount = 0;
	$scope.searchResultCategoryCounts = [];
	$scope.titleSearchOnly = true;

	$scope.submitSearch = function($event) {
		if(this.keyword.length) {
			$scope.searchState = 'Loading...';
			$scope.searchResults = [];
			$scope.searchResultCategoryCounts = [];	// clear category counts before search

			$http.jsonp('http://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=' + (($scope.titleSearchOnly) ? 'intitle:' : '') + encodeURIComponent(this.keyword) + '&format=json&srlimit=50&callback=JSON_CALLBACK').
				success(function(data, status, headers, config) {
					if(data.query !== undefined) {
						$scope.searchResultCount = data.query.searchinfo.totalhits;
						$scope.searchResults = data.query.search;

						// loop through to create wiki page links based on titles
						for (var i = $scope.searchResults.length - 1; i >= 0; i--) {
							$scope.searchResults[i].wikiUrl = 'http://en.wikipedia.org/wiki/' + encodeURIComponent($scope.searchResults[i].title);
						}

						$scope.searchState = '';
					}
					// error handling for bad response
					else {
						$scope.searchResultCount = 0;
						$scope.searchState = 'Bad response';
						$scope.searchResults = [];
					}
				}).
				error(function(data, status, headers, config) {
					console.log('problem calling Wikipedia API');
				}
			);
		}

		if($event != null)
			$event.preventDefault();
	};

	$scope.$watch('titleSearchOnly', function (newValue, oldvValue) {
		if(oldvValue == newValue) {
			return;
		}
		else {
			console.log('chnaged' + newValue + ' ' + oldvValue);
			$scope.submitSearch(null);
		}
	});

	// listen to change in search results and get wikipedia pages for new items
	$scope.$watch('searchResults', function (newValue, oldvValue) {
		// because watch fires upon init, need to make sure the trigger is legit for change in value
		if(oldvValue.length == newValue.length) {
			return;
		}
		else {
			$scope.searchResults.forEach(function(item) {
				$http.jsonp('http://en.wikipedia.org/w/api.php?action=query&titles=' + encodeURIComponent(item.title) + '&prop=categories&format=json&callback=JSON_CALLBACK').
					success(function(data, status, headers, config) {
						var pageId = Object.keys(data.query.pages)[0];

						//console.log(data.query.pages[pageId].categories);
						if(data.query.pages[pageId].categories !== undefined) {
							item.categories = data.query.pages[pageId].categories;

							for (var i = item.categories.length - 1; i >= 0; i--) {
								item.categories[i].title = item.categories[i].title.replace('Category:','');

								var found = false;
								$scope.searchResultCategoryCounts.forEach(function(setCategory) {
									if(setCategory.title == item.categories[i].title) {
										setCategory.count++;
										found = true;
										return;
									}
								});

								if(!found) {
									//console.log('first time: ' + item.categories[i].title);
									var category = new Object();
									category.title = item.categories[i].title;
									category.count = 1;
									$scope.searchResultCategoryCounts.push(category);
								 }
							}
						}
					}).
					error(function(data, status, headers, config) {
						console.log('problem calling Wikipedia API (page resolution)');
					}
				);
			});
		}
	}, true);
}]);