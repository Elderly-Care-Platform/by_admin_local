adminControllers.controller('TagListController', [
		'$scope',
		'$routeParams',
		'$location',
		'AdminUser',
		function($scope, $routeParams, $location, AdminUser) {
			if (localStorage.getItem("ADMIN_USER_ROLE") == 'WRITER'
					|| localStorage.getItem("ADMIN_USER_ROLE") == 'USER'
					|| localStorage.getItem("ADMIN_USER_ROLE") == ''
					|| localStorage.getItem("ADMIN_USER_ROLE") == 'EDITOR') {
				return;
			}

		} ]);