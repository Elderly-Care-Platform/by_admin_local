


adminControllers.controller('AdminUserCreateController', ['$scope', '$routeParams', '$location', 'AdminUser',
  function($scope, $routeParams, $location, AdminUser) {
	  	if(localStorage.getItem("ADMIN_USER_ROLE") == 'WRITER' || localStorage.getItem("ADMIN_USER_ROLE") == 'USER' || localStorage.getItem("ADMIN_USER_ROLE") == '' || localStorage.getItem("ADMIN_USER_ROLE") == 'EDITOR')
	  			 {
	  				 return;
	 }
     var userId = $routeParams.userId;
     	if(userId != null )
	 	{
	 		$scope.user = AdminUser.get({userId: userId});
	 		$scope.edituser = function () {
	 			$scope.user.$save(function (user, headers) {
	 				toastr.success("Edited User");
	 				$location.path('/users/all');
	 			});
	 		};
	 	}
	 	else
	 	{
	 		$scope.user = new AdminUser();

			$scope.register = function () {
				if($scope.userForm.$invalid) return;
				$scope.user.$save(function (user, headers)
				{

					$scope.message = "User registered successfully";
					$scope.error = '';
					$scope.submitted = true;
					$location.path('/users/all');

				}, function (error) {
					// failure
					console.log("$save failed " + JSON.stringify(error));
					$scope.error = 'Error in registering.Check your inputs and try again. Make sure that the Email is unique to the system.';
					$scope.message = '';
					$scope.submitted = false;
					$scope.userName = '';
					$scope.email = '';
					$scope.password = '';
					$scope.userRoleId = '';

					$location.path('/users/new');

				});

			};
		}
  }]);