adminControllers.controller('editController', editController)
editController.$inject = ['$scope', '$rootScope', '$routeParams', '$location','$http', 'UserProfile'];
	function editController($scope, $rootScope, $routeParams, $location, $http, UserProfile){
        $scope.views = {};
        $scope.views.leftPanel = "";
        $scope.profile = null;
        $scope.housingFacilityTabs = [];
        $scope.sectionLabel = null;
        $scope.userType = null;
        $scope.facilityIdx = $routeParams.facilityIndex ? parseInt($routeParams.facilityIndex) : 0;

        $scope.host = location.host;
        $scope.pathName = location.pathname;
        
        $scope.changeUsername = function () {
            $(".reg-menu-1").removeClass('active');
            $(".username").addClass('active');
            $scope.views.leftPanel = "views/edit/editLeftPanel.html";
            $scope.views.contentPanel = "views/edit/login/modifyUsername.html";
        };
        
        $scope.changePassword = function () {
            $(".reg-menu-1").removeClass('active');
            $(".password").addClass('active');
            $scope.views.leftPanel = "views/edit/editLeftPanel.html";
            $scope.views.contentPanel = "views/edit/login/modifyPassword.html";
        };
        
        $scope.editUserProfile = function () {
            if ($scope.profile && $scope.profile.userTypes && $scope.profile.userTypes.length) {
                $(".list-group-item").removeClass('active');
                $(".reg-menu-1").addClass('active');
                $scope.views.contentPanel = $scope.userTypeConfig.contentPanel;
            } else {
                $scope.getUserProfile();
                $(".list-group-item").removeClass('active');
                $(".reg-menu-1").addClass('active');
            }
        };
        
        $scope.updateLeftPanel = function(){


            $scope.views.leftPanel = $scope.userTypeConfig.leftPanel;
            $scope.userType  = $scope.profile.userTypes[0];
            if($scope.profile.userTypes[0]===3){
                if($scope.profile.facilities && $scope.profile.facilities.length > 0){
                    for(var i=0; i<$scope.profile.facilities.length; i++){
                        if($scope.profile.facilities[i].name && $scope.profile.facilities[i].name.trim().length > 0){
                            $scope.housingFacilityTabs.push($scope.profile.facilities[i].name);
                        } else{
                            $scope.housingFacilityTabs.push("Facility"+(i+1));
                        }
                        if($scope.facilityIdx==i){
                        	$scope.facilityProfileId = $scope.profile.facilities[i].id;
                        }
                        
                    }
                }else{
                    $scope.sectionLabel = $scope.userTypeConfig.label;
                }

                if($routeParams.facilityIndex){
                    if($scope.facilityIdx > $scope.profile.facilities.length){
                        $scope.housingFacilityTabs.push("Facility"+$scope.facilityIdx);
                        $scope.facilityIdx = $scope.facilityIdx - 1;
                    }
                }
            } else {
                $scope.sectionLabel = $scope.userTypeConfig.label;
            }
        };

        $scope.updateContentPanel = function(){
        	if($routeParams.changeUserName) {
        		$scope.changeUsername();
            } else if($routeParams.changeUserPwd){
            	$scope.changePassword();
            } else{
            	$scope.views.contentPanel = $scope.userTypeConfig.contentPanel;
                if (!$scope.views.contentPanel || $scope.views.contentPanel == "") {
                	$scope.exit();
                }
            }
        };

        $scope.getUserProfile = function (regLevel) {
            $scope.userProfile = $http.get("api/v1/userProfile/"+$routeParams.userId).success(function(res) {
                $scope.profile = res.data;
                if ($scope.profile.userTypes.length > 0) {
                    $scope.userTypeConfig = BY.config.regConfig.userTypeConfig[$scope.profile.userTypes[0]];
                    $scope.updateLeftPanel();
                    $scope.updateContentPanel();
                    
                } else {
                    $scope.views.leftPanel = BY.config.regConfig.userTypeConfig[-1].leftPanel;
                    if($routeParams.changeUserName) {
                    	$scope.changeUsername(); 
                    	$scope.$apply();
                    	
                    } else if($routeParams.changeUserPwd){
                        $scope.changePassword();
                        $scope.$apply();
                        
                    } else{
                    	$scope.views.contentPanel = BY.config.regConfig.userTypeConfig[-1].contentPanel; 
                    	$scope.$apply();
                    }
                }
            });
        }

        $scope.exit = function () {
            if ($rootScope.nextLocation) {
                $location.path($rootScope.nextLocation);
            }
            else {
                $location.path('/services/' + $routeParams.userId);
            }
        }

        $scope.showFacility = function(facilityIdx){
            $location.path('/users/housingRegistration/'+ facilityIdx);
        }
        
        $scope.initialize = function(){
        	$scope.getUserProfile();
        };

    return editController;
};