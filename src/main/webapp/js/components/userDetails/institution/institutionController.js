adminControllers
	.controller(
		'regInstCtrl', [
			'$scope',
			'$routeParams',
			'$location',
			'UserProfile',
			'$http',
			'$rootScope',
			function($scope, $routeParams, $location,
				UserProfile, $http, $rootScope) {
				// left panel

				$scope.serviceBranchTabs = [];
				$scope.branchIdx = $routeParams.branchIndex ? parseInt($routeParams.branchIndex) : 0;

				var showInstitutionLeftPanel = function() {
					if ($scope.profile.serviceBranches && $scope.profile.serviceBranches.length > 0) {
						for (var i = 0; i < $scope.profile.serviceBranches.length; i++) {
							if ($scope.profile.serviceBranches[i].basicProfileInfo.firstName && $scope.profile.serviceBranches[i].basicProfileInfo.firstName.trim().length > 0) {
								$scope.serviceBranchTabs.push($scope.profile.serviceBranches[i].basicProfileInfo.firstName);
							} else {
								$scope.serviceBranchTabs.push("serviceBranches" + (i + 1));
							}
							if ($scope.branchIdx == i) {
								$scope.branchProfileId = $scope.profile.serviceBranches[i].id;
							}
						}
					}

					if ($routeParams.branchIndex) {
						if ($scope.branchIdx >= $scope.profile.serviceBranches.length) {
							$scope.serviceBranchTabs.push("branch " + $scope.branchIdx);
							//$scope.branchIdx = $scope.branchIdx - 1;
						}
					}
				};
				showInstitutionLeftPanel();

				// left panel

				$scope.userId = $scope.$parent.userId;
				$scope.selectedServices = {};
				$scope.profileImage = [];
				$scope.galleryImages = [];
				$scope.submitted = false;
				$scope.minCategoryError = false;
				$scope.websiteError = false;
				$scope.otherLocations = [];
				$scope.selectedMenuList = {};
				$scope.addBranch = false;
				$scope.branchIndex = 0;
				$scope.views = {};
				$scope.branch = {};
				$scope.branch.featured = false;
				$scope.branch.status = 0;
				$scope.options = {
					country: "in",
					resetOnFocusOut: false
				};

				var init = initialize();
				var systemTagList = {};

				function initialize() {
					if ($scope.$parent.profile) {
						$scope.profile = $scope.$parent.profile;
						extractCorporateData();
						setContentPanel();
					} else {
						$scope.profile = UserProfile.get({
							userId: $scope.userId
						}, function(profile) {
							$scope.profile = profile.data;
							extractCorporateData();
							setContentPanel();
						});
					}
				}


				function setContentPanel() {
					if (!$scope.branchIndex && $scope.branchIndex === 0) {
						$scope.views.formView = "views/userDetails/institution/regInstMainBranch.html";
					} else {
						$scope.views.formView = "views/userDetails/institution/regInstOtherBranch.html";
					}
				}

				function editorInitCallback() {
					if (tinymce.get("registrationDescription") && $scope.branchBasicInfo && $scope.branchBasicInfo.description) {
						tinymce.get("registrationDescription").setContent($scope.branchBasicInfo.description);
					}
				}

				//Prefill form with previously selected data
				function extractCorporateData() {
					$scope.basicProfileInfo = $scope.profile.basicProfileInfo;
					$scope.serviceProviderInfo = $scope.profile.serviceProviderInfo;
					$scope.address = $scope.basicProfileInfo.primaryUserAddress;

					if ($scope.address && $scope.address.country === null) {
						$scope.address.country = "India";
					}

					extractBranchData();
					editorInitCallback();
				}

				function extractBranchData() {
					var branchObj = (JSON.parse(JSON.stringify(BY.config.regConfig.institutionBranch)));
					if ($routeParams.branchIndex) {
						$scope.branchIndex = parseInt($routeParams.branchIndex);
						if ($scope.profile.serviceBranches.length <= $scope.branchIndex) {

							$scope.profile.serviceBranches.push(branchObj);
							$scope.selectedBranch = $scope.profile.serviceBranches[$scope.branchIndex];
						} else {
							$scope.selectedBranch = $scope.profile.serviceBranches[$scope.branchIndex];
						}
					} else {
						if ($scope.profile.serviceBranches.length === 0) {
							$scope.profile.serviceBranches.push(branchObj);
						}
						$scope.selectedBranch = $scope.profile.serviceBranches[0];
					}

					$scope.branchBasicInfo = $scope.selectedBranch.basicProfileInfo;
					$scope.branchServiceInfo = $scope.selectedBranch.serviceProviderInfo;
					$scope.branch.featured = $scope.selectedBranch.featured;
					if($scope.selectedBranch.status == 0){
						$scope.branch.status = false;
					} else{
						$scope.branch.status = true;
					}
					$scope.branchAddress = $scope.branchBasicInfo.primaryUserAddress;


					if ($scope.branchAddress && $scope.branchAddress.country === null) {
						$scope.branchAddress.country = "India";
					}

					for (var i = 0; i < $scope.branchServiceInfo.services.length; i++) {
						var menuId = $scope.branchServiceInfo.services[i];
						$scope.selectedMenuList[menuId] = $rootScope.menuCategoryMap[menuId];
					}
				}

				function addressFormat(index) {
					return {
						"city": "",
						"country": "",
						"locality": "",
						"streetAddress": "",
						"zip": ""
					}
				}

				$scope.showAddressButton = function() {
					if ($(".showAddress").css('display') == 'none') {
						$(".showAddress").show();
						$(".showAddressButton").val('- Hide Address');
					} else {
						$(".showAddress").hide();
						$(".showAddressButton").val('+ Add Address');
					}
				};

				$scope.initEditor = function() {
					var tinyEditor = BYAdmin.addEditor({
						"editorTextArea": "registrationDescription"
					}, editorInitCallback);
				};

				$scope.initHomeVisit = function() {
					var tinyEditor = BY.byEditor.addEditor({
						"editorTextArea": "registrationDescription"
					}, editorInitCallback);
				};

				

				$scope.selectTag = function(event, category) {
					if (event.target.checked) {
						$scope.selectedMenuList[category.id] = category;
						if (category.parentMenuId && $scope.selectedMenuList[category.parentMenuId]) {
							delete $scope.selectedMenuList[category.parentMenuId];
						}
					} else {
						delete $scope.selectedMenuList[category.id];
					}
				}


				$scope.showHomeVisit = function() {
					$('#homeVisit')[0].checked = $scope.branchServiceInfo.homeVisits;
					$('input[type=checkbox][data-toggle^=toggle]').bootstrapToggle(); //Apply bootstrap toggle for house visit option
				}


				//Get location details based on pin code
				$scope.getLocationByPincode = function(event, addressObj) {
					addressObj.city = "";
					addressObj.locality = "";
					addressObj.country = "";
					$http.get("api/v1/location/getLocationByPincode?pincode=" + addressObj.zip)
						.success(function(response) {
							if (response) {
								addressObj.city = response.districtname;
								addressObj.locality = response.officename;
								addressObj.streetAddress = response.officename + ", Distt: " + response.districtname + " , State: " + response.statename;
								addressObj.country = "India";
							}
						});
				}

				//$scope.newAddress = new addressFormat($scope.basicProfileInfo.userAddress.length);
				//$scope.basicProfileInfo.userAddress.push($scope.newAddress);



				//Function to be used to add additional address
				$scope.addNewAddress = function() {
					if ($scope.otherLocations.length < BY.config.regConfig.formConfig.maxUserAddress) {
						$scope.newAddress = new addressFormat($scope.otherLocations.length);
						$scope.otherLocations.push($scope.newAddress);
					}
				}


				//Add secondary phone numbers
				$scope.addPhoneNumber = function(secondaryPhoneNos) {
					//var number = {value:""};
					if (secondaryPhoneNos.length < BY.config.regConfig.formConfig.maxSecondaryPhoneNos) {
						secondaryPhoneNos.push("");
					}

					if (secondaryPhoneNos.length === BY.config.regConfig.formConfig.maxSecondaryPhoneNos) {
						$(".add-phone").hide();
					}
				}

				//Add secondary email details
				$scope.addEmail = function(secondaryEmails) {
					//var email = {value:""};
					if (secondaryEmails.length < BY.config.regConfig.formConfig.maxSecondaryEmailId) {
						secondaryEmails.push("");
					}

					if (secondaryEmails.length === BY.config.regConfig.formConfig.maxSecondaryEmailId) {
						$(".add-email").hide();
					}
				}

				//Delete profile Image
				$scope.deleteProfileImage = function() {
					//$scope.profileImage = [];
					$scope.branchBasicInfo.profileImage = null;
				}

				//Delete gallery images
				$scope.deleteGalleryImage = function(img) {
					//var imgIndex = $scope.galleryImages.indexOf(img);
					//if (imgIndex > -1) {
					//    $scope.galleryImages.splice(imgIndex, 1);
					//}
					var imgIndex = $scope.branchBasicInfo.photoGalleryURLs.indexOf(img);
					if (imgIndex > -1) {
						$scope.branchBasicInfo.photoGalleryURLs.splice(imgIndex, 1);
					}
				}



				var getSystemTagList = function(data) {
					function rec(data) {
						angular.forEach(data, function(menu, index) {
							if (menu && $rootScope.menuCategoryMap[menu.id]) {
								systemTagList[menu.id] = menu.tags;
								if (menu.ancestorIds.length > 0) {
									for (var j = 0; j < menu.ancestorIds.length; j++) {
										var ancestordata = {};
										ancestordata[menu.ancestorIds[j]] = $rootScope.menuCategoryMap[menu.ancestorIds[j]];
										rec(ancestordata);
									}
								}
							}
						})
					}

					rec(data);

					return $.map(systemTagList, function(value, key) {
						return value;
					});
				};


				$scope.profileImgUploaded = function(param) {
					$scope.profileImage = [];
					$scope.branchBasicInfo.profileImage = param ? param : $scope.branchBasicInfo.profileImage;
				};

				$scope.galleryImgUploaded = function(param) {
					$scope.galleryImages = [];
					$scope.branchBasicInfo.photoGalleryURLs = $scope.branchBasicInfo.photoGalleryURLs.concat(param);
				}

				function getMainBranchCategory() {
					if ($scope.profile.serviceBranches.length > 0 && $scope.profile.serviceBranches[0].serviceProviderInfo.services) {
						var mainBranchServices = $scope.profile.serviceBranches[0].serviceProviderInfo.services;
						for (var i = 0; i < mainBranchServices.length; i++) {
							var menuId = mainBranchServices[i];
							$scope.selectedMenuList[menuId] = $rootScope.menuCategoryMap[menuId];
						}
					}

				}

				function prefillDataFromMain() {
					var mainBranch = $scope.profile.serviceBranches[0];
					//Prefill system tag list
					if (Object.keys($scope.selectedMenuList).length === 0) {
						getMainBranchCategory();
					}

					//prefill description
					$scope.branchBasicInfo.description = mainBranch.basicProfileInfo.description;

					//prefill home visit
					$scope.branchServiceInfo.homeVisits = mainBranch.serviceProviderInfo.homeVisits;

					//prefill profileImage
					if ($scope.profileImage.length === 0) {
						$scope.branchBasicInfo.profileImage = mainBranch.basicProfileInfo.profileImage
					}

					//prefill galleryImages
					if ($scope.galleryImages.length === 0) {
						$scope.branchBasicInfo.photoGalleryURLs = mainBranch.basicProfileInfo.photoGalleryURLs;
					}





				}


				//Post institution form
				$scope.postUserProfile = function(isValidForm, addAnotherBranch) {
					$scope.addBranch = addAnotherBranch;
					$(".by_btn_submit").prop("disabled", true);
					$scope.submitted = true;
					$scope.minCategoryError = false;
					$scope.websiteError = false;


					//Prefill data like images, description, tags for other branches  from main branch
					if ($scope.branchIndex > 0) {
						prefillDataFromMain()
					}


					if (tinymce.get("registrationDescription")) {
						$scope.branchBasicInfo.description = tinymce.get("registrationDescription").getContent();
					}


					$scope.branchServiceInfo.services = $.map($scope.selectedMenuList, function(value, key) {
						if (value && $rootScope.menuCategoryMap[value.id]) {
							return value.id;
						}
					});

					if ($('#homeVisit')[0]) {
						$scope.branchServiceInfo.homeVisits = $('#homeVisit')[0].checked;
					}


					//$scope.branchBasicInfo.profileImage = $scope.profileImage.length > 0 ? $scope.profileImage[0] : $scope.branchBasicInfo.profileImage;
					//$scope.branchBasicInfo.photoGalleryURLs = $scope.branchBasicInfo.photoGalleryURLs.concat($scope.galleryImages);

					//if ($scope.otherLocations.length > 0) {
					//    $scope.branchBasicInfo.otherAddresses = $.map($scope.otherLocations, function (value, key) {
					//        return value;
					//    });
					//}

					$scope.selectedBranch.systemTags = getSystemTagList($scope.selectedMenuList);
					if ($scope.selectedBranch.systemTags.length === 0) {
						$scope.minCategoryError = true;
					}

					var regex = /(?:)+([\w-])+(\.[a-z]{2,6}([-a-zA-Z0-9@:%_\+.~#?&!//=]*))+/;
					if ($scope.branchServiceInfo && $scope.branchServiceInfo.website && $scope.branchServiceInfo.website.length > 0) {
						if (regex.exec($scope.branchServiceInfo.website)) {
							$scope.branchServiceInfo.website = regex.exec($scope.branchServiceInfo.website)[0];
						} else {
							$scope.websiteError = true;
						}
					}

					$scope.selectedBranch.featured = $scope.branch.featured;

					if($scope.branch.status == true){
                        $scope.selectedBranch.status = 1;
                    } else{
                        $scope.selectedBranch.status = 0;
                    }

					if (isValidForm.$invalid || $scope.minCategoryError || $scope.websiteError) {
						window.scrollTo(0, 0);
						$(".by_btn_submit").prop('disabled', false);
					} else {
						$scope.branchBasicInfo.secondaryPhoneNos = $.map($scope.branchBasicInfo.secondaryPhoneNos, function(value, key) {
							if (value && value !== "") {
								return value;
							}
						});

						$scope.branchBasicInfo.secondaryEmails = $.map($scope.branchBasicInfo.secondaryEmails, function(value, key) {
							if (value && value !== "") {
								return value;
							}
						});

						var userProfile = new UserProfile();
						angular.extend(userProfile, $scope.profile);
						userProfile.$update({
							userId: $scope.userId
						}, function(profileOld) {
							console.log("success");
							$scope.submitted = false;
							if ($scope.addBranch) {
								$location.path('/institution/' + $scope.userId + '/' + ($scope.profile.serviceBranches.length));
							} else {
								$location.path('/userDetails/' + $scope.userId);
							}
						}, function(err) {
							console.log(err);
						});
					}
				}

				$scope.cancel = function() {
					$location.path('/userDetailType/' + $scope.userId);
				}
			}

		]);