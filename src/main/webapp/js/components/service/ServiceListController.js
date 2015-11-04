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
        
        $scope.cityLists = {}
        
        $http.get('/byadmin/api/v1/userProfile/list/cities'   
		).success(function (response, status, headers, config) {
			$scope.cityLists = response.data;
		}).error(function (data, status, headers, config) {    
			console.log(status);
		});
        
        $scope.catLists = {};
        var array = {};
        
        $http.get('/byadmin/api/v1/menu/getMenuById?id=55bcacf8e4b08970a7367849'   
		).success(function (response, status, headers, config) {
	        array = response.data.children;
	        var temp = [];
	        function getCategory(array){
	        	for (var i = 0; i < array.length; i++) {
	        		if((array[i].children == null || array[i].children.length == 0) && array[i].module == 1){
	        			temp.push(array[i].tags);
	        		}else{
	        			getCategory(array[i].children);
	        		}
	        	}
	        	return temp;
	        }
	        var temp1 = getCategory(array);
	        var temp2 = [];
	        for (var j = 0; j < temp1.length; j++) {
	        	temp2 = temp1[j];
	        	for (var k = 0; k < temp2.length; k++) {
	        		$scope.catLists[temp2[k].id] = temp2[k].name;
	        	}
        	}
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
        	if($scope.filters.categoryFilter == "null"){
        		tagValue = null;
        	}else{
        		tagValue = $scope.filters.categoryFilter;
        	}
        	
        	var statusFilterValue = $scope.filters.statusFilter;
        	var statusValue;
        	if(statusFilterValue == null){
        		statusValue = null;
        	}else if(statusFilterValue == "null"){
        		statusValue = null;
        	}else{
        		statusValue = $scope.filters.statusFilter;
        	}
        	
        	var serviceTypeFilterValue = $scope.filters.serviceTypeFilter;
        	var serviceTypeValue;
        	if(serviceTypeFilterValue == null){
        		serviceTypeValue = '4,7';
        	}else if(serviceTypeFilterValue == "null"){
        		serviceTypeValue = '4,7';
        	}else{
        		serviceTypeValue = $scope.filters.serviceTypeFilter;
        	}
        	
        	var startD = new Date();
			var endD = new Date();
			if($scope.filters.dateFilter == "null"){
				startD = null;
				endD = null;
			}
			else if($scope.filters.dateFilter == null){
				startD = null;
				endD = null;
			}
			else if($scope.filters.dateFilter == "0"){
				startD.setDate(startD.getDate());
				endD.setDate(endD.getDate());
			}
			else if($scope.filters.dateFilter == "1"){
				startD.setDate(startD.getDate() - 1);
				endD.setDate(endD.getDate() - 1);
			}else if($scope.filters.dateFilter == "2"){
				startD = $scope.filters.dateStartRange;
				endD = $scope.filters.dateEndRange;
			}
        	var startDt;
        	var endDt;
        	if(startD == null){
        		startDt = null;
        	}else{
        		startDt = startD.getTime();
        	}
        	if(endD == null){
        		endDt = null;
        	}else{
        		endDt = endD.getTime();
        	}
        	
        	var filterObj = {
        		tags: tagValue,
            	city: $scope.filters.cityFilter,
            	userTypes: serviceTypeValue,
            	status: statusValue,
            	startDate : startDt,
				endDate : endDt
        	};	
            	
            $http.get('/byadmin/api/v1/userProfile/list/services', {params: filterObj}   
    		).success(function (response, status, headers, config) {
    			vm.myServiceLists = response.data.content;
    		}).error(function (data, status, headers, config) {    
    			console.log(status);
    		});
        }
            
        ServiceList.getServiceLists().then(function(ServiceLists) {
        	vm.myServiceLists = ServiceLists;
        });
        
    }
    
    ServiceListFactory.$inject = ["$http"];
  
    function ServiceListFactory($http) {
    	return {
    		getServiceLists: function() {
    			var dataObj = {
    		        userTypes: '4,7'
    		    };	
    			return $http.get('/byadmin/api/v1/userProfile/list/services', {params: dataObj}).then(function(response) {
    				return response.data.data.content;
    			});
    		}
    	};
    }

  
}(angular));





