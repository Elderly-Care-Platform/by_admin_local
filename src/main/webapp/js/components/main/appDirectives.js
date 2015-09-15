
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



