(function () {
    "use strict";   
    var AirTableService = function ($http, $q) {
        var AirTableMethods = {
            getMyTrains: function(AirTable_secret){
                var deferObject_myTrains;
                var myTrains_promise = $http.get(AirTable_secret.url+'/Trains?callback=JSON_CALLBACK', {
                    headers : {
                        'Authorization' : AirTable_secret.apikey,
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
            intoLateTrains: function(AirTable_secret, ThisTrain){
                $http({
                      url : AirTable_secret.url+'/LateTrains', 
                      method : 'POST',
                      headers : {                              
                          'Authorization' : AirTable_secret.apikey,
                          'Content-Type' : 'application/json'
                      },
                      data : {
                          "fields" : {
                            "trainno" : ThisTrain.trainno,                            
                            "howLate" : ThisTrain.late+' mins.',
                            "nextStop" : ThisTrain.nextstop    
                          }
                      }
                    }).catch(function(response){
                        throw response.status;   
                })
            },
            removeLateTrains: function(AirTable_secret){
                //getting current trains in LateTrains table
                $http.get(AirTable_secret.url+'/LateTrains?callback=JSON_CALLBACK', {
                    headers : {
                        'Authorization' : AirTable_secret.apikey,
                        'Content-Type' : 'application/json'
                    }
                }).then(function(response){
                    var lateTrain = response.data;                    
//                    console.log(lateTrain.records[0].id);
//                    console.log(lateTrain.records.length);
                    
                    if(lateTrain.records.length>0){
                        for (var k=0,len=lateTrain.records.length; k<len; k++){
                            $http.delete(AirTable_secret.url+'/LateTrains/'+lateTrain.records[k].id, {
                                headers : {
                                    'Authorization' : AirTable_secret.apikey
                                }
                            });                                                
                        };
                    }
                });
            }
        };
        return AirTableMethods;
    };
    
    AirTableService.$inject = ['$http', '$q'];
    
    angular.module('appSepta')
	  .service('AirTableService', AirTableService);
    
}());
