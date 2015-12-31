adminControllers.controller('UserSearchController', [ '$scope', '$routeParams',
		'$location', 'UserSearch',
		function($scope, $routeParams, $location, UserSearch) {
			if (localStorage.getItem("ADMIN_USER_ROLE") != 'SUPER_USER') {
				return;
			}
			
			$scope.status = "";

			$scope.filters = {
				"userId" : "",
				"email" : "",
				"userName" : ""
			};
			
			$scope.searchResults = null;
			$scope.search = function(){
				var ret = "/users/search?"
				if($scope.filters.userId){
					ret += "userId="+$scope.filters.userId + "&";
				}
				if($scope.filters.email){
					ret += "email="+$scope.filters.email + "&";
				}	
				if($scope.filters.userName){
					ret += "userName="+$scope.filters.userName + "&";
				}	
				$location.url(ret);
			}

			$scope.searchUsers = function() {
				$scope.status = "loading";
				$scope.searchResults = [];
				UserSearch.searchUser($scope.filters, function(res) {
					$scope.searchResults = res;
					$scope.status = "";
				}, function(errorResponse) {
					$scope.status = "";
					console.log(errorResponse);
				});
			};
			
			if($routeParams.userId || $routeParams.email || $routeParams.userName){
				$scope.filters.userId = $routeParams.userId;
				$scope.filters.email = $routeParams.email;
				$scope.filters.userName = $routeParams.userName;
				$scope.searchUsers();
			}

		} ]);