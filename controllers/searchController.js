dataSearchApp.controller('searchController', function ($scope) {
	$scope.phones = [
		{'name': 'Nexus S',
			'snippet': 'Fast just got faster with Nexus S.'},
		{'name': 'Motorola XOOM™ with Wi-Fi',
			'snippet': 'The Next, Next Generation tablet.'},
		{'name': 'MOTOROLA XOOM™',
			'snippet': 'The Next, Next Generation tablet.'}
	];

	$scope.submitSearch = function($event) {
		console.log(this.keyword);

		$http({method: 'GET', url: '/someUrl'}).
			success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
			}).
			error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
			});
		
		$event.preventDefault();
	};
});