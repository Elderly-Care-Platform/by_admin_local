adminControllers.controller('RecentUserActivityInfoController', [
		'$scope',
		'$routeParams',
		'$location',
		'UserDetailInfo',
		function($scope, $routeParams, $location,UserDetailInfo) {
			if (localStorage.getItem("ADMIN_USER_ROLE") != 'SUPER_USER') {
				return;
			}
			$scope.userId = $scope.$parent.userId;
			$scope.lastSessionData = null;
			$scope.lastActivityData = null;
			$scope.viewDisplayStatus = false;
			$scope.toggleDisplay = function(){
				$scope.viewDisplayStatus = !$scope.viewDisplayStatus;
				if($scope.viewDisplayStatus){
					showLastSessionInfo();
					showLastActivityInfo();
				}
			}
			
			$scope.sessionInfoState = "loading";
			$scope.activityInfoState = "loading";
			
			function showLastActivityInfo(){
				if(!$scope.lastActivityData){
					UserDetailInfo.getLastActivityInfo.get({"userId":$scope.userId},function(res){
						$scope.activityInfoState = "loaded";
						$scope.lastActivityData = res;
					},function(err){
						$scope.activityInfoState = "error";
					});
				}
			}
			
			
			function showLastSessionInfo(){
				if(!$scope.lastSessionData){
					UserDetailInfo.getLastSessionInfo.get({"userId":$scope.userId},function(res){
						$scope.sessionInfoState = "loaded";
						$scope.lastSessionData = res;
					},function(err){
						$scope.sessionInfoState = "error";
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
				case 9:
				case 10:
					ret = "/discuss/"+activity.entityId;
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
				};
			
			$scope.sessionStatus = {
					"0" : "Active",
					"1" : "InActive",
					"2" : "Expired"
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