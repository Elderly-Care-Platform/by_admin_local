//User Listing
adminControllers.controller('AdminUserListController', ['$scope', '$location', 'AdminUserList',
	function($scope, $location, AdminUserList) {

		if(localStorage.getItem("ADMIN_USER_ROLE") == 'WRITER' || localStorage.getItem("ADMIN_USER_ROLE") == 'USER' || localStorage.getItem("ADMIN_USER_ROLE") == '' || localStorage.getItem("ADMIN_USER_ROLE") == 'EDITOR')
		{
			$location.path('/users/login');
			return;
	 	}

	   AdminUserList.query({},function(res){
		   $scope.users = res.data;
	   },function(errorResponse){
		   if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002){
				$location.path('/users/login');
				 return;
	        }
	   });
	}]);
