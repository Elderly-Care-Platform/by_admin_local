

//User Delete
adminControllers.controller('AdminUserDeleteController', ['$scope', '$routeParams', '$location', 'AdminUser',
  function($scope, $routeParams, $location, AdminUser) {
	  	if(localStorage.getItem("ADMIN_USER_ROLE") == 'WRITER' || localStorage.getItem("ADMIN_USER_ROLE") == 'USER' || localStorage.getItem("ADMIN_USER_ROLE") == '' || localStorage.getItem("ADMIN_USER_ROLE") == 'EDITOR')
	  			 {
	  				 return;
	 }
    var userId = $routeParams.userId;
	$scope.user = AdminUser.remove({userId: userId});
	AdminUser.query({},function(res){
		$scope.users = res.data;
	},function(errorResponse){
		if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002){
			$location.path('/users/login');
			 return;
        }
	});
	$location.path('/users/all');
	toastr.success("Deleted User");
  }]);
