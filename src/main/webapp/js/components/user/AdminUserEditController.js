
//User Edit
adminControllers.controller('AdminUserEditController', ['$scope', '$routeParams', '$location', 'AdminUserShow',
  function($scope, $routeParams, $location, AdminUserShow) {
	  	if(localStorage.getItem("ADMIN_USER_ROLE") == 'WRITER' || localStorage.getItem("ADMIN_USER_ROLE") == 'USER' || localStorage.getItem("ADMIN_USER_ROLE") == '' || localStorage.getItem("ADMIN_USER_ROLE") == 'EDITOR')
	  			 {
	  				 return;
	 }
	var userId = $routeParams.userId;
    AdminUserShow.get({userId: userId},function(res){
    	$scope.user = res.data;
    },function(errorResponse){
    	if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002){
			$location.path('/users/login');
			 return;
        }
    });
  }]);