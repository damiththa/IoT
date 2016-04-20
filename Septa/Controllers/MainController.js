(function () {
    "use strict";
    var MainController = function ($scope, HelperService, TrainViewFactory, AirTableService, FireBaseFactory, $http, $timeout, $rootScope) {
        var trainno = '1111'; //temp value
        $scope.ThisTrain = null;   
        var TrainIsLate = false; //default value
        $scope.isLoading = true; //default value
        var lightOn = false;
        
        $scope.nowHour = moment().hour();
        $scope.today_dayOftheWeek = moment().day();
        $scope.IsWeekDay = (($scope.today_dayOftheWeek === 0) || ($scope.today_dayOftheWeek === 6)) ? false : true ;
        $scope.checkTimeSlot = moment($scope.nowHour).isBetween(7, 11) ? 'morning' : 'evening';
        
//        //NOTE :  doesn't need to be in init()
//        function init() {
//            $scope.ThisTrain = TrainViewFactory.getThisTrain(trainno);
//        }        
//        init();
        
        $scope.$on('secrets-loaded', function(){ //by listerning to broadcast, making sure secrets are loaded first
            $scope.keys = $rootScope.secrets.urls;
            console.log($scope.keys);  
                        
            if($scope.IsWeekDay){
                var myTrains_PromiseReturn = AirTableService.getMyTrains($scope.keys.AirTable);
                myTrains_PromiseReturn.then(function (data){
                    $scope.myTrains = data;    
                //    console.log($scope.myTrains.data);
                //    console.log($scope.myTrains.data.records[1].fields.timeSlot);
                //    console.log($scope.myTrains.data.records.length);
                    
                    $scope.TrainForNow = []; //Trains for THIS timeSlot accordingly
                    for(var a=0, len=$scope.myTrains.data.records.length; a<len; a++){
                        if($scope.myTrains.data.records[a].fields.timeSlot === $scope.checkTimeSlot){
                            $scope.TrainForNow.push($scope.myTrains.data.records[a].fields.trainno);
                        }
                    };
                    
                    // console.log($scope.TrainForNow);             
                    AirTableService.removeLateTrains($scope.keys.AirTable); //delete all trains from LateTrains AirTable
                    
                    var Trains_PromiseReturn = HelperService.getSeptaTrains($scope.keys.Septa); 
                    Trains_PromiseReturn.then(function(data){
                        var Trains_data = data;
                        var Trains = Trains_data.data.data;
                        // console.log(Trains);
                        
                        for(var b=0, l=$scope.TrainForNow.length; b<l; b++){
    //                        console.log(Trains);
                            
                            trainno = $scope.TrainForNow[b];
                            
                            $scope.ThisTrain = TrainViewFactory.getThisTrain(Trains, trainno);
                        //    console.log(trainno);
                        //    console.log($scope.ThisTrain);  
                            
                            //TEMP
                            // console.log($scope.ThisTrain);
                            // AirTableService.intoLateTrains($scope.keys.AirTable, $scope.ThisTrain); 

                            if($scope.ThisTrain){ //avoid nulls
                                if($scope.ThisTrain.late > 2){ //train late threshold (in minutes)
                                    lightOn = true;
                                    TrainIsLate = true;                                
                                    AirTableService.intoLateTrains($scope.keys.AirTable, $scope.ThisTrain); //Into LateTrain
                                    FireBaseFactory.intoFireBase($scope.ThisTrain); //Into FireBase 
                                    break;
                                };
                            };
                        };
                        
                        /* THIS IS GOOD
                        if(lightOn){        
                            //Trigger LittleBits CloudBits
                            $http({
                             url : $scope.keys.LittleBits.url, 
                             method : 'POST',
                             headers : {
                                 'Authorization' : $scope.keys.LittleBits.apikey,
                                 'Accept' : 'application/vnd.littlebits.v2+json',
                                 'Content-Type' : 'application/json'
                             }
                           }).then(function SuccesFunc(response) { //handle success                      
                             console.log('This is a success ');
                           }, function ErrorFunc(response) { //handle error                          
                             console.log('This is an error ');
                         });   
                        };
                        */                
                        
                        
    //                    //THIS IS GOOD
    //                    if(lightOn){                        
    //                      //Trigger LittleBits CloudBits    
    //                      $http({
    //                          url : 'https://api-http.littlebitscloud.cc/devices/00e04c0340b5/output?percent=50&duration_ms=5000', 
    //                          method : 'POST',
    //                          headers : {
    //                              'Authorization' : 'Bearer 75480d214b46ed685b139dc49ddaf7d1cbd0af94f585e31cd5f76ef5d7d908a4',
    //                              'Accept' : 'application/vnd.littlebits.v2+json',
    //                              'Content-Type' : 'application/json'
    //                          }
    //                        }).then(function SuccesFunc(response) { //handle success                      
    //                          console.log('This is a success ');
    //                        }, function ErrorFunc(response) { //handle error                          
    //                          console.log('This is an error ');
    //                      });
    //                        
    //                      //Trigger IFTTT and Maker to send notification    
    //                      $http({
    //                          url : 'https://maker.ifttt.com/trigger/TrainCheck/with/key/GJElXrQFbvHcF1OLmCK_S?value1='+$scope.ThisTrain.trainno+'&value2='+$scope.ThisTrain.late, 
    //                          method : 'POST',
    //                          headers : {                              
    //                              'Content-Type' : 'application/json'
    //                          }
    //                        }).then(function SuccesFunc(response) { //handle success                    
    //                          console.log('This is a success ');
    //                        }, function ErrorFunc(response) { //handle error                          
    //                          console.log('This is an error ');
    //                      });    
    //                    };
                        
                        $timeout(function() {
                            $scope.isLoading = false;
                            $scope.isLate = TrainIsLate;
                        }, 3500); 
                    });
                });
            };
        });
        
//        console.log($scope.nowHour);
//        console.log($scope.checkTimeSlot);        
//        console.log($scope.IsWeekDay);
//        console.log($scope.ThisTrain);
    };
    
    MainController.$inject = ['$scope', 'HelperService', 'TrainViewFactory', 'AirTableService', 'FireBaseFactory', '$http', '$timeout', '$rootScope'];
    
    angular.module('appSepta')
        .controller('MainController', MainController);
    
}());