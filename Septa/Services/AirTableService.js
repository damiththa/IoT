(function () {
    "use strict";   
    var AirTableService = function ($http, $q) {
        var AirTableMethods = {
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
            intoLateTrains: function(ThisTrain){
                $http({
                      url : 'https://api.airtable.com/v0/app6bRhZ46dwM5aJJ/LateTrains', 
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
            },
            removeLateTrains: function(){
                //getting current trains in LateTrains table
                $http.get('https://api.airtable.com/v0/app6bRhZ46dwM5aJJ/LateTrains?callback=JSON_CALLBACK', {
                    headers : {
                        'Authorization' : 'Bearer keyDH7kBvN03bIM3o',
                        'Content-Type' : 'application/json'
                    }
                }).then(function(response){
                    var lateTrain = response.data;                    
                    console.log(lateTrain.records[0].id);
                    console.log(lateTrain.records.length);
                           
                    for (var k=0,len=lateTrain.records.length; k<len; k++){
                        $http.delete('https://api.airtable.com/v0/app6bRhZ46dwM5aJJ/LateTrains/'+lateTrain.records[k].id, {
                            headers : {
                                'Authorization' : 'Bearer keyDH7kBvN03bIM3o',
                            }
                        });                                                
                    };
                })
            }
        };
        return AirTableMethods;
    };
    
    AirTableService.$inject = ['$http', '$q'];
    
    angular.module('appSepta')
	  .service('AirTableService', AirTableService);
    
}());
