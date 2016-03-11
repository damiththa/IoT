(function () {
    "use strict";   
    var HelperService = function ($http, $q) {
        var HelperMethods = {
            getMyTrains: function(){
                var deferObject_myTrains;
                var myTrains_promise = $http.get('https://api.airtable.com/v0/app6bRhZ46dwM5aJJ/Trains?callback=JSON_CALLBACK', {
                    headers : {
                        'Authorization' : 'Bearer keyDH7kBvN03bIM3o',
                        'Content-Type' : 'application/json'
                    }
                });
//                var myTrains_promise = $http.get('json/myTrains.json'); to use a local json file
                deferObject_myTrains = deferObject_myTrains || $q.defer();
                
                myTrains_promise.then(function(data){
                    deferObject_myTrains.resolve(data);
                });
                
                return deferObject_myTrains.promise;
            },
            getSeptaTrains: function(){
                var deferObject_SeptaTrains;
                var SeptaTrains_Promise = $http.jsonp('http://www3.septa.org/hackathon/TrainView?callback=JSON_CALLBACK');
                deferObject_SeptaTrains = deferObject_SeptaTrains || $q.defer();
                
                SeptaTrains_Promise.then(function(data){
                    deferObject_SeptaTrains.resolve(data);
                },
                function(error){ //error
                    deferObject_SeptaTrains.reject('There was a problem with Septa API');
                });
                
                return deferObject_SeptaTrains.promise;
            },
            updateAirTable: function(ThisTrain){
                $http({
                      url : 'https://api.airtable.com/v0/app6bRhZ46dwM5aJJ/LateTrainsLog', 
                      method : 'POST',
                      headers : {                              
                          'Authorization' : 'Bearer keyDH7kBvN03bIM3o',
                          'Content-Type' : 'application/json'
                      },
                      data : {
                          "fields" : {
                            "trainno" : ThisTrain.trainno,                            
                            "howLate" : ThisTrain.late+' mins.'   
                          }
                      }
                    }).catch(function(response){
                        throw response.status;   
                })
            }
        };
        return HelperMethods;
    };
    
    HelperService.$inject = ['$http', '$q'];
    
    angular.module('appSepta')
	  .service('HelperService', HelperService);
    
}());
