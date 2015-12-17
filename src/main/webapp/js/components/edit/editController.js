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
        $scope.serviceBranchTabs = [];
        $scope.branchIdx = $routeParams.branchIndex ? parseInt($routeParams.branchIndex) : 0;
        
        $scope.host = location.host;
        $scope.pathName = location.pathname;
        
        $scope.changeUsername = function () {
            $window.scrollTo(0, 0);
            $(".by_profileDetailed_menu").removeClass('by_profileDetailed_menuActive');
            $(".username").addClass('by_profileDetailed_menuActive');
            $scope.views.leftPanel = "views/edit/editLeftPanel.html";
            $scope.views.contentPanel = "views/edit/login/modifyUsername.html";
        };
        
        $scope.changePassword = function () {
        	window.scrollTo(0, 0);
            $(".by_profileDetailed_menu").removeClass('by_profileDetailed_menuActive');
            $(".password").addClass('by_profileDetailed_menuActive');
            $scope.views.leftPanel = "views/edit/editLeftPanel.html";
            $scope.views.contentPanel = "views/edit/login/modifyPassword.html";
        };
        
        $scope.leftPanelHeight = function(){            
            var clientHeight = $( window ).height() - 57;
            $(".by_menuDetailed").css('height', clientHeight+"px");
        }
        
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
                
            } else if($scope.profile.userTypes[0]===4){
            	if($scope.profile.serviceBranches && $scope.profile.serviceBranches.length > 0){
                    for(var i=0; i<$scope.profile.serviceBranches.length; i++){
                        if($scope.profile.serviceBranches[i].basicProfileInfo.firstName && $scope.profile.serviceBranches[i].basicProfileInfo.firstName.trim().length > 0){
                            $scope.serviceBranchTabs.push($scope.profile.serviceBranches[i].basicProfileInfo.firstName);
                        } else{
                            $scope.serviceBranchTabs.push("serviceBranches"+(i+1));
                        }
                        if($scope.branchIdx==i){
                            $scope.branchProfileId = $scope.profile.serviceBranches[i].id;
                        }
                    }
                }else{
                    $scope.sectionLabel = $scope.userTypeConfig.label;
                }
            	
                if($routeParams.branchIndex){
                    if($scope.branchIdx >= $scope.profile.serviceBranches.length){
                        $scope.serviceBranchTabs.push("branch "+$scope.branchIdx);
                    }
                }

            }else {
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
            $location.path('/edit/housingRegistration/'+ facilityIdx);
        }
        
        $scope.initialize = function(){
        	$scope.getUserProfile();
        };

    return editController;
};