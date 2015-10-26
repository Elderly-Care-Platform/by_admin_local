'use strict';
adminControllers.controller('HousingListController', [ '$scope', '$routeParams', '$location', '$http', function($scope, $routeParams, $location, $http) {
	
	$scope.lists = [];
	
	if (localStorage.getItem("ADMIN_USER_ROLE") !== 'SUPER_USER' && localStorage.getItem("ADMIN_USER_ROLE") !== 'EDITOR') {
		$location.path('/users/login');
		return;
	}
	
	$http.get('/byadmin/api/v1/housing/list/all'
	).success(function (data) {
    	$scope.lists=data.data.content;
    }).error(function (data, status, headers, config) {    
    	alert(status);
    });

} ]);



