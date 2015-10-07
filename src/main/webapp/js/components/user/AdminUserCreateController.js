


adminControllers.controller('AdminUserCreateController', ['$scope', '$routeParams', '$location', 'AdminUser',
  function($scope, $routeParams, $location, AdminUser) {
	  	if(localStorage.getItem("ADMIN_USER_ROLE") == 'WRITER' || localStorage.getItem("ADMIN_USER_ROLE") == 'USER' || localStorage.getItem("ADMIN_USER_ROLE") == '' || localStorage.getItem("ADMIN_USER_ROLE") == 'EDITOR')
	  			 {
	  				 return;
	 }
     var userId = $routeParams.userId;
     	if(userId != null )
	 	{
	 		AdminUser.get({userId: userId},function(res){
	 			$scope.user = res.data;
	 			if($scope.user.regType ==null || $scope.user.regType == undefined){
	 				$scope.user.regType = 0;
	 			}
	 			if($scope.user.phoneNumber ==null || $scope.user.phoneNumber == undefined){
	 				$scope.user.phoneNumber = "";
	 			}else if($scope.user.email ==null || $scope.user.email == undefined){
	 				$scope.user.email = "";
	 			}
	 		},function(errorResponse){
	 			if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002){
 					$location.path('/users/login');
 					 return;
 		        }
	 		});
	 		
	 		
	 		
	 		$scope.edituser = function () {
	 			AdminUser.update($scope.user,function(res){
		 			toastr.success("Edited User");
	 				$location.path('/users/all');
		 		},function(errorResponse){
		 			if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002){
	 					$location.path('/users/login');
	 					 return;
	 		        }
		 			if(error && error.data && error.data.error && error.data.error.errorCode){
	 					$scope.error = error.data.error.errorMsg;
	 				}
		 		});
	 		};
	 	}
	 	else
	 	{
	 		$scope.user = new AdminUser();
	 		$scope.user.regType = 0;

			$scope.register = function () {
				if($scope.userForm.$invalid) return;
				AdminUser.update($scope.user,function(res){
					$scope.message = "User registered successfully";
					$scope.error = '';
					$scope.submitted = true;
					$location.path('/users/all');
		 		},function(errorResponse){
		 			if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002){
	 					$location.path('/users/login');
	 					 return;
	 		        }
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