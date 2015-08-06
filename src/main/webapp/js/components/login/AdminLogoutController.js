
//Admin Logout Controller
adminControllers.controller('AdminLogoutController', ['$scope', '$location', '$rootScope' ,
function ($scope, $location, $rootScope) {
    if($rootScope.sessionId != '') {
		$location.path("#/users/login");
	}
	$rootScope.sessionId='';
	$rootScope.bc_discussType = '';
	$rootScope.bc_username = '';
	$rootScope.bc_userId = '';
	$rootScope.bc_userRoleId = '';

	localStorage.setItem("AdminSessionId", "");
	localStorage.setItem("ADMIN_USER_ID", "");
	localStorage.setItem("ADMIN_USER_NAME", "");
	localStorage.setItem("ADMIN_USER_ROLE", "");

	localStorage.removeItem(0);
	localStorage.removeItem(1);
	localStorage.removeItem(2);

	window.location.reload();
	$location.path("users/login");

}]);
