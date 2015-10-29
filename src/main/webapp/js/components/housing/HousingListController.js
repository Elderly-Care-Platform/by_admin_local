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
        
        $scope.lists = {}
        
        $http.get('/byadmin/api/v1/housing/list/cities'   
		).success(function (response, status, headers, config) {
			$scope.lists = response.data;
		}).error(function (data, status, headers, config) {    
			alert(status);
		});
        
        $scope.catlists = {}
        
        $http.get('/byadmin/api/v1/menu/getMenuById?id=55bcadaee4b08970a736784c'   
		).success(function (response, status, headers, config) {
			$scope.catlists = response.data.children;
		}).error(function (data, status, headers, config) {    
			alert(status);
		});
        
        $scope.filters = {
        	categoryFilter:null,
        	cityFilter:null,
            dateFilter:0,
    		dateStartRange:new Date(),
    		dateEndRange:new Date(),
    	}
        
        $scope.housingsByFilter = function housingsByFilter() {
        	var matchedtags = [];
        	var advancedTags;
        	for (var i = 0; i < $scope.catlists.length; i++) {
        		if($scope.catlists[i].id == $scope.filters.categoryFilter){
        			matchedtags = $scope.catlists[i].tags;
        		}
        	}
        	for (var j = 0; j < matchedtags.length; j++) {
        		advancedTags = matchedtags[j].id;
        	}
        	var dataObj = {
        		tags: advancedTags,
        		city : $scope.filters.cityFilter,
    		};	
        	
        	$http.get('/byadmin/api/v1/housing/list/all', {params: dataObj}   
			).success(function (response, status, headers, config) {
				vm.myHousingLists = response.data.content;
			}).error(function (data, status, headers, config) {    
				alert(status);
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





