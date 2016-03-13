angular.module('eruditeApp.Header.AlertDirective', [])
.directive('navAlerts', [function () {
    return {
        restrict: 'E',
        controller: ['$scope', function($scope){
          $scope.menu = ["a", "b"];
        }],
        templateUrl: '/app/Shared/TopNavigation/Templates/alerts.html'
    }
}]);
