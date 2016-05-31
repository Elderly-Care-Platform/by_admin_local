adminControllers
    .controller(
        'regHousingAddCtrl', [
            '$scope',
            '$routeParams',
            '$location',
            'UserProfile',
            '$http',
            '$rootScope',
            function($scope, $routeParams, $location,
                UserProfile, $http, $rootScope) {
                $scope.profileImage = [];
                $scope.galleryImages = [];
                $scope.submitted = false;
                $scope.websiteError = false;
                //$scope.categoryOptions = $rootScope.menuCategoryMapByName[BY.config.regConfig.housingConfig.fetchFromMenu].children;
                $scope.facility = $scope.$parent.facility;
                $scope.selectedMenuList = {};

                

                

                var editorInitCallback = function() {
                    if (tinymce.get("facilityDescription") && $scope.facility && $scope.facility.description) {
                        tinymce.get("facilityDescription").setContent($scope.facility.description);
                    }
                }

                $scope.addEditor = function() {
                    var tinyEditor = BYAdmin.addEditor({
                        "editorTextArea": "facilityDescription"
                    }, editorInitCallback);
                };

                var initialize = function() {
                    if (!$scope.facility || !$scope.facility.tier) {
                        $scope.facility.tier = $scope.regConfig.facilityType[0];
                    }

                    $scope.selectedMenuList[BY.config.regConfig.seniorLiving.id] = $rootScope.menuCategoryMap[BY.config.regConfig.seniorLiving.id];
                    editorInitCallback();
                };

                initialize();

                $scope.selectTag = function(event, category) {
                    if (event.target.checked) {
                        $scope.selectedMenuList[category.id] = category;
                        if (category.parentMenuId && $scope.selectedMenuList[category.parentMenuId]) {
                            delete $scope.selectedMenuList[category.parentMenuId];
                        }
                    } else {
                        delete $scope.selectedMenuList[category.id];
                    }
                };

               

                //Get location details based on pin code
                $scope.getLocationByPincode = function(element) {
                    var element = document.getElementById("zipcode");
                    $scope.facility.primaryAddress.city = "";
                    $scope.facility.primaryAddress.locality = "";
                    $scope.facility.primaryAddress.country = "";
                    $http.get("api/v1/location/getLocationByPincode?pincode=" + $scope.facility.primaryAddress.zip)
                        .success(function(response) {
                            if (response) {
                                $scope.facility.primaryAddress.city = response.districtname;
                                $scope.facility.primaryAddress.locality = response.officename;
                                $scope.facility.primaryAddress.streetAddress = response.officename + ", Distt: " + response.districtname + " , State: " + response.statename;
                                $scope.facility.primaryAddress.country = "India";
                            }
                        });
                }

                $scope.options = {
                    country: "in",
                    resetOnFocusOut: false
                };


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
                    if ($scope.facility.secondaryPhoneNos.length < BY.config.regConfig.formConfig.maxSecondaryPhoneNos) {
                        $scope.facility.secondaryPhoneNos.push("");
                    }

                    if ($scope.facility.secondaryPhoneNos.length === BY.config.regConfig.formConfig.maxSecondaryPhoneNos) {
                        $(".add-phone").hide();
                    }
                }

                //Add secondary email details
                $scope.addEmail = function() {
                    //var email = {value:""};
                    if ($scope.facility.secondaryEmails.length < BY.config.regConfig.formConfig.maxSecondaryEmailId) {
                        $scope.facility.secondaryEmails.push("");
                    }

                    if ($scope.facility.secondaryEmails.length === BY.config.regConfig.formConfig.maxSecondaryEmailId) {
                        $(".add-email").hide();
                    }
                }


                //Delete profile Image
                $scope.deleteProfileImage = function() {
                    $scope.profileImage = [];
                    $scope.facility.profileImage = null;
                };

                //Delete gallery images
                $scope.deleteGalleryImage = function(img) {
                    var imgIndex = $scope.galleryImages.indexOf(img);
                    if (imgIndex > -1) {
                        $scope.galleryImages.splice(imgIndex, 1);
                    }
                    imgIndex = $scope.facility.photoGalleryURLs.indexOf(img);
                    if (imgIndex > -1) {
                        $scope.facility.photoGalleryURLs.splice(imgIndex, 1);
                    }
                };

                var systemTagList = {};
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
                }

                $scope.postUserProfile = function(isValidForm, addAnotherFacility) {
                    $(".by_btn_submit").prop("disabled", true);
                    $scope.submitted = true;
                    $scope.minCategoryError = false;
                    $scope.websiteError = false;
                    $scope.facility.profileImage = $scope.profileImage.length > 0 ? $scope.profileImage[0] : $scope.facility.profileImage;
                    $scope.facility.photoGalleryURLs = $scope.facility.photoGalleryURLs.concat($scope.galleryImages);
                    $scope.facility.description = tinymce.get("facilityDescription").getContent();

                    $scope.facility.categoriesId = $.map($scope.selectedMenuList, function(value, key) {
                        if (value && $rootScope.menuCategoryMap[value.id]) {
                            return value.id;
                        }
                    });

                    $scope.facility.systemTags = getSystemTagList($scope.selectedMenuList);

                    var regex = /(?:)+([\w-])+(\.[a-z]{2,6}([-a-zA-Z0-9@:%_\+.~#?&!//=]*))+/;
                    if ($scope.facility && $scope.facility.website && $scope.facility.website.length > 0) {
                        if (regex.exec($scope.facility.website)) {
                            $scope.facility.website = regex.exec($scope.facility.website)[0];
                        } else {
                            $scope.websiteError = true;
                        }
                    }

                    
                    if($scope.facility.status == true){
                        $scope.facility.status = 1;
                    } else{
                        $scope.facility.status = 0;
                    }

                    if ($scope.facility.systemTags.length === 0) {
                        $scope.minCategoryError = true;
                    }

                    if (isValidForm.$invalid || $scope.minCategoryError || $scope.websiteError) {
                        window.scrollTo(0, 0);
                        $(".by_btn_submit").prop('disabled', false);
                    } else {
                        $scope.facility.secondaryPhoneNos = $.map($scope.facility.secondaryPhoneNos, function(value, key) {
                            if (value && value !== "") {
                                return value;
                            }
                        });

                        $scope.facility.secondaryEmails = $.map($scope.facility.secondaryEmails, function(value, key) {
                            if (value && value !== "") {
                                return value;
                            }
                        });
                        $scope.$parent.postUserProfile(isValidForm, addAnotherFacility);
                    }
                };
            }

        ]);