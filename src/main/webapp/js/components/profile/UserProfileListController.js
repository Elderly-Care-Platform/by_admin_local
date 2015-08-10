adminControllers.controller('UserProfileListController', [
		'$scope',
		'$routeParams',
		'$location',
		'$http',
		function($scope, $routeParams, $location, $http) {
			if (localStorage.getItem("ADMIN_USER_ROLE") !== 'SUPER_USER'
					|| localStorage.getItem("ADMIN_USER_ROLE") !== 'EDITOR') {
				$location.path('/users/login');
				return;
			}
		} ]);