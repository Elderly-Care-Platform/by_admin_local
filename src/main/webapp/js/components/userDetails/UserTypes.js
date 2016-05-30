adminControllers
	.controller(
		'UserTypesCtrl', [
			'$scope',
			'$routeParams',
			'$location',
			'UserProfile',
			function($scope, $routeParams, $location,
					UserProfile) {
				if (localStorage.getItem("ADMIN_USER_ROLE") != 'SUPER_USER') {
					return;
				}
				$scope.userId = $scope.$parent.userId;
				$scope.profileData = null;

				$scope.state = "loading";

				$scope.displayUserTypes = function() {
					showUserTypes();
				}

				$scope.featured = false ;

				function showUserTypes() {
					if (!$scope.profileData) {
						
						UserProfile.get({"userId": $scope.userId}, function(res) {
							$scope.userProfileInfo = res.data;
							$scope.state = "loaded";
							if($scope.userProfileInfo){
								$scope.userType = $scope.userProfileInfo.userTypes;
								$scope.featured = $scope.userProfileInfo.featured;
							} else{
								$scope.userType = [];
							}							
							
						}, function(err) {
							$scope.state = "error";
						});
	            };
			}

				$scope.userCategory = "";
				$scope.individualUserType = [{
					key: 0,
					value: "I take care of a senior in my family",
					category: "indv"
				}, {
					key: 1,
					value: "I am a senior person",
					category: "indv"
				}, {
					key: 2,
					value: "I am just curious",
					category: "indv"
				}];
				//        {key:'2', value:"I volunteer with senior people", category:"indv"},

				$scope.profUserType = [{
					key: 7,
					value: "I am an elder care professional",
					category: "indv2"
				}];

				$scope.housingUserType = [{
					key: 3,
					value: "Senior living facilities",
					category: "inst"
				}];
				$scope.institutionUserType = [{
					key: 4,
					value: "Services for seniors & elder care",
					category: "inst2"
				}];

				$scope.otherUserType = [{
					key: -1,
					value: "None of the above!",
					category: "other"
				}];

				$scope.selectedUserType = {};
				$scope.clearUserType = false;

				

				$scope.selectUserType = function(element) {
					var userArray = element.type.key;
					if (element.type.selected) {
						$scope.userCategory = element.type.category;
						$scope.selectedUserType[element.type.key] = element.type.category;

						if ($scope.userCategory === $scope.individualUserType[0].category) {
							if ($scope.clearUserType == false) {
								$scope.userType = [];
							}
							$scope.userType.push(userArray);
							$scope.unSelectUserType($scope.profUserType);
							$scope.unSelectUserType($scope.housingUserType);
							$scope.unSelectUserType($scope.institutionUserType);
							$scope.unSelectUserType($scope.otherUserType);
							$scope.clearUserType = true;
						}

						if ($scope.userCategory === $scope.profUserType[0].category) {
							$scope.clearUserType = false
							if ($scope.clearUserType == false) {
								$scope.userType = [];
							}
							$scope.userType.push(userArray);
							$scope.unSelectUserType($scope.individualUserType);
							$scope.unSelectUserType($scope.housingUserType);
							$scope.unSelectUserType($scope.otherUserType);
							$scope.unSelectUserType($scope.institutionUserType);
						}

						if ($scope.userCategory === $scope.housingUserType[0].category) {
							$scope.clearUserType = false
							if ($scope.clearUserType == false) {
								$scope.userType = [];
							}
							$scope.userType.push(userArray);
							$scope.unSelectUserType($scope.individualUserType);
							$scope.unSelectUserType($scope.profUserType);
							$scope.unSelectUserType($scope.otherUserType);
							$scope.unSelectUserType($scope.institutionUserType);
						}

						if ($scope.userCategory === $scope.institutionUserType[0].category) {
							$scope.clearUserType = false
							if ($scope.clearUserType == false) {
								$scope.userType = [];
							}
							$scope.userType.push(userArray);
							$scope.unSelectUserType($scope.individualUserType);
							$scope.unSelectUserType($scope.profUserType);
							$scope.unSelectUserType($scope.otherUserType);
							$scope.unSelectUserType($scope.housingUserType);
						}

						if ($scope.userCategory === $scope.otherUserType[0].category) {
							$scope.clearUserType = false
							if ($scope.clearUserType == false) {
								$scope.userType = [];
							}
							$scope.userType.push(userArray);
							$scope.unSelectUserType($scope.individualUserType);
							$scope.unSelectUserType($scope.profUserType);
							$scope.unSelectUserType($scope.housingUserType);
							$scope.unSelectUserType($scope.institutionUserType);
						}
					} else {
						$scope.userCategory = "";
						delete $scope.selectedUserType[element.type.key];
						$scope.clearUserType = false
						if ($scope.clearUserType == false) {
							$scope.userType = [];
						}
					}
					

				}

				$scope.unSelectUserType = function(userArr) {
					angular.forEach(userArr, function(type) {
						type.selected = false;
						delete $scope.selectedUserType[type.key];
					});
				}

				$scope.submit = function() {
					
					if ($scope.userType.length > 0 && $scope.userProfileInfo.userTypes.length > 0) {
						$scope.userProfileInfo.featured = $scope.featured;
						$scope.userProfileInfo.userTypes = $scope.userType;
						UserProfile.update({
							"userId": $scope.userId
						}, $scope.userProfileInfo, function(res) {
							console.log("success");
							$location.path('/userDetailProfile/' + $scope.userId);
						}, function(err) {
							console.log("error");
						});
					}
					if ($scope.userType.length > 0 && $scope.userProfileInfo.userTypes.length == 0) {
						$scope.userProfileInfo.featured = $scope.featured;
						$scope.userProfileInfo.userTypes = $scope.userType;
						$scope.userProfileInfo.userId = $scope.userId;
						UserProfile.post({
							"userId": $scope.userId
						}, $scope.userProfileInfo, function(res) {
							console.log("success");
							$location.path('/userDetailProfile/' + $scope.userId);
						}, function(err) {
							console.log("error");
						});			
					}
				}

				$scope.cancel = function() {
					$location.path('/userDetails/' + $scope.userId);
				}


			}
		]);