adminControllers.controller('UserProfileController', [ '$scope',
		'$routeParams', '$location','$http',
		function($scope, $routeParams, $location,$http) {
			$scope.error = false;
			var userId = $routeParams.userId;
			$scope.profile = {};
			$scope.profile.userId = userId;
			$http.get("api/v1/userProfile/"+userId).success(
					function(response) {
						response = response.data;
						if(response != null && response !== ""){
							$scope.profile = response;
						}else{
							$scope.error = true;
							$scope.errorMessage = "No user profile found for the selected user";
						}
					}, function(errorResponse) {
						if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002){
							$location.path('/users/login');
							 return;
				        }
					});
			
			$scope.editUserProfile = function(){
				$scope.profile.status = $scope.profile.status === true ? 1:0;
				$scope.profile.featured = ($scope.profile.featured === true || $scope.profile.featured === 1) ? true:false;
				$scope.profile.verified = $scope.profile.verified === true ? 1:0;
				$http.put("api/v1/userProfile/"+userId,$scope.profile).success(function(res){
					toastr.success('User profile submitted successfully');
					$location.path('/userProfile');
				}).error(function(errorResponse){
					if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002){
						$location.path('/users/login');
						 return;
			        }
					$scope.error = true;
					$scope.errorMessage = "Error occured in saving the current user profile.";
				})
			}
		} ]);