define(['byApp', 'byUtil'], function(byApp, byUtil) {
    function regUserTypeController($scope, $rootScope, $http, $location, $routeParams, UserProfile){
        $scope.userCategory = "";
        $scope.individualUserType = [
            {key:'0', value:"I take care of a senior in my family", category:"indv"},
            {key:'1', value:"I am a senior person", category:"indv"},
            {key:'2', value:"I am just curious", category:"indv"
            }];
        //        {key:'2', value:"I volunteer with senior people", category:"indv"},

        $scope.profUserType =[{key:'7', value:"I am an elder care professional", category:"indv2"}];

        $scope.housingUserType = [
            {key:'3', value:"Senior living facilities", category:"inst"}];
        $scope.institutionUserType = [
            {key:'4', value:"Services for seniors & elder care", category:"inst2"}];

        $scope.otherUserType = [
            {key:'-1', value:"None of the above!", category:"other"}];

        $scope.selectedUserType = {};

        $scope.selectUserType = function(element){
            if(element.type.selected){
                $scope.userCategory = element.type.category;
                $scope.selectedUserType[element.type.key] = element.type.category;

                if($scope.userCategory === $scope.individualUserType[0].category){
                    $scope.unSelectUserType($scope.profUserType);
                    $scope.unSelectUserType($scope.housingUserType);
                    $scope.unSelectUserType($scope.institutionUserType);
                    $scope.unSelectUserType($scope.otherUserType);
                }

                if($scope.userCategory === $scope.profUserType[0].category){
                    $scope.unSelectUserType($scope.individualUserType);
                    $scope.unSelectUserType($scope.housingUserType);
                    $scope.unSelectUserType($scope.otherUserType);
                    $scope.unSelectUserType($scope.institutionUserType);
                }

                if($scope.userCategory === $scope.housingUserType[0].category){
                    $scope.unSelectUserType($scope.individualUserType);
                    $scope.unSelectUserType($scope.profUserType);
                    $scope.unSelectUserType($scope.otherUserType);
                    $scope.unSelectUserType($scope.institutionUserType);
                }

                if($scope.userCategory === $scope.institutionUserType[0].category){
                    $scope.unSelectUserType($scope.individualUserType);
                    $scope.unSelectUserType($scope.profUserType);
                    $scope.unSelectUserType($scope.otherUserType);
                    $scope.unSelectUserType($scope.housingUserType);
                }

                if($scope.userCategory === $scope.otherUserType[0].category){
                    $scope.unSelectUserType($scope.individualUserType);
                    $scope.unSelectUserType($scope.profUserType);
                    $scope.unSelectUserType($scope.housingUserType);
                    $scope.unSelectUserType($scope.institutionUserType);
                }
            } else {
                $scope.userCategory = "";
                delete $scope.selectedUserType[element.type.key];
            }

        }

        $scope.unSelectUserType = function(userArr){
            angular.forEach(userArr, function (type) {
                type.selected = false;
                delete $scope.selectedUserType[type.key];
            });
        }

        $scope.submit = function(){
            $scope.userProfile = new UserProfile();
            $scope.userProfile.basicProfileInfo = $scope.$parent.profile.basicProfileInfo;
            $scope.userProfile.userId = localStorage.getItem("USER_ID");
            $scope.userProfile.userTypes = $.map($scope.selectedUserType, function(value, key){
                return parseInt(key);
            })

            if($scope.userProfile.userTypes.length > 0){
                $scope.userProfile.$post(function(profile, headers){
                    console.log("success");
                    $scope.$parent.getUserProfile();
                }, function(error){
                    console.log("error");
                    $scope.cancel();
                });
            } else{
                $scope.cancel();
            }

        }

        $scope.cancel = function(){
            console.log("return");
            $scope.$parent.exit();
        }
    }

    regUserTypeController.$inject = ['$scope', '$rootScope', '$http', '$location', '$routeParams','UserProfile'];
    byApp.registerController('regUserTypeController', regUserTypeController);
    return regUserTypeController;
});
