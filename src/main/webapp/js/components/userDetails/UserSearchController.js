adminControllers.controller('UserSearchController', [ '$scope', '$routeParams',
		'$location', 'UserSearch', 'UserTag', 
		function($scope, $routeParams, $location, UserSearch, UserTag) {
			if (localStorage.getItem("ADMIN_USER_ROLE") != 'SUPER_USER') {
				return;
			}
			
			$scope.status = "";

			$scope.filters = {
				"userId" : "",
				"email" : "",
				"userName" : "",
				"userTags": []
			};
			
			$scope.searchResults = null;

			UserTag.get(function(res) {
				$scope.existingTags = res.data;
				$scope.editTags = $routeParams.userTags;
				var editTagArray = $scope.editTags.split(",");
				$scope.allTags = [];
				Object.keys(editTagArray).forEach(function(key){
		       	if(editTagArray[key]){
		       		for ( var i = 0; i < $scope.existingTags.length; i++){
		       			if(editTagArray[key] == $scope.existingTags[i].id){
		       				$scope.allTags.push($scope.existingTags[i]);
		       			}
		       		}
		       		
		       	}
				});
				$scope.allTags.push("");
			}, function(errorResponse) {
				if (errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002) {
					$location.path('/users/login');
					return;
				}
				alert("error fetching tags");
			});

			$scope.allTags = [ "" ];
	 		
	 		$scope.addTag = function() {
				$scope.allTags.push("");
			}
			$scope.removeTag = function(idx) {
				$scope.allTags.splice(idx, 1);
			}

			$scope.getUserTags = function(){
				$scope.urlTags = [];
		 			for(var i = 0; i < $scope.allTags.length; i++){
		 				if($scope.allTags[i] && $scope.allTags[i].id){
		 					$scope.urlTags.push($scope.allTags[i].id);
		 				}
		 			}
		 			$scope.passTags = [];
		 			$.each($scope.urlTags, function(i, el){
					    if($.inArray(el, $scope.passTags) === -1) $scope.passTags.push(el);
					});		 			
					$scope.filters.userTags = $scope.passTags;
			}

			

			$scope.search = function(){	

				$scope.getUserTags();			
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
				if($scope.filters.userTags && $scope.filters.userTags.length > 0){
		 			ret += "userTags="+$scope.filters.userTags + "&";
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
			
			if($routeParams.userId || $routeParams.email || $routeParams.userName || $routeParams.userTags){
				$scope.filters.userId = $routeParams.userId;
				$scope.filters.email = $routeParams.email;
				$scope.filters.userName = $routeParams.userName;
				$scope.filters.userTags = $routeParams.userTags;
				$scope.searchUsers();
			}


		} ]);