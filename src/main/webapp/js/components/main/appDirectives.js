adminControllers.directive('autoComplete', function ($timeout) {
       
        return {
            scope: {
                options: '=?',
                details: '=?',
                onSelectCallback: '=?',
                obj: '=?',
                onChangeCallback: '=?'
            },
            link: function (scope, element, attrs) {
                var oldVal = scope.obj;
                element.autocomplete({
                    source: scope.options,
                    select: function (event, item) {
                        $timeout(function () {
                            element.trigger(event, item);
                            item.item.selected = true;
                            scope.onSelectCallback(item.item, scope.obj, oldVal);
                        }, 0);
                    },
                    change: function(event, item){
                        console.log(item);
                        if(scope.onChangeCallback){
                            scope.onChangeCallback(item.item, scope.obj, oldVal);
                        }
                    }
                });
            }
        };
    });

adminControllers.directive('formatAddress', function () {
        return {
            scope: {
                callback: '=?',
                formatAddress: '='
            },

            link: function (scope, element) {
                var formattedAddress = "", address = scope.formatAddress;

                if(address.streetAddress && address.streetAddress.trim().length > 0){
                   formattedAddress = address.streetAddress;
                }

                if(address.locality && address.locality.trim().length > 0 && formattedAddress.indexOf(address.locality)===-1){
                    if(formattedAddress.trim().length > 0){
                       formattedAddress = formattedAddress + ", "
                    }
                   formattedAddress = formattedAddress + address.locality;
                }

                if(address.city && address.city.trim().length > 0 && formattedAddress.indexOf(address.city)===-1){
                    if(formattedAddress.trim().length > 0){
                       formattedAddress = formattedAddress + ", "
                    }
                   formattedAddress = formattedAddress  + address.city;
                }

                if(address.country && address.country.trim().length > 0 && formattedAddress.indexOf(address.country)===-1){
                    if(formattedAddress.trim().length > 0){
                       formattedAddress = formattedAddress + ", "
                    }
                   formattedAddress = formattedAddress  + address.country;
                }

                if(address.zip && address.zip.trim().length > 0 && formattedAddress.indexOf(address.zip)===-1){
                    if(formattedAddress.trim().length > 0){
                       formattedAddress = formattedAddress + " - "
                    }
                   formattedAddress = formattedAddress  + address.zip;
                }

                if(formattedAddress.trim().length === 0){
                    scope.formatAddress.fullAddress = null;
                }else{
                    scope.formatAddress.fullAddress = formattedAddress;
                }

            }
        };
    });

adminControllers.directive('formValidation', function() {
        var EMAIL_REGEXP = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

        return {
            require: 'ngModel',
            restrict: '',
            link: function(scope, elm, attrs, ctrl) {
                // only apply the validator if ngModel is present and Angular has added the email validator
                if (ctrl && ctrl.$validators.email) {
                    // this will overwrite the default Angular email validator
                    ctrl.$validators.email = function(modelValue) {
                        return ctrl.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
                    };
                }
            }
        };
    });

adminControllers.directive('validateUserName', function(){
        return {
            restrict: '',
            link: function(scope, elm, attrs) {
                if(!attrs.validateUserName || attrs.validateUserName.trim()==="" || attrs.validateUserName==="null"){
                    scope.username = "Anonymous";
                }else{
                    scope.username = attrs.validateUserName;
                }
            }
        };
    });
    
adminControllers.directive('loadImage', function($q, $http, $timeout) {
        'use strict'

        var URL = window.URL || window.webkitURL;
        var uploadImageinServer = function (formData) {
            var deferred = $q.defer();
            return deferred.promise;
        };

        return {
            restrict: 'A',
            scope: {
                loadImage: '=',
                imgArray:'=?'
            },
            link: function postLink(scope, element, attrs, ctrl) {
                if(attrs.multiple){
                    scope.loadImage = scope.$parent.galleryImages || [];
                }

                element.bind('change', function (evt) {
                    if(attrs.multiple){
                        scope.loadImage = scope.$parent.galleryImages || [];
                    } else{
                        scope.loadImage = [];
                    }

                    var currentLength = scope.loadImage.length;
                    var files = evt.target.files;
                    for(var i = 0; i < files.length; i++) {
                        (function(val,idx){
                            scope.$apply(function() {
                                scope.loadImage.push({thumbnailImage:"", loading:true});
                            });
                            var formData = new FormData();
                            formData.append('image', files[val], files[val].name);


                            $http.post('UploadFile?transcoding=true', formData, {
                                transformRequest: angular.identity,
                                headers: {'Content-Type': undefined}
                            }).success(function (result) {
                                scope.loadImage.splice(idx+val, 1, result);
                            }).error(function (result) {
                                console.log("Upload profile image failed");
                            });
                        })(i,currentLength);
                    }
                });
            }
        };
    });


