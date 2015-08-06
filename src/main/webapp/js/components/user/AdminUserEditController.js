
//User Edit
adminControllers.controller('AdminUserEditController', ['$scope', '$routeParams', '$location', 'AdminUserShow',
  function($scope, $routeParams, $location, AdminUserShow) {
	  	if(localStorage.getItem("ADMIN_USER_ROLE") == 'WRITER' || localStorage.getItem("ADMIN_USER_ROLE") == 'USER' || localStorage.getItem("ADMIN_USER_ROLE") == '' || localStorage.getItem("ADMIN_USER_ROLE") == 'EDITOR')
	  			 {
	  				 return;
	 }
	var userId = $routeParams.userId;
    $scope.user = AdminUserShow.get({userId: userId});
  }]);