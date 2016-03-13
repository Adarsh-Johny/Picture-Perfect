angular.module('eruditeApp.Shared.tableDirective', [])
.directive('fuzeTable', [function () {
    return {
        restrict: 'E',
        scope :{gridData :'='},
        controller: ['$scope', function($scope){
          $scope.Heading = "Table Name";
          $scope.gridRequest = {
            Filter: {},
            PageIndex: 1,
            PageSize: 5
          };
          $scope.gridTotalRecords = 0;
          $scope.gridData = [];

          $scope.recalculatePaging = function() {
            if ($scope.gridRequest.PageIndex == 1) {
              $scope.gridPrevDisabled = true;
              $scope.gridFromRecord = $scope.gridRequest.PageIndex;
              if ($scope.gridRequest.PageSize > $scope.gridTotalRecords) {
                $scope.gridNextDisabled = true;
                $scope.gridToRecord = $scope.gridTotalRecords;
              } else {
                $scope.gridNextDisabled = false;
                $scope.gridToRecord = $scope.gridRequest.PageSize;
              }
            } else {
              $scope.gridPrevDisabled = false;
              $scope.gridFromRecord = $scope.gridToRecord + 1;
              if ($scope.gridRequest.PageSize * $scope.gridRequest.PageIndex > $scope.gridTotalRecords) {
                $scope.gridNextDisabled = true;
                $scope.gridToRecord = $scope.gridTotalRecords
              } else {
                $scope.gridNextDisabled = false;
                $scope.gridToRecord = $scope.gridRequest.PageSize * $scope.gridRequest.PageIndex;
              }
            }
          }

          $scope.nextPage = function() {
            if (!$scope.gridNextDisabled) {
              $scope.gridRequest.PageIndex++;
              $scope.loadGrid();
            }
          }

          $scope.prevPage = function() {
            if (!$scope.gridPrevDisabled) {
              $scope.gridRequest.PageIndex--;
              $scope.loadGrid();
            }
          }


          $scope.recalculatePaging();
          $scope.loadGrid();
        }],
        templateUrl: '/app/Shared/Templates/table.html'
    }
}]);
