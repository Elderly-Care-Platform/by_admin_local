adminControllers.controller('BasicUserInfoController', [
		'$scope',
		'$routeParams',
		'$location',
		'UserDetailInfo', 'UserTag',
		function($scope, $routeParams, $location,UserDetailInfo, UserTag) {
			if (localStorage.getItem("ADMIN_USER_ROLE") != 'SUPER_USER') {
				return;
			}
			$scope.userId = $scope.$parent.userId;
			$scope.userData = null;
			$scope.viewDisplayStatus = false;
			$scope.toggleDisplay = function(){
				$scope.viewDisplayStatus = !$scope.viewDisplayStatus;
				if($scope.viewDisplayStatus){
					showBasicUserInfo();
				}
			}
			
			$scope.state = "loading";

			UserTag.get(function(res) {
				$scope.existingTags = res.data;
			}, function(errorResponse) {
				if (errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002) {
					$location.path('/users/login');
					return;
				}
				alert("error fetching tags");
			});
			
			function showBasicUserInfo(){
				if(!$scope.userData){
					UserDetailInfo.getBasicInfo.get({"userId":$scope.userId},function(res){
						$scope.state = "loaded";
						$scope.userData = res;
						$scope.showTags = [];
						Object.keys($scope.userData.userTags).forEach(function(key){
				       	if($scope.userData.userTags[key]){
				       		for ( var i = 0; i < $scope.existingTags.length; i++){
				       			if($scope.userData.userTags[key] == $scope.existingTags[i].id){
				       				$scope.showTags.push($scope.existingTags[i]);
				       			}
				       		}
				       		
				       	}
						});
						
					},function(err){
						$scope.state = "error";
					});
				}
			}
			
			$scope.regTypes = {
					"0" : "EMAIL",
					"1" : "PHONE NUMBER"
				}
		} ]);