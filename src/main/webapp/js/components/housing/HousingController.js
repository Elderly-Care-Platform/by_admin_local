adminControllers.controller('HousingController', [ '$scope',
		'$routeParams', '$location','$http',
		function($scope, $routeParams, $location,$http) {
			$scope.error = false;
			var housingId = $routeParams.housingId;
			$scope.housing = {};
			$scope.housing.id = housingId;
			$http.get("api/v1/housing/"+housingId).success(
					function(response) {
						if(response != null && response !== ""){
							$scope.housing = response.data;
						}else{
							$scope.error = true;
							$scope.errorMessage = "No user profile found for the selected user";
						}
					}, function(errorResponse) {
						if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002){
							$location.path('/users/login');
							 return;
				        }
						alert("error fetching profile");
					});
			
			$scope.editUserProfile = function(){
				$scope.housing.status = $scope.housing.status === true ? 1:0;
				$scope.housing.featured = ($scope.housing.featured === true || $scope.housing.featured === 1) ? true:false;
				$http.put("api/v1/housing/"+housingId,$scope.housing).success(function(res){
					toastr.success('Housing submitted successfully');
					$location.path('/housings');
				}).error(function(errorResponse){
					if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002){
						$location.path('/users/login');
						 return;
			        }
					$scope.error = true;
					$scope.errorMessage = "Error occured in saving the current housing facility.";
				})
			}
		} ]);