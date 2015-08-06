//User Listing
adminControllers.controller('AdminUserListController', ['$scope', '$location', 'AdminUserList',
	function($scope, $location, AdminUserList) {

		if(localStorage.getItem("ADMIN_USER_ROLE") == 'WRITER' || localStorage.getItem("ADMIN_USER_ROLE") == 'USER' || localStorage.getItem("ADMIN_USER_ROLE") == '' || localStorage.getItem("ADMIN_USER_ROLE") == 'EDITOR')
		{
			$location.path('/users/login');
			return;
	 	}

	   $scope.users = AdminUserList.query();
	}]);
