(function () {
    "use strict";
    var MainController = function ($scope, HelperService, TrainViewFactory, $http, $timeout) {
        var trainno = '1111'; //temp value
        $scope.ThisTrain = null;   
        var TrainIsLate = false; //default value
        $scope.isLoading = true; //default value
        var lightOn = false;
        
        $scope.nowHour = moment().hour();
        $scope.today_dayOftheWeek = moment().day();
        $scope.IsWeekDay = (($scope.today_dayOftheWeek === 0) || ($scope.today_dayOftheWeek === 6)) ? false : true ;
        $scope.checkTimeSlot = moment($scope.nowHour).isBetween(8, 11) ? 'morning' : 'evening';
        
//        //NOTE :  doesn't need to be in init()
//        function init() {
//            $scope.ThisTrain = TrainViewFactory.getThisTrain(trainno);
//        }        
//        init();
        
        if($scope.IsWeekDay){
            var myTrains_PromiseReturn = HelperService.getMyTrains();
            myTrains_PromiseReturn.then(function (data){
                $scope.myTrains = data;    
//                console.log($scope.myTrains);
                
                $scope.TrainForNow = []; //Trains for THIS timeSlot accordingly
                for(var a=0, len=$scope.myTrains.data.length; a<len; a++){
                    if($scope.myTrains.data[a].timeSlot === $scope.checkTimeSlot){
                        $scope.TrainForNow.push($scope.myTrains.data[a].trainno);
                    }
                };
                
//                console.log($scope.TrainForNow);
                                
                var Trains_PromiseReturn = HelperService.getSeptaTrains(); 
                Trains_PromiseReturn.then(function(data){
                    var Trains_data = data;
                    var Trains = Trains_data.data;
                    //console.log(Trains);
                    
                    for(var b=0, l=$scope.TrainForNow.length; b<l; b++){
                        console.log(Trains);
                        
                        trainno = $scope.TrainForNow[b];
                        
                        $scope.ThisTrain = TrainViewFactory.getThisTrain(Trains, trainno);
                        console.log($scope.ThisTrain);  

                        if($scope.ThisTrain){ //avoid nulls
                            if($scope.ThisTrain.late > 2){ //train late threshold (in minutes)
                                lightOn = true;
                                TrainIsLate = true;
                                break;
                            };
                        };
                    };
                    
                    TEMP
                    $http({
                          url : 'https://maker.ifttt.com/trigger/TrainCheck/with/key/GJElXrQFbvHcF1OLmCK_S', 
                          method : 'POST',
                          headers : {                              
                              'Content-Type' : 'application/json'
                          },
                          data : {
                              'value1' : '123', //$scope.ThisTrain.trainno,
                              'value2' : '5' //$scope.ThisTrain.late
                          }
                        }).then(function SuccesFunc(response) { //handle success                    
                          console.log('This is a success ');
                        }, function ErrorFunc(response) { //handle error                          
                          console.log('This is an error ');
                      });
                    
                    
                    
                    
                    //console.log(lightOn);
                    if(lightOn){                      
                        
//                      THIS IS GOOD
                        //Trigger LittleBits CloudBits    
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
//                      //Trigger IFTTT and Maker to send notification    
//                      $http({
//                          url : 'https://maker.ifttt.com/trigger/TrainCheck/with/key/GJElXrQFbvHcF1OLmCK_S', 
//                          method : 'POST',
//                          headers : {                              
//                              'Content-Type' : 'application/json'
//                          },
//                          data : {
//                              'value1' : '123', //$scope.ThisTrain.trainno,
//                              'value2' : '5' //$scope.ThisTrain.late
//                          }
//                        }).then(function SuccesFunc(response) { //handle success                    
//                          console.log('This is a success ');
//                        }, function ErrorFunc(response) { //handle error                          
//                          console.log('This is an error ');
//                      });    
                    };
                    
                    $timeout(function() {
                        $scope.isLoading = false;
                        $scope.isLate = TrainIsLate;
                    }, 3500); 

                    
//                    $scope.isLate = function(){
//                        return TrainIsLate;
//                    };
                    
                });
            });
        };
        
//        console.log($scope.nowHour);
//        console.log($scope.checkTimeSlot);        
//        console.log($scope.IsWeekDay);
//        console.log($scope.ThisTrain);
    };
    
    MainController.$inject = ['$scope', 'HelperService', 'TrainViewFactory', '$http', '$timeout'];
    
    angular.module('appSepta')
        .controller('MainController', MainController);
    
}());