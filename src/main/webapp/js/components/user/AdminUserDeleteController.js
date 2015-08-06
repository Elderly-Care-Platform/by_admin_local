

//User Delete
adminControllers.controller('AdminUserDeleteController', ['$scope', '$routeParams', '$location', 'AdminUser',
  function($scope, $routeParams, $location, AdminUser) {
	  	if(localStorage.getItem("ADMIN_USER_ROLE") == 'WRITER' || localStorage.getItem("ADMIN_USER_ROLE") == 'USER' || localStorage.getItem("ADMIN_USER_ROLE") == '' || localStorage.getItem("ADMIN_USER_ROLE") == 'EDITOR')
	  			 {
	  				 return;
	 }
    var userId = $routeParams.userId;
	$scope.user = AdminUser.remove({userId: userId});
	$scope.users = AdminUser.query();
	$location.path('/users/all');
	toastr.success("Deleted User");
  }]);
