(function () {
    "use strict";
    var MainController = function ($scope, HelperService, TrainViewFactory, AirTableService, FireBaseFactory, $http, $timeout, $rootScope) {
        var trainno = '1111'; //temp value
        var trainHowLate = 4; //train late threshold (in minutes)
        $scope.ThisTrain = null;   
        var TrainIsLate = false; //default value
        $scope.isLoading = true; //default value
        var lightOn = false;
        
        $scope.nowHour = moment().hour();
        $scope.today_dayOftheWeek = moment().day();
        $scope.IsWeekDay = (($scope.today_dayOftheWeek === 0) || ($scope.today_dayOftheWeek === 6)) ? false : true ;
        $scope.checkTimeSlot = moment($scope.nowHour).isBetween(7, 11) ? 'morning' : 'evening';
        
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
                    // console.log($scope.TrainForNow.join(","));             
                    
                    AirTableService.removeLateTrains($scope.keys.AirTable); //delete all trains from LateTrains AirTable
                    
                    var Trains_PromiseReturn = HelperService.getSeptaTrains($scope.keys.Septa, $scope.TrainForNow.join(",")); 
                    Trains_PromiseReturn.then(function(data){
                        var Trains_data = data;
                        var Trains = Trains_data.data.data;
                        // console.log(Trains);
                        
                        for(var b=0, l=$scope.TrainForNow.length; b<l; b++){                         
                            trainno = $scope.TrainForNow[b];                            
                            $scope.ThisTrain = TrainViewFactory.getThisTrain(Trains, trainno);
                        //    console.log(trainno);
                        //    console.log($scope.ThisTrain);
                            
                            if($scope.ThisTrain){ //avoid nulls
                                if($scope.ThisTrain.late > trainHowLate){ 
                                    lightOn = true;
                                    TrainIsLate = true;                                
                                    AirTableService.intoLateTrains($scope.keys.AirTable, $scope.ThisTrain); //Into LateTrain
                                    FireBaseFactory.intoFireBase($scope.ThisTrain); //Into FireBase 
                                    break;
                                };
                            };
                        };

                        //Trigger LittleBits CloudBits
                        if(lightOn){ 
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
                             console.log('There was some trouble w/ LittleBits cloudBits');
                         });   
                        };
                        
                        $timeout(function() {
                            $scope.isLoading = false;
                            $scope.isLate = TrainIsLate;
                        }, 3500); 
                    });
                });
            };
        });
    };
    
    MainController.$inject = ['$scope', 'HelperService', 'TrainViewFactory', 'AirTableService', 'FireBaseFactory', '$http', '$timeout', '$rootScope'];
    
    angular.module('appSepta')
        .controller('MainController', MainController);
    
}());