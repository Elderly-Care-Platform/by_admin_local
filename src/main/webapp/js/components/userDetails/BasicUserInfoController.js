adminControllers.controller('BasicUserInfoController', [
		'$scope',
		'$routeParams',
		'$location',
		'UserDetailInfo',
		function($scope, $routeParams, $location,UserDetailInfo) {
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
			
			function showBasicUserInfo(){
				if(!$scope.userData){
					UserDetailInfo.getBasicInfo.get({"userId":$scope.userId},function(res){
						$scope.state = "loaded";
						$scope.userData = res;
					},function(err){
						$scope.state = "error";
					});
				}
			}
		} ]);