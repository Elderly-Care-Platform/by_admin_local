adminControllers
	.controller(
		'UserProfileInfoCtrl', [
			'$scope',
			'$routeParams',
			'$location',
			'UserProfile',
			'$rootScope',
			function($scope, $routeParams, $location,
				UserProfile, $rootScope) {
				if (localStorage.getItem("ADMIN_USER_ROLE") != 'SUPER_USER') {
					return;
				}
				$scope.userId = $scope.$parent.userId;
				$scope.profileData = null;

				$scope.state = "loading";
				var init = showUserTypes();

				function showUserTypes() {
					if (!$scope.profileData) {

						UserProfile.get({
							"userId": $scope.userId
						}, function(res) {
							$scope.profile = res.data;
							$scope.state = "loaded";
						}, function(err) {
							$scope.state = "error";
						});
					};
				}
			}
		]);