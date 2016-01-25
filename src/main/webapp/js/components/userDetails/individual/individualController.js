adminControllers
	.controller(
		'regIndividualCtrl', [
			'$scope',
			'$routeParams',
			'$location',
			'UserProfile',
			'$http',
			'$rootScope',
			function($scope, $routeParams, $location,
				UserProfile, $http, $rootScope) {
				$scope.userId = $scope.$parent.userId;
				$scope.profileImage = [];
				$scope.galleryImages = [];
				$scope.submitted = false;
				$scope.regConfig = BY.config.regConfig.indvUserRegConfig;
				

				if ($rootScope.menuCategoryMapByName[$scope.regConfig.medical_issues.fetchFromMenu]) {
					$scope.medicalIssuesOptions = $rootScope.menuCategoryMapByName[$scope.regConfig.medical_issues.fetchFromMenu].children;
				}

				if ($rootScope.menuCategoryMapByName[$scope.regConfig.hobbies.fetchFromMenu]) {
					$scope.hobbiesOptions = $rootScope.menuCategoryMapByName[$scope.regConfig.hobbies.fetchFromMenu].children;
				}

				$scope.interestsOptions = $rootScope.mainMenu;
				$scope.emotional_challenges = $scope.regConfig.emotional_challenges1;

				$scope.selectedLanguages = [];
				$scope.selectedMedicalIssues = [];
				$scope.selectedHobbies = [];
				$scope.selectedInterests = [];
				$scope.showOtherHobbies = false;
				$scope.showOtherInterest = false;
				$scope.showAddNewLang = false;

				$scope.showOtherHobby = function() {
					$scope.showOtherHobbies = true;
				};

				$scope.showOtherIntrst = function() {
					$scope.showOtherInterest = true;
				};

				$scope.googleLocationOptions = {
					country: "in",
					resetOnFocusOut: false
				};

				var editorInitCallback = function() {
					if (tinymce.get("registrationDescription") && $scope.basicProfileInfo && $scope.basicProfileInfo.description) {
						tinymce.get("registrationDescription").setContent($scope.basicProfileInfo.description);
					}
				}
				var tinyEditor = BYAdmin.addEditor({
					"editorTextArea": "registrationDescription"
				}, editorInitCallback);


				//Google location auto complete callback
				$scope.addressCallback = function(response) {
					$('#addressLocality').blur();
					$scope.address.city = "";
					$scope.address.locality = response.name;
					$scope.address.country = "";
					$scope.address.zip = "";

					for (var i = 0; i < response.address_components.length; i++) {
						if (response.address_components[i].types.length > 0) {
							if (response.address_components[i].types[0] == "locality") {
								$scope.address.city += response.address_components[i].long_name;
							} else if (response.address_components[i].types[0].indexOf("administrative_area_level_3") != -1) {
								$scope.address.city = response.address_components[i].long_name;
							} else if (response.address_components[i].types[0] == "country") {
								//this is the object you are looking for
								$scope.address.country = response.address_components[i].long_name;
							} else if (response.address_components[i].types[0] == "postal_code") {
								//this is the object you are looking for
								$scope.address.zip = response.address_components[i].long_name;
							} else if (response.address_components[i].types.indexOf("sublocality") != -1 && response.address_components[i].types.indexOf("political") != -1) {
								$scope.address.locality = response.address_components[i].long_name;
							}
						}

					}
					$scope.address.streetAddress = response.formatted_address;
				};


				//Get language options, create language map and create jquery auto complete specific language option array
				var getLanguages = function() {
					$scope.languageMap = {};
					$http.get("api/v1/by/getLanguages/")
						.success(function(response) {
							if (response) {
								$scope.languages = response.data;
								$.map($scope.languages, function(value, key) {
									return $scope.languageMap[value.name.toLowerCase()] = value;
								});

								$scope.langAutoComOptions = $.map($scope.languages, function(value, key) {
									return {
										label: value.name,
										value: value.name,
										obj: value
									};
								});

							}
						}).error(function(errorRes) {
							console.log(errorRes);
						});
				}

				//Prefill form with previously selected data
				var initRegForm = function() {
					$scope.curiousUser = false;
					$scope.basicProfileInfo = $scope.profile.basicProfileInfo;
					$scope.serviceProviderInfo = $scope.profile.serviceProviderInfo;
					$scope.individualInfo = $scope.profile.individualInfo;
					$scope.address = $scope.basicProfileInfo.primaryUserAddress;

					if ($scope.profile.userTypes && $scope.profile.userTypes.length > 0) {
						if ($scope.profile.userTypes.length === 1 && $scope.profile.userTypes[0] === 2) {
							$scope.curiousUser = true;
						}

						if ($scope.profile.userTypes.indexOf(0) > -1) {
							$scope.emotional_challenges = $scope.regConfig.emotional_challenges2;
						}
					}


					if (!$scope.individualInfo.salutation) {
						$scope.individualInfo.salutation = $scope.regConfig.salutations[0];
					}

					if (!$scope.individualInfo.occupation) {
						$scope.individualInfo.occupation = $scope.regConfig.occupation[0];
					}

					if (!$scope.individualInfo.maritalStatus) {
						$scope.individualInfo.maritalStatus = $scope.regConfig.maritalStatus[0];
					}

					if ($scope.basicProfileInfo.primaryUserAddress && $scope.basicProfileInfo.primaryUserAddress.country === null) {
						$scope.basicProfileInfo.primaryUserAddress.country = "India";
					}

					if ($scope.individualInfo.medicalIssues && $scope.individualInfo.medicalIssues.length > 0) {
						$scope.selectedMedicalIssues = $.map($scope.individualInfo.medicalIssues, function(value, key) {
							if (value) {
								return value.id;
							}
						});
					}

					if (!$scope.individualInfo.otherIssues) {
						$scope.individualInfo.otherIssues = [];
					}

					if (!$scope.individualInfo.otherInterests) {
						$scope.individualInfo.otherInterests = [];
					}

					if (!$scope.individualInfo.otherHobbies) {
						$scope.individualInfo.otherHobbies = [];
					}

					if ($scope.individualInfo.interests && $scope.individualInfo.interests.length > 0) {
						$scope.selectedInterests = $.map($scope.individualInfo.interests, function(value, key) {
							if (value) {
								return value.id;
							}
						});
					}

					if ($scope.individualInfo.hobbies && $scope.individualInfo.hobbies.length > 0) {
						$scope.selectedHobbies = $.map($scope.individualInfo.hobbies, function(value, key) {
							if (value) {
								return value.id;
							}
						});
					}

					if ($scope.individualInfo.language && $scope.individualInfo.language.length > 0) {
						$.map($scope.individualInfo.language, function(value, key) {
							return $scope.selectedLanguages.push(value.name);
						});

						if ($scope.selectedLanguages.length > 0) {
							$scope.showAddNewLang = false;
						}
					} else {
						$scope.showAddNewLang = true;
					}

					if (!$scope.individualInfo.emotionalIssues) {
						$scope.individualInfo.emotionalIssues = [];
					}

					if ($scope.individualInfo.dob) {
						var dob = new Date($scope.individualInfo.dob);
						$scope.individualInfo.dob = "" + (dob.getMonth() + 1) + "/" + dob.getDate() + "/" + dob.getFullYear();
					}


					$("#datepicker").datepicker({
						showOn: "button",
						buttonImage: "assets/img/icons/callender.png",
						buttonImageOnly: true,
						buttonText: "Select date",
						changeMonth: true,
						changeYear: true,
						yearRange: "1900:2015",
						maxDate: "0D"
					});
					editorInitCallback();
					getLanguages();
				};

				//initialize data for individual registration
				$scope.initIndvRegData = function() {
					//Initialize individual registration
					if ($scope.$parent.profile) {
						$scope.profile = $scope.$parent.profile;
						initRegForm();
					} else {
						$scope.profile = UserProfile.get({
							userId: $scope.userId
						}, function(profile) {
							$scope.profile = profile.data;
							initRegForm();
						});
					}
				};


				//Select gender based on salutation
				$scope.updateGenderOption = function() {
					$scope.individualInfo.gender = $scope.regConfig.showGenderOptions[$scope.individualInfo.salutation][0];
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
				};


				$scope.langSelectCallback = function(autoCompleteOption, userInput, oldVal) {
					//{label:value.name, value:value.name, obj:value}
					var selectedLang, selectedLangIdx, deletedLang, deletedLangIdx;
					if (autoCompleteOption) {
						selectedLang = autoCompleteOption.label;
						selectedLangIdx = $scope.selectedLanguages.indexOf(selectedLang);
					} else if (userInput) {
						if ($scope.languageMap[userInput.toLowerCase()]) {
							selectedLang = $scope.languageMap[userInput.toLowerCase()].name;
							selectedLangIdx = $scope.selectedLanguages.indexOf(selectedLang);
						}

					}
					if (oldVal) {
						if (!selectedLang || selectedLang !== oldVal) {
							deletedLang = oldVal,
								deletedLangIdx = $scope.selectedLanguages.indexOf(deletedLang);
						}
						if (deletedLangIdx > -1) {
							$scope.selectedLanguages.splice(deletedLangIdx, 1);
						}
					}

					if (selectedLangIdx && selectedLangIdx === -1) {
						$scope.selectedLanguages.push(selectedLang);
					}

					$("#langField").val("");
					if ($scope.selectedLanguages.length > 0) {
						$scope.showAddNewLang = false;
					} else {
						$scope.showAddNewLang = true;
					}
					$scope.$apply();
				};

				$scope.addLangField = function() {
					$scope.showAddNewLang = true;
				};

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

				$scope.selectMedicalIssue = function(option) {
					if ($scope.selectedMedicalIssues && $scope.selectedMedicalIssues.indexOf(option.id) > -1) {
						$scope.selectedMedicalIssues.splice($scope.selectedMedicalIssues.indexOf(option.id), 1);
					} else {
						$scope.selectedMedicalIssues.push(option.id);
					}
				};

				$scope.selectHobbies = function(option) {
					if ($scope.selectedHobbies && $scope.selectedHobbies.indexOf(option.id) > -1) {
						$scope.selectedHobbies.splice($scope.selectedHobbies.indexOf(option.id), 1);
					} else {
						$scope.selectedHobbies.push(option.id);
					}
				};

				$scope.selectEmotionalIssue = function(option) {
					var index = -1;
					if ($scope.individualInfo.emotionalIssues && $scope.individualInfo.emotionalIssues.length > 0) {
						index = $scope.individualInfo.emotionalIssues.indexOf(option);
					} else {
						$scope.individualInfo.emotionalIssues = [];
					}

					if (index > -1) {
						$scope.individualInfo.emotionalIssues.splice($scope.individualInfo.emotionalIssues.indexOf(option), 1);
					} else {
						$scope.individualInfo.emotionalIssues.push(option);
					}

				};


				$scope.selectTopicOfInterest = function(option) {
					if ($scope.selectedInterests && $scope.selectedInterests.indexOf(option.id) > -1) {
						$scope.selectedInterests.splice($scope.selectedInterests.indexOf(option.id), 1);
					} else {
						$scope.selectedInterests.push(option.id);
					}
				};

				//Delete profile Image
				$scope.deleteProfileImage = function() {
					$scope.profileImage = [];
					$scope.basicProfileInfo.profileImage = null;
				};

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
				};

				// Default avatar
				$scope.selectDefaultImage = function(url) {
					$scope.basicProfileInfo.profileImage = {}
					$scope.basicProfileInfo.profileImage.thumbnailImage = url;
					$scope.basicProfileInfo.profileImage.titleImage = url;
					$scope.profileImage = [];
				};


				//Post individual form
				$scope.postUserProfile = function(isValidForm) {
					$(".by_btn_submit").prop("disabled", true);
					$scope.submitted = true;
					$scope.basicProfileInfo.profileImage = $scope.profileImage.length > 0 ? $scope.profileImage[0] : $scope.basicProfileInfo.profileImage;
					$scope.basicProfileInfo.photoGalleryURLs = $scope.basicProfileInfo.photoGalleryURLs.concat($scope.galleryImages);

					$scope.basicProfileInfo.description = tinymce.get("registrationDescription").getContent();

					if ($scope.selectedLanguages.length > 0) {
						$scope.individualInfo.language = $.map($scope.selectedLanguages, function(value, key) {
							return $scope.languageMap[value.toLowerCase()];
						});
					} else {
						$scope.individualInfo.language = [];
					}

					if (!$scope.individualInfo.otherInterests[0] || $scope.individualInfo.otherInterests[0].trim().length == 0) {
						$scope.individualInfo.otherInterests = [];
					}

					if (!$scope.individualInfo.otherHobbies[0] || $scope.individualInfo.otherHobbies[0].trim().length == 0) {
						$scope.individualInfo.otherHobbies = [];
					}

					if ($scope.individualInfo.dob) {
						$scope.individualInfo.dob = (new Date($scope.individualInfo.dob)).getTime();
					}

					$scope.individualInfo.medicalIssues = $.map($scope.selectedMedicalIssues, function(value, key) {
						return $rootScope.menuCategoryMap[value];
					});

					$scope.individualInfo.interests = $.map($scope.selectedInterests, function(value, key) {
						return $rootScope.menuCategoryMap[value];
					});

					$scope.individualInfo.hobbies = $.map($scope.selectedHobbies, function(value, key) {
						return $rootScope.menuCategoryMap[value];
					});


					if (isValidForm.$invalid || $scope.minCategoryError) {
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

						var userProfile = new UserProfile();
						angular.extend(userProfile, $scope.profile);
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