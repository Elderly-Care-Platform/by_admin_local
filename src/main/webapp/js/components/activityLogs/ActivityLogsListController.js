adminControllers.controller('ActivityLogsListController', [
		'$scope',
		'$routeParams',
		'$location',
		'$http',
		'ActivitiesList',
		'ActivitiesStats',
		function($scope, $routeParams, $location, $http, ActivitiesList,ActivitiesStats) {
			if (localStorage.getItem("ADMIN_USER_ROLE") !== 'SUPER_USER') {
				$location.path('/users/login');
				return;
			}
			
			$scope.filters = {
				readFilter:0,
				dateFilter:0,
				dateStartRange:new Date(),
				dateEndRange:new Date(),
				activityTypeFilter:0
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

			$scope.markAsRead = function(isRead, idx) {
				$http.post("/byadmin/api/v1/activityLog/markAsRead", {
					"read" : isRead,
					"id" : $scope.logs[idx].id
				}).success(function(res) {
					$scope.logs[idx] = res.data;
				})

			}

			$scope.openProfile = function(profileId) {
				$http.get("api/v1/userProfile/getByProfileId/" + profileId)
						.success(function(response) {
							response = response.data;
							if (response != null && response !== "") {
								var userId = response.userId;
								 $('#linkToOpen').remove();
								    var link = document.createElement('a');
								    link.target = '_blank';
								    link.href = "http://"+$scope.host+"/#!/users/placeholder?profileId="+userId;
								    link.id = 'linkToOpen';

								    document.body.appendChild(link);
								    $('#linkToOpen')[0].click();
								    $('#linkToOpen')[0].remove();
							}
						}, function(errorResponse) {
							console.log("error fetching profile");
							if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002){
								$location.path('/users/login');
								 return;
					        }
							
						});
			}
			
			$scope.openHousing = function(profileId) {
				$http.get("api/v1/housing/" + profileId)
						.success(function(response) {
							response = response.data;
							if (response != null && response !== "") {
								var userId = response.userId;
								 $('#linkToOpen').remove();
								    var link = document.createElement('a');
								    link.target = '_blank';
								    link.href = "http://"+$scope.host+"/#!/users/placeholder?profileId="+profileId;
								    link.id = 'linkToOpen';

								    document.body.appendChild(link);
								    $('#linkToOpen')[0].click();
								    $('#linkToOpen')[0].remove();
							}
						}, function(errorResponse) {
							console.log("error fetching profile");
							if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002){
								$location.path('/users/login');
								 return;
					        }
							
						});
			}

			$scope.postsByUser = function(page, size) {
				var startDate = new Date();
				var endDate = new Date();
				if($scope.filters.dateFilter == "1"){
					startDate.setDate(startDate.getDate() - 1);
					endDate.setDate(endDate.getDate() - 1);
					console.log(startDate,endDate);
				}else if($scope.filters.dateFilter == "2"){
					startDate = $scope.filters.dateStartRange;
					endDate = $scope.filters.dateEndRange;
				}
				
				var typeFilter = $scope.filters.activityTypeFilter;
				if(typeFilter == "66"){
					typeFilter = [6,7,8,16,17];
				}else{
					typeFilter = [typeFilter];
				}
				
				var params = {
					p : page,
					s : size,
					startDate : startDate.getTime(),
					endDate : endDate.getTime(),
					readStatus : $scope.filters.readFilter,
					activityTypeFilter : typeFilter
				};
				ActivitiesList.get(params, function(res) {
					res = res.data;
					$scope.logs = res.content;
					$scope.postsPagination = {};
					$scope.postsPagination.totalPosts = res.total;
					$scope.postsPagination.noOfPages = Math.ceil(res.total
							/ res.size);
					$scope.postsPagination.currentPage = res.number;
					$scope.postsPagination.pageSize = res.size;
				},function(errorResponse){
					if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002){
						$location.path('/users/login');
						 return;
			        }
				});
				
				ActivitiesStats.get({},function(response) {
								response = response.data;
								$scope.statCount = response;
							}, function(errorResponse) {
								console.log("error fetching profile");
								if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002){
									$location.path('/users/login');
									 return;
						        }
								
							});
			};

			$scope.postsByUser(0, 10);

		} ]);