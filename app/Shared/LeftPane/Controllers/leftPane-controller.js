angular.module('eruditeApp.Shared.LeftPaneController', [])
  .controller('AccordionCtrl', ['$scope', function($scope) {

    // $scope.isCollapsed = true;

    $scope.parentPrivilegeIDs = function(y) {
      return y.map(function(x) {
        return x.PrivilegeID;
      });
    };
  }])
  .controller('PrivilegeCtrl', ['$scope', function($scope) {
    $scope.hasPrivilege = false;
    console.log("privilege ctrl");
    var samplePermArray = [1, 2, 3];
    $scope.checkPrivilege = function(privilegeID) {
      console.log("start check");
      angular.forEach(samplePermArray, function(value, index) {
        if (value == privilegeID) {
          $scope.hasPrivilege = true;
          console.log("has privilege");
          console.log(value);
        }

      });
      console.log("end check");

    }
  }]);
