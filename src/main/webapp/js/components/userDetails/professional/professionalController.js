adminControllers
	.controller(
		'regProfCtrl', [
			'$scope',
			'$routeParams',
			'$location',
			'UserProfile',
			'$http',
			'$rootScope',
			function($scope, $routeParams, $location,
				UserProfile, $http, $rootScope) {
				$scope.userId = $scope.$parent.userId;
				$scope.selectedServices = {};
				$scope.profileImage = [];
				$scope.galleryImages = [];
				$scope.submitted = false;
				$scope.minCategoryError = false;
				$scope.websiteError = false;
				$scope.showSpeciality = false;
				$scope.selectedSpeciality = [];
				$scope.selectedMenuList = {};
				$scope.filters = {};

				var editorInitCallback = function() {
					if (tinymce.get("registrationDescription") && $scope.basicProfileInfo && $scope.basicProfileInfo.description) {
						tinymce.get("registrationDescription").setContent($scope.basicProfileInfo.description);
					}
				}
				var tinyEditor = BYAdmin.addEditor({
					"editorTextArea": "registrationDescription"
				}, editorInitCallback);

				$scope.featured = false ;
				$scope.withdrawn = false ;



				//Create specialities options array for Jquery Ui autocomplete
				$scope.showSpecialityOptions = function(parentCategory) {
					if (!$scope.filters[parentCategory.displayMenuName]) {
						$scope.filters[parentCategory.displayMenuName] = {};
						$scope.filters[parentCategory.displayMenuName].filterName = parentCategory.filterName;
						$scope.filters[parentCategory.displayMenuName].specialityError = false;

						//it accept only An array of objects with label and value properties, ex :[ { label: "Choice1", value: "value1" }, ... ]
						var specialities = $.map(parentCategory.children, function(value, key) {
							var autoCompleteOption = {
								label: value.displayMenuName,
								value: value.displayMenuName,
								obj: value,
								parent: parentCategory.displayMenuName
							};

							//show/hide selected speciality option based on previous selection && parent category selection
							if (JSON.stringify($scope.profile.systemTags).indexOf(JSON.stringify(value.tags[0])) != -1) {
								$scope.filters[parentCategory.displayMenuName].selectedSpeciality = value;

								//important - separate property for ng-model, to restrict modification in actual menu object (object reference issue)
								$scope.filters[parentCategory.displayMenuName].selectedSpecialityName = value.displayMenuName;
							}
							return autoCompleteOption;
						});

						$scope.filters[parentCategory.displayMenuName].specialities = specialities;
					}

				}

				//Speciality Autocomplete callback
				$scope.selectSpecialty = function(spaciality, filterObj) {
					if (spaciality) {
						filterObj.selectedSpeciality = spaciality.obj;
						filterObj.selectedSpecialityName = spaciality.value;
					} else {
						filterObj.selectedSpeciality = null;
						filterObj.selectedSpecialityName = null;
						//filterObj.specialityError = true;
					}
					$scope.$apply();
				}

				//Select menu from accordion
				$scope.selectTag = function(event, category) {
					if (event.target.checked) {
						$scope.selectedMenuList[category.id] = category;
						//Add only Leaf category and not any parent category
						if (category.parentMenuId && $scope.selectedMenuList[category.parentMenuId]) {
							delete $scope.selectedMenuList[category.parentMenuId];
						}

						if (category.filterName && category.filterName !== null && category.children.length > 0) {
							$scope.showSpecialityOptions(category);
						}
					} else {
						delete $scope.selectedMenuList[category.id];

						if (category.filterName && category.filterName !== null && category.children.length > 0) {
							delete $scope.filters[category.displayMenuName];
						}
					}
				}

				//Prefill form with previously selected data
				$scope.extractData = function() {
					$scope.basicProfileInfo = $scope.profile.basicProfileInfo;
					$scope.serviceProviderInfo = $scope.profile.serviceProviderInfo;
					$scope.individualInfo = $scope.profile.individualInfo;
					$scope.address = $scope.basicProfileInfo.primaryUserAddress;
					$scope.serviceProviderInfo.specialities = {};
					$('#homeVisit')[0].checked = $scope.serviceProviderInfo.homeVisits;

					if ($scope.address && $scope.address.country === null) {
						$scope.address.country = "India";
					}
					$scope.featured = $scope.profile.featured;
					if($scope.profile.status == 0){
						$scope.withdrawn = false;
					}else{
						$scope.withdrawn = true;
					}
					editorInitCallback();
					for (var i = 0; i < $scope.serviceProviderInfo.services.length; i++) {
						var menuId = $scope.serviceProviderInfo.services[i],
							category = $rootScope.menuCategoryMap[menuId];

						if (category) {
							$scope.selectedMenuList[menuId] = category;
							if (category.filterName && category.filterName !== null && category.children.length > 0) {
								$scope.showSpecialityOptions(category);
							}
						}
					}
				}

				//Initialize individual registration
				if ($scope.$parent.profile) {
					$scope.profile = $scope.$parent.profile;
					$scope.extractData();
				} else {
					$scope.profile = UserProfile.get({
						userId: $scope.userId
					}, function(profile) {
						$scope.profile = profile.data;
						$scope.extractData();
					});
				}


				//Get location details based on pin code
				$scope.getLocationByPincode = function(element) {
					var element = document.getElementById("zipcode");
					$scope.address.city = "";
					$scope.address.locality = "";
					$scope.address.country = "";
					$http.get("api/v1/location/getLocationByPincode?pincode=" + $scope.address.zip)
						.success(function(response) {
							if (response) {
								$scope.address.city = response.districtname;
								$scope.address.locality = response.officename;
								$scope.address.streetAddress = response.officename + ", Distt: " + response.districtname + " , State: " + response.statename;
								$scope.address.country = "India";
							}
						});
				}

				$scope.options = {
					country: "in",
					resetOnFocusOut: false
				};


				$('input[type=checkbox][data-toggle^=toggle]').bootstrapToggle(); //Apply bootstrap toggle for house visit option
				function addressFormat(index) {
					return {
						"index": index,
						"city": "",
						"zip": "",
						"locality": "",
						"landmark": "",
						"address": ""
					}
				}

				//Add secondary phone numbers
				$scope.addPhoneNumber = function() {
					//var number = {value:""};
					if ($scope.basicProfileInfo.secondaryPhoneNos.length < BY.config.regConfig.formConfig.maxSecondaryPhoneNos) {
						$scope.basicProfileInfo.secondaryPhoneNos.push("");
					}

					if ($scope.basicProfileInfo.secondaryPhoneNos.length === BY.config.regConfig.formConfig.maxSecondaryPhoneNos) {
						$(".add-phone").hide();
					}
				}

				//Add secondary email details
				$scope.addEmail = function() {
					//var email = {value:""};
					if ($scope.basicProfileInfo.secondaryEmails.length < BY.config.regConfig.formConfig.maxSecondaryEmailId) {
						$scope.basicProfileInfo.secondaryEmails.push("");
					}

					if ($scope.basicProfileInfo.secondaryEmails.length === BY.config.regConfig.formConfig.maxSecondaryEmailId) {
						$(".add-email").hide();
					}
				}

				//Delete profile Image
				$scope.deleteProfileImage = function() {
					$scope.profileImage = [];
					$scope.basicProfileInfo.profileImage = null;
				}

				//Delete gallery images
				$scope.deleteGalleryImage = function(img) {
					var imgIndex = $scope.galleryImages.indexOf(img);
					if (imgIndex > -1) {
						$scope.galleryImages.splice(imgIndex, 1);
					}
					imgIndex = $scope.basicProfileInfo.photoGalleryURLs.indexOf(img);
					if (imgIndex > -1) {
						$scope.basicProfileInfo.photoGalleryURLs.splice(imgIndex, 1);
					}
				}


				var systemTagList = {};
				var getSystemTagList = function(data) {
					//For a selected menu category, Add tags of menu hierarchy recursively to system tags
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

					//Add selected speciality tags to system tags
					angular.forEach($scope.filters, function(filter, index) {
						if (filter.selectedSpecialityName && filter.selectedSpeciality) {
							systemTagList[filter.selectedSpeciality.id] = filter.selectedSpeciality.tags;
							if ($scope.serviceProviderInfo.specialities[filter.selectedSpeciality.parentMenuId]) {
								$scope.serviceProviderInfo.specialities[filter.selectedSpeciality.parentMenuId].push(filter.selectedSpeciality);
							} else {
								$scope.serviceProviderInfo.specialities[filter.selectedSpeciality.parentMenuId] = [];
								$scope.serviceProviderInfo.specialities[filter.selectedSpeciality.parentMenuId].push(filter.selectedSpeciality);
							}

						} else {
							filter.selectedSpecialityName = null;
							filter.specialityError = true;
						}
					})

					return $.map(systemTagList, function(value, key) {
						return value;
					});
				}



				//Post individual form
				$scope.postUserProfile = function(isValidForm) {
					$(".by_btn_submit").prop("disabled", true);
					$scope.submitted = true;
					$scope.minCategoryError = false;
					$scope.websiteError = false;
					$scope.serviceProviderInfo.services = $.map($scope.selectedMenuList, function(value, key) {
						if (value && $rootScope.menuCategoryMap[value.id]) {
							return value.id;
						}
					});

					$scope.serviceProviderInfo.homeVisits = $('#homeVisit')[0].checked;
					$scope.basicProfileInfo.profileImage = $scope.profileImage.length > 0 ? $scope.profileImage[0] : $scope.basicProfileInfo.profileImage;
					$scope.basicProfileInfo.photoGalleryURLs = $scope.basicProfileInfo.photoGalleryURLs.concat($scope.galleryImages);

					$scope.profile.systemTags = getSystemTagList($scope.selectedMenuList);
					if ($scope.profile.systemTags.length === 0) {
						$scope.minCategoryError = true;
					}

					//var regex = /(?:[\w-]+\.)+[\w-]+([.(\w-)]{2,63}$)+/ ;
					var regex = /(?:)+([\w-])+(\.[a-z]{2,6}([-a-zA-Z0-9@:%_\+.~#?&!//=]*))+/;
					//var regex = /((?:https?\:\/\/|www\.)(?:[-a-z0-9]+\.)*[-a-z0-9]+.*)/i........... /(?:[\w-]+\.)+[\w-]+([.(com|.in|.org|.co.in)]{2,63}$)+;
					if ($scope.serviceProviderInfo && $scope.serviceProviderInfo.website && $scope.serviceProviderInfo.website.length > 0) {
						if (regex.exec($scope.serviceProviderInfo.website)) {
							$scope.serviceProviderInfo.website = regex.exec($scope.serviceProviderInfo.website)[0];
						} else {
							$scope.websiteError = true;
						}
					}

					$scope.basicProfileInfo.description = tinymce.get("registrationDescription").getContent();

					if (isValidForm.$invalid || $scope.minCategoryError || $scope.websiteError) {
						window.scrollTo(0, 0);
						$(".by_btn_submit").prop('disabled', false);
					} else {
						$scope.basicProfileInfo.secondaryPhoneNos = $.map($scope.basicProfileInfo.secondaryPhoneNos, function(value, key) {
							if (value && value !== "") {
								return value;
							}
						});

						$scope.basicProfileInfo.secondaryEmails = $.map($scope.basicProfileInfo.secondaryEmails, function(value, key) {
							if (value && value !== "") {
								return value;
							}
						});

						$scope.profile.featured = $scope.featured;
						if($scope.withdrawn == true){
							$scope.profile.status = 1;
						} else{
							$scope.profile.status = 0;
						}

						var userProfile = new UserProfile();
						angular.extend(userProfile, $scope.profile);
						console.log($scope.serviceProviderInfo.specialities);
						userProfile.$update({
							userId: $scope.userId
						}, function(profileOld) {
							console.log("success");
							$scope.submitted = false;
							$location.path('/userDetails/' + $scope.userId);
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