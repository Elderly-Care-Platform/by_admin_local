'use strict';

(function (angular) {
    'use strict';

    adminControllers
            .controller('ServiceListController', ServiceListController)
            .factory('ServiceList', ServiceListFactory);
    
    ServiceListController.$inject = ['$scope', '$http', '$q', '$location', '$resource', 'DTOptionsBuilder', 'ServiceList'];

    function ServiceListController($scope, $http, $q, $location, $resource, DTOptionsBuilder, ServiceList) {
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
        
        $http.get($scope.pathName + 'api/v1/userProfile/list/cities'   
		).success(function (response, status, headers, config) {
			$scope.cityLists = response.data;
		}).error(function (data, status, headers, config) {    
			console.log(status);
		});
        
        $scope.categoryLists = {};
        var array = {};
        $http.get($scope.pathName + 'api/v1/menu/getMenuById?id=56406cd03e60f5b66f62df26'
		).success(function (response, status, headers, config) {
	        array = response.data.children;
	        function getCategory(array){
	        	for (var i = 0; i < array.length; i++) {
	        		if(array[i].module == 1 && array[i].ancestorIds.length<3){
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
            cityFilter:null,
            serviceTypeFilter:null,
            statusFilter: null, 
            dateFilter:null,
        }
        
        $scope.servicesByFilter = function servicesByFilter() {
        	var tagValue;
        	var selectedTagValue = [];
        	var categoryFilterValue = $scope.filters.categoryFilter;
        	if(categoryFilterValue == null || categoryFilterValue == "null"){
        		tagValue = null;
        	}else{
            	selectedTagValue = $scope.categoryLists[categoryFilterValue].tags;
        		for (var j = 0; j < selectedTagValue.length; j++) {
        			tagValue = selectedTagValue[j].id;
            	}
        	}
        	
        	var statusFilterValue = $scope.filters.statusFilter;
        	var statusValue;
        	if(statusFilterValue == null || statusFilterValue == "null"){
        		statusValue = null;
        	}else{
        		statusValue = $scope.filters.statusFilter;
        	}
        	
        	var serviceTypeFilterValue = $scope.filters.serviceTypeFilter;
        	var serviceTypeValue;
        	if(serviceTypeFilterValue == null || serviceTypeFilterValue == "null"){
        		serviceTypeValue = '8,7';
        	}else{
        		serviceTypeValue = $scope.filters.serviceTypeFilter;
        	}
        	
        	var startDate = new Date();
			var endDate = new Date();
			
			if($scope.filters.dateFilter == null || $scope.filters.dateFilter == "null"){
				startDate = null;
				endDate = null;
			}
			else if($scope.filters.dateFilter == "0"){
				startDate.setDate(startDate.getDate());
				endDate.setDate(endDate.getDate());
			}
			else if($scope.filters.dateFilter == "1"){
				startDate.setDate(startDate.getDate() - 1);
				endDate.setDate(endDate.getDate() - 1);
			}else if($scope.filters.dateFilter == "2"){
				startDate = $scope.filters.dateStartRange;
				endDate = $scope.filters.dateEndRange;
			}

        	if(startDate == null){
        		startDate = null;
        	}else{
        		startDate = startDate.getTime();
        	}
        	if(endDate == null){
        		endDate = null;
        	}else{
        		endDate = endDate.getTime();
        	}
        	
        	var filterObj = {
        		tags: tagValue,
            	city: $scope.filters.cityFilter,
            	userTypes: serviceTypeValue,
            	withdrawStatus : $scope.filters.withdrawFilter,
            	status: statusValue,
            	startDate : startDate,
				endDate : endDate
        	};	
        	
        	ServiceList.getServiceLists(filterObj).then(function(ServiceLists) {
            	vm.myServiceLists = ServiceLists;
            });
            	
        }
        
        var dataObj = {
        	userTypes: '8,7',
        	withdrawStatus: 0
		}   
        
        ServiceList.getServiceLists(dataObj).then(function(ServiceLists) {
        	vm.myServiceLists = ServiceLists;
        });
        
    }
    
    ServiceListFactory.$inject = ["$http"];
  
    function ServiceListFactory($http) {
    	return {
    		getServiceLists: function(filterObj) {	
    			var pathName = location.pathname;
    			return $http.get(pathName + 'api/v1/userProfile/list/services', {params: filterObj}).then(function(response) {
    				return response.data.data.content;
    			});
    		}
    	};
    }

  
}(angular));





