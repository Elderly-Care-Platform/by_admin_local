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
            
        $scope.cityLists = {}
        
        $http.get('/byadmin/api/v1/housing/list/cities'   
		).success(function (response, status, headers, config) {
			$scope.cityLists = response.data;
		}).error(function (data, status, headers, config) {    
			console.log(status);
		});
        
        $scope.catLists = {}
        
        $http.get('/byadmin/api/v1/menu/getMenuById?id=55bcadaee4b08970a736784c'   
		).success(function (response, status, headers, config) {
			$scope.catLists = response.data.children;
		}).error(function (data, status, headers, config) {    
			console.log(status);
		});
        
        $scope.filters = {
        	categoryFilter:null,
        	cityFilter:null
    	}
        
        $scope.housingsByFilter = function housingsByFilter() {
        	var matchedtags = [];
        	var advancedTags;
        	for (var i = 0; i < $scope.catLists.length; i++) {
        		if($scope.catLists[i].id == $scope.filters.categoryFilter){
        			matchedtags = $scope.catLists[i].tags;
        			break;
        		}
        	}
        	for (var j = 0; j < matchedtags.length; j++) {
        		advancedTags = matchedtags[j].id;
        	}
        	var startD = $scope.filters.dateStartRange;
        	var endD = $scope.filters.dateEndRange;
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
        	var dataObj = {
        		tags: advancedTags,
        		city : $scope.filters.cityFilter,
        		startDate : startDt,
				endDate : endDt
    		};	
        	
        	$http.get('/byadmin/api/v1/housing/list/all', {params: dataObj}   
			).success(function (response, status, headers, config) {
				vm.myHousingLists = response.data.content;
			}).error(function (data, status, headers, config) {    
				console.log(status);
			});
        };
        
        
        HousingList.getHousingLists().then(function(HousingLists) {
        	vm.myHousingLists = HousingLists;
        });
        
    }
    
    HousingListFactory.$inject = ["$http"];
  
    function HousingListFactory($http) {
    	return {
    		getHousingLists: function() {
    			return $http.get('/byadmin/api/v1/housing/list/all').then(function(response) {
    				return response.data.data.content;
    			});
    		}
    	};
    }

  
}(angular));





