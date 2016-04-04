(function () {
    "use strict";   
    var HelperService = function ($http, $q) {
        var HelperMethods = {
            getSeptaTrains: function(Septa_secret){
                var deferObject_SeptaTrains;
                var SeptaTrains_Promise = $http.jsonp(Septa_secret.url);
                deferObject_SeptaTrains = deferObject_SeptaTrains || $q.defer();
                
                SeptaTrains_Promise.then(function(data){
                    deferObject_SeptaTrains.resolve(data);
                },
                function(error){ //error
                    deferObject_SeptaTrains.reject('There was a problem with Septa API');
                });
                
                return deferObject_SeptaTrains.promise;
            }
        };
        return HelperMethods;
    };
    
    HelperService.$inject = ['$http', '$q'];
    
    angular.module('appSepta')
	  .service('HelperService', HelperService);
    
}());
