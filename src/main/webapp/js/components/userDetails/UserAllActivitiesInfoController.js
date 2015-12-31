adminControllers.controller('UserAllActivitiesInfoController', [
		'$scope',
		'$routeParams',
		'$location',
		'UserDetailInfo',
		function($scope, $routeParams, $location,UserDetailInfo) {
			if (localStorage.getItem("ADMIN_USER_ROLE") != 'SUPER_USER') {
				return;
			}
			$scope.userId = $scope.$parent.userId;
			$scope.allActivityData = null;
			$scope.viewDisplayStatus = false;
			$scope.toggleDisplay = function(){
				$scope.viewDisplayStatus = !$scope.viewDisplayStatus;
				if($scope.viewDisplayStatus){
					showAllActivityInfo();
				}
			}
			
			$scope.state = "";
			
			function showAllActivityInfo(){
				if(!$scope.allActivityData){
					$scope.state = "loading";
					$scope.allActivityData = [];
					UserDetailInfo.getAllActivityInfo.query({"userId":$scope.userId},function(res){
						$scope.state = "loaded";
						$scope.allActivityData = res;
					},function(err){
						$scope.state = "error";
					});
				}
			}
			
			$scope.getLinkAction = function(activity){
				var ret = "";
				switch(activity.activityType){
				case 1:
				case 2:
					ret = "/userDetails/"+activity.entityId;
					break;
				case 3:
				case 4:
				case 5:
				case 6:
				case 12:
				case 13:
				case 16:
					ret = "/discuss/"+activity.entityId;
					break;
				case 7:
				case 8:
				case 9:
				case 10:
					var arr = activity.details.match(/.*(reply id = )(.*)\s/);
					if(arr && arr.length >= 3){
						ret = "/comment/"+arr[2];
					}
					break;
				}
				if(ret != ""){
					$location.url(ret);
				}else{
					alert("Sorry, No action specified.");
				}
			}
			
			
			$scope.crudTypes = {
					"0" : "New",
					"1" : "Read",
					"2" : "Edited",
					"3" : "Deleted"
				}

				$scope.actionType = {
					'1' : "User",
					'2' : "User profile",
					'3' : "Post",
					'4' : "Question",
					'5' : "Feedback",
					'6' : "Like on post",
					'7' : "Like on comment",
					'8' : "Like on answer",
					'9' : "Comment",
					'10' : "Answer",
					'11' : "Profile Review",
					'12' : "Share post",
					'13' : "Share question",
					'14' : "Rate housing",
					'15' : "Rate service",
					'16' : "Like on question",
					'17' : "Like on review",
					'18' : "Housing Review",
					'19' : "Housing",
					'20' : "Service"
				};
		} ]);