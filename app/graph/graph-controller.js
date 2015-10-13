/**
 * Created by bjedrzejewski on 07/10/2015.
 */

angular.module('graphControllers',[]).controller('AnimalsController',['$scope', function($scope){
    var _this = this;
    this.data = [];
    this.dataOption = "animal_testing.csv";
    this.dataOptions =["animal_testing.csv", "smoke.csv"];

    this.selectNewData = function(){
        d3.csv(_this.dataOption, function (error, data) {
            _this.data = data;
            $scope.$apply();
        });
    };

    this.selectNewData("animal_testing.csv");

    d3.csv("animal_testing.csv", function (error, data) {
        _this.data = data;
        $scope.$apply();
    });

    this.dataReady = function() {
        if(_this.data) {
            return true;
        }
        else{
            return false;
        }
    };

}]);