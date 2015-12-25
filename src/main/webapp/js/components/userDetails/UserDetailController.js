adminControllers
		.controller(
				'UserDetailController',
				[
						'$scope',
						'$routeParams',
						'$location',
						function($scope, $routeParams, $location) {
							if (localStorage.getItem("ADMIN_USER_ROLE") != 'SUPER_USER') {
								return;
							}
							$scope.status = 0;
							$scope.userId = $routeParams.userId;
							if ($scope.userId == undefined
									|| $scope.userId == null
									|| $scope.userId == "undefined"
									|| $scope.userId == "null") {
								$scope.status = 1;
							}
						} ]);