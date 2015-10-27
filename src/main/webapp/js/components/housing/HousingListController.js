'use strict';

(function (angular) {
    'use strict';

    adminControllers
            .controller('HousingListController', HousingListController)
            .factory('HousingList', HousingListFactory);
    
    HousingListController.$inject = ['$scope', '$q', '$location', '$resource', 'DTOptionsBuilder', 'HousingList'];

    function HousingListController($scope, $q, $location, $resource, DTOptionsBuilder, HousingList) {
        var vm = this;     
        
        if (localStorage.getItem("ADMIN_USER_ROLE") !== 'SUPER_USER' && localStorage.getItem("ADMIN_USER_ROLE") !== 'EDITOR') {
    		$location.path('/users/login');
    		return;
    	}
        
        $scope.filters = {
				cityFilter:0,
				dateFilter:0,
				dateStartRange:new Date(),
				dateEndRange:new Date(),
			}
        
        vm.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withDisplayLength(10)
        
        HousingList.getHousingLists().then(function(HousingLists) {
          vm.myHousingLists = HousingLists;
        });
    }
    
  HousingListFactory.$inject = ["$http"];
  
  function HousingListFactory($http) {
   return {
     getHousingLists: function() {
       return $http.get('/byadmin/api/v1/housing/list/all').then(function(response) {
         console.log(response.data.data.content);
         return response.data.data.content;
       });
     }
   };
  }
  
}(angular));





