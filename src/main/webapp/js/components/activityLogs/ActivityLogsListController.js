adminControllers.controller('ActivityLogsListController', [ '$scope',
		'$routeParams', '$location', '$http','ActivitiesList',
		function($scope, $routeParams, $location, $http,ActivitiesList) {
			if (localStorage.getItem("ADMIN_USER_ROLE") !== 'SUPER_USER') {
				$location.path('/users/login');
				return;
			}
			
			$scope.host = location.host;

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
				'11' : "Review",
				'12' : "Share post",
				'13' : "Share question",
				'14' : "Rate housing",
				'15' : "Rate service",
				'16' : "Like on question",
				'17' : "Like on review"
			};
			
			

			$scope.markAsRead = function(isRead, idx) {
				$http.post("/byadmin/api/v1/activityLog/markAsRead", {
					"read" : isRead,
					"id" : $scope.logs[idx].id
				}).success(function(res) {
					$scope.logs[idx] = res;
				})

			}

			var url = "/byadmin/api/v1/activityLog/page";
			
			
			
			$scope.postsByUser = function (page, size) {
	            var params = {p:page, s:size};
	            ActivitiesList.get(params,function(res) {
					$scope.logs = res.content;
					$scope.postsPagination = {};
	                $scope.postsPagination.totalPosts = res.total;
	                $scope.postsPagination.noOfPages = Math.ceil(res.total/res.size);
	                $scope.postsPagination.currentPage = res.number;
	                $scope.postsPagination.pageSize = res.size;
				});
	        };
	        
	        $scope.postsByUser(0,10);

		} ]);