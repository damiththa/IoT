(function () {
    "use strict";
    var MainController = function ($scope, HelperService, TrainViewFactory) {
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
        
        if($scope.IsWeekDay){
            var promise = HelperService.getMyTrains();
            promise.then(function (data){
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
                        if($scope.ThisTrain.late > 5){ //train late threshold
                            lightOn = true;
                            break;
                        };
                    };
                };
                
//                console.log(lightOn);
                if(lightOn){
                    //NOTE: This is where you post to littebits
                    console.log('Train is late');
                }
                
            });
        };
        
//        console.log($scope.nowHour);
//        console.log($scope.checkTimeSlot);        
//        console.log($scope.IsWeekDay);
//        console.log($scope.ThisTrain);
    };
    
    MainController.$inject = ['$scope', 'HelperService', 'TrainViewFactory'];
    
    angular.module('appSepta')
        .controller('MainController', MainController);
    
}());