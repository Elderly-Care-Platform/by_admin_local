adminControllers.controller('UserProfileController', [ '$scope',
		'$routeParams', '$location','$http',
		function($scope, $routeParams, $location,$http) {
			$scope.error = false;
			var userId = $routeParams.userId;
			$scope.profile = {};
			$scope.profile.userId = userId;
			$http.get("api/v1/userProfile/"+userId).success(
					function(response) {
						if(response != null && response !== ""){
							$scope.profile = response;
						}else{
							$scope.error = true;
							$scope.errorMessage = "No user profile found for the selected user";
						}
					}, function(err) {
						alert("error fetching profile");
					});
			
			$scope.editUserProfile = function(){
				$scope.profile.status = $scope.profile.status === true ? 1:0;
				$scope.profile.featured = ($scope.profile.featured === true || $scope.profile.featured === 1) ? true:false;
				$http.put("api/v1/userProfile/"+userId,$scope.profile).success(function(res){
					toastr.success('User profile submitted successfully');
					$location.path('/userProfile');
				}).error(function(){
					$scope.error = true;
					$scope.errorMessage = "Error occured in saving the current user profile.";
				})
			}
		} ]);