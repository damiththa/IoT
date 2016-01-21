(function () {
    "use strict";
    var MainController = function ($scope, HelperService, TrainViewFactory, $http) {
        var trainno = '1111'; //temp value
        $scope.ThisTrain = null;   
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
        
        //Testing SEPTA call back
        var AAA = HelperService.getSeptaTrains();
            AAA.then(function (data){
                $scope.BBB = data;  
                console.log($scope.BBB);
            });
        
        
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
                
                for(var b=0, l=$scope.TrainForNow.length; b<l; b++){
                    trainno = $scope.TrainForNow[b];
                    $scope.ThisTrain = TrainViewFactory.getThisTrain(trainno);
//                    console.log($scope.ThisTrain);                    
                    
                    if($scope.ThisTrain){ //avoid nulls
                        if($scope.ThisTrain.late > 3){ //train late threshold (in minutes)
                            lightOn = true;
                            break;
                        };
                    };
                };
                
//                console.log(lightOn);
                if(lightOn){
                    console.log('Train is LATE ');
                    //LittleBits post
                    $http({
                        url: 'https://api-http.littlebitscloud.cc/devices/00e04c0340b5/output?percent=50&duration_ms=5000',
                        method: 'POST',
                        headers: {
                            'Authorization' : 'Bearer 75480d214b46ed685b139dc49ddaf7d1cbd0af94f585e31cd5f76ef5d7d908a4',
                            'Accept' : 'application/vnd.littlebits.v2+json',
                            'Content-Type' : 'application/json'
                        }
                    }).success(function (data, status, headers, config) {
                        //handle success
                        console.log('This is a success '); 
                    }).error(function (data, status, headers, config) {
                        //handle error
                        console.log('This is an error ');
                    });
                }
                
            });
        };
        
//        console.log($scope.nowHour);
//        console.log($scope.checkTimeSlot);        
//        console.log($scope.IsWeekDay);
//        console.log($scope.ThisTrain);
    };
    
    MainController.$inject = ['$scope', 'HelperService', 'TrainViewFactory', '$http'];
    
    angular.module('appSepta')
        .controller('MainController', MainController);
    
}());