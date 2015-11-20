adminControllers.controller('modifySignUpCtrl', modifySignUpCtrl)
adminControllers.factory('modifySignUp', modifySignUpFactory)
modifySignUpCtrl.$inject = ['$scope', '$routeParams', '$rootScope', '$http', 'modifySignUp'];
function modifySignUpCtrl($scope, $routeParams, $rootScope, $http, modifySignUp){
	modifySignUp.getUser().then(function(modifySignUp) {
		
		$scope.userDetails = modifySignUp;
		
        $scope.userCredential = {};
        $scope.userCredential.userName = modifySignUp.userName;
        $scope.userCredential.password = modifySignUp.password;
        $scope.showSuccessMsg = false;
        $scope.changePwd = false;

        if($scope.userCredential.userName === "null") {
            $scope.userCredential.userName = "";
        }
        if($routeParams.changeUserPwd == "true"){
        	$scope.changePwd = true;
        }
        $scope.modifyUserCredential = function(){
            $scope.userCredential.signUpErorr = "";

            if($scope.changePwd){
                if(!$scope.userCredential.password){
                    $scope.userCredential.signUpErorr = "Password can not be empty";
                } else if($scope.userCredential.password && $scope.userCredential.password.trim().length < 6){
                    $scope.userCredential.signUpErorr = "Password must be at least 6 character";
                }  else{
                    $scope.userDetails.password = $scope.userCredential.password;
                    $scope.userCredential.signUpErorr = "";
                }
            }else{
                $scope.userDetails.userName = $scope.userCredential.userName;
                $scope.userCredential.signUpErorr = "";
            }

            if($scope.userCredential.signUpErorr===""){
         
                $http.post('api/v1/users/' + $routeParams.userId, $scope.userDetails).then(function() {
                	$scope.showSuccessMsg = true;
                });
            
            }

        };

        $scope.exit = function(){
            $scope.$parent.exit();
        };
	});
    
	return modifySignUpCtrl;
}

modifySignUpFactory.$inject = ['$http', '$routeParams'];
function modifySignUpFactory($http, $routeParams) {
    return {
    	getUser: function(){
            return $http.get('api/v1/users/show/' + $routeParams.userId).then(function(response){
            	return response.data.data;
            });
        }
    }
}