adminControllers.directive('byPagination', function () {
    return {
        scope: {
            obj: '=?',
            callback: '=?'

        },
        templateUrl: 'views/common/contentPagination.html',
        controller: function($scope){
            $scope.contentPagination = $scope.obj;
            $scope.maxPageNo = 5;
            $scope.selectedPageNo = 0;

            var firstPageIndex = 0, lastPageIndex = $scope.maxPageNo;
            var setPageArray = function(){
                $scope.pageArray = [];
                for(var i=firstPageIndex; i<=lastPageIndex-1; i++){
                    $scope.pageArray.push(i);
                }
            };


            var setPrevPageArr = function(){
                if(($scope.selectedPageNo+1) - $scope.maxPageNo > 0){
                    firstPageIndex = ($scope.selectedPageNo+1) - $scope.maxPageNo;
                    lastPageIndex = firstPageIndex + $scope.maxPageNo;
                }else {
                    firstPageIndex = 0;
                    lastPageIndex = Math.min($scope.maxPageNo, $scope.contentPagination.noOfPages);
                }
                setPageArray();
            };

            var getNextPageArray = function(){
                if($scope.contentPagination.noOfPages - $scope.selectedPageNo >= $scope.maxPageNo){
                    firstPageIndex = $scope.selectedPageNo;
                    lastPageIndex = Math.min(firstPageIndex + $scope.maxPageNo, $scope.contentPagination.noOfPages);

                }else{
                    firstPageIndex = $scope.contentPagination.noOfPages -  $scope.maxPageNo;
                    lastPageIndex = $scope.contentPagination.noOfPages;
                }
                setPageArray();

            };

            var updateNextPevLink = function(){
                if($scope.selectedPageNo === $scope.contentPagination.noOfPages-1){
                    $scope.nextDisabled = true;
                }else{
                    $scope.nextDisabled = false;
                }

                if($scope.selectedPageNo === 0) {
                    $scope.prevDisabled = true;
                }else{
                    $scope.prevDisabled = false;
                }
            }

            $scope.initPageArray = function(){
                if($scope.contentPagination.noOfPages > $scope.maxPageNo){
                    firstPageIndex = 0;
                    lastPageIndex = $scope.maxPageNo;
                }else{
                    firstPageIndex = 0;
                    lastPageIndex = $scope.contentPagination.noOfPages;
                }
                setPageArray();
                updateNextPevLink();
            };

            $scope.selectPage = function(pageNo){
                $scope.selectedPageNo = pageNo;
                $scope.callback($scope.selectedPageNo, $scope.contentPagination.pageSize);
                updateNextPevLink();
            };

            $scope.nextPageSet = function(pageNo){
                if(pageNo < $scope.contentPagination.noOfPages){
                    $scope.selectedPageNo = pageNo;
                    $scope.callback($scope.selectedPageNo, $scope.contentPagination.pageSize);
                    if(lastPageIndex < $scope.contentPagination.noOfPages){
                        getNextPageArray();
                    }
                    updateNextPevLink();
                }
            };

            $scope.previousPageSet = function(pageNo){
                if(pageNo >= 0){
                    $scope.selectedPageNo = pageNo;
                    $scope.callback($scope.selectedPageNo, $scope.contentPagination.pageSize);
                    if(firstPageIndex > 0){
                        setPrevPageArr();
                    }
                    updateNextPevLink();
                }

            };
        }
    };
});

adminControllers.directive('formValidation', function() {
    var EMAIL_REGEXP = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

    return {
        require: 'ngModel',
        restrict: '',
        link: function(scope, elm, attrs, ctrl) {
            // only apply the validator if ngModel is present and Angular has added the email validator
            if (ctrl && ctrl.$validators.email) {
                // this will overwrite the default Angular email validator
                ctrl.$validators.email = function(modelValue) {
                    return ctrl.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
                };
            }
        }
    };
});

