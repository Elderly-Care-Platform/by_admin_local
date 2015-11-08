'use strict';

(function (angular) {
    'use strict';

    adminControllers
            .controller('HousingListController', HousingListController)
            .factory('HousingList', HousingListFactory);
    
    HousingListController.$inject = ['$scope', '$http', '$q', '$location', '$resource', 'DTOptionsBuilder', 'HousingList'];
    
    function HousingListController($scope, $http, $q, $location, $resource, DTOptionsBuilder, HousingList) {
        var vm = this;     
        
        if (localStorage.getItem("ADMIN_USER_ROLE") !== 'SUPER_USER' && localStorage.getItem("ADMIN_USER_ROLE") !== 'EDITOR') {
    		$location.path('/users/login');
    		return;
    	}
        
        vm.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withDisplayLength(10)
            .withOption("bAutoWidth", false)
        
        $scope.host = location.host;
        $scope.pathName = location.pathname;
        
        $scope.cityLists = {}
        
        $http.get($scope.pathName + 'api/v1/housing/list/cities'   
		).success(function (response, status, headers, config) {
			$scope.cityLists = response.data;
		}).error(function (data, status, headers, config) {    
			console.log(status);
		});
        
        $scope.categoryLists = {}
        var array = {};
        
        $http.get($scope.pathName + 'api/v1/menu/getMenuById?id=55bcadaee4b08970a736784c'   
		).success(function (response, status, headers, config) {
			array = response.data.children;
	        function getCategory(array){
	        	for (var i = 0; i < array.length; i++) {
	        		if(array[i].module == 2 && array[i].ancestorIds.length<3){
	        			if(array[i].children == null || array[i].children.length == 0){
	        				var categoryArray = {
	    	        			"name": array[i].displayMenuName, 
	    	        			"tags": array[i].tags
	    	        		}
	    	        		$scope.categoryLists[array[i].id] = categoryArray;
	        			}else{
		        			getCategory(array[i].children);
		        		}
	        		}
	        	}
	        }
	        getCategory(array);
		}).error(function (data, status, headers, config) {    
			console.log(status);
		});
        
        $scope.filters = {
        	categoryFilter:null,
        	cityFilter:null
    	}
        
        $scope.housingsByFilter = function housingsByFilter() {
        	var tagValue;
        	var selectedTagValue = [];
        	var categoryFilterValue = $scope.filters.categoryFilter;
        	if(categoryFilterValue == null || categoryFilterValue == "null"){
        		tagValue = null;
        	}else{
            	var selectedTag = $scope.categoryLists[categoryFilterValue];
            	selectedTagValue = selectedTag.tags;
        		for (var j = 0; j < selectedTagValue.length; j++) {
        			tagValue = selectedTagValue[j].id;
            	}
        	}
        	
        	var startDt;
        	var endDt;
        	if($scope.filters.dateStartRange == null){
        		startDt = null;
        	}else{
        		startDt = $scope.filters.dateStartRange.getTime();
        	}
        	if($scope.filters.dateEndRange == null){
        		endDt = null;
        	}else{
        		endDt = $scope.filters.dateEndRange.getTime();
        	}
        	var dataObj = {
        		tags: tagValue,
        		city : $scope.filters.cityFilter,
        		startDate : startDt,
				endDate : endDt
    		};	
        	
        	HousingList.getHousingLists(dataObj).then(function(HousingLists) {
            	vm.myHousingLists = HousingLists;
            });
        };
        
        var dataObj = {}
        HousingList.getHousingLists(dataObj).then(function(HousingLists) {
        	vm.myHousingLists = HousingLists;
        });
        
    }
    
    HousingListFactory.$inject = ["$http"];
  
    function HousingListFactory($http) {
    	return {
    		getHousingLists: function(dataObj) {
    			var pathName = location.pathname;
    			return $http.get(pathName + 'api/v1/housing/list/all', {params: dataObj} ).then(function(response) {
    				return response.data.data.content;
    			});
    		}
    	};
    }

  
}(angular));